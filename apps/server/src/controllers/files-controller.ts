import { CreateFolderRequest, FileT, FolderT } from "@skydock/types";
import { Request, Response } from "express";
import { prisma } from "../config/db";
import messages from "../constants/messages";
import { INTERNALERROR, PAYLOADTOOLARGE } from "../constants/status";
import { userAvailableStorageCheck } from "../helpers/user-available-storage-check";
import logger from "../logger";
import Store from "../services/object-storage";
import { RequestFileForUploaded, RequestFilesForSignedUrl } from "../types";

class FilesController {
  private static instance: FilesController;

  private constructor() {}

  public static getInstance(): FilesController {
    if (!FilesController.instance) {
      FilesController.instance = new FilesController();
    }
    return FilesController.instance;
  }

  async generateUploadUrls(req: Request, res: Response) {
    const files = req.body.files as RequestFilesForSignedUrl[];
    const userId = req.userInfo?.id as string;

    try {
      const sizeRequired = files.reduce(
        (acc, file) => acc + parseInt(file.size),
        0
      );
      const userWithPlan = await prisma.user.findUnique({
        where: { id: req.userInfo?.id as string },
        select: {
          usedStorage: true,
          UserPlan: {
            where: { status: "active" },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              plan: {
                select: {
                  storageLimit: true,
                },
              },
            },
          },
        },
      });
      const usedStorage = userWithPlan?.usedStorage ?? 0;
      const storageLimit = userWithPlan?.UserPlan[0]?.plan?.storageLimit ?? 0;
      const canUpload = Number(usedStorage) + sizeRequired <= storageLimit;

      if (!canUpload) {
        return res.status(PAYLOADTOOLARGE).json({
          message: "Storage limit exceeded for your current plan.",
        });
      }
    } catch (e) {
      logger.error("Error in file upload", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    const signed_urls = await Promise.all(
      files.map(async (file) => {
        const extension = file.name.split(".").pop();
        const url = await Store.putObjectUrl(
          userId,
          // `${filename?.split(" ").join("-")}-${file.id}.${extension}`,
          `${file.id}.${extension}`,
          file.type,
          Number(file.size)
        );
        return { [file.id]: url };
      })
    );
    res.json(signed_urls);
  }

  async saveUploadedFilesToDB(req: Request, res: Response) {
    const files = req.body as RequestFileForUploaded[];

    const sizeRequired = files.reduce(
      (acc, file) => acc + parseInt(file.details.size),
      0
    );

    try {
      const userWithPlan = await prisma.user.findUnique({
        where: { id: req.userInfo?.id as string },
        select: {
          usedStorage: true,
          UserPlan: {
            where: { status: "active" },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              plan: {
                select: {
                  storageLimit: true,
                },
              },
            },
          },
        },
      });

      const usedStorage = userWithPlan?.usedStorage ?? 0;
      const storageLimit = userWithPlan?.UserPlan[0]?.plan?.storageLimit ?? 0;

      const canUpload = Number(usedStorage) + sizeRequired <= storageLimit;

      if (!canUpload) {
        return res.status(PAYLOADTOOLARGE).json({
          message: "Storage limit exceeded for your current plan.",
        });
      }
    } catch (e) {
      logger.error("Error in file upload", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    try {
      // Save files to database
      const userId = req.userInfo?.id as string;

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: {
            usedStorage: {
              increment: sizeRequired,
            },
          },
        });

        await tx.explorerItems.createMany({
          data: files.map((file) => ({
            id: file.id,
            name: file.name,
            is_folder: file.isFolder,
            parent_id: file.parent,
            user_id: userId,
            size: parseInt(file.details.size),
            mime_type: file.details.type,
            last_modified: new Date(parseInt(file.details.lastModified)),
          })),
        });
      });
      res.json({ message: "Upload successful" });
    } catch (err) {
      logger.error("Error saving files metadata to DB", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async getAllFiles(req: Request, res: Response) {
    const userId = req.userInfo?.id as string;
    try {
      const files = await prisma.explorerItems.findMany({
        where: { user_id: userId },
      });
      res.json(files);
    } catch (err) {
      logger.error("Error fetching files", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async getFileUrl(req: Request, res: Response) {
    const fileName = req.params.id as string;
    const userId = req.userInfo?.id as string;

    try {
      const fileUrl = await Store.getObjectUrl(`${userId}/${fileName}`);
      res.json({ url: fileUrl });
    } catch (err) {
      logger.error("Error fetching signed file URL", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async patchFileAndFolder(req: Request, res: Response) {
    const fileId = req.params.id as string;
    const user_id = req.userInfo?.id as string;
    try {
      await prisma.explorerItems.update({
        where: { id: fileId, user_id },
        data: req.body as { name: string },
      });
      res.json({ message: "File updated" });
    } catch (err) {
      logger.error("Error updating file", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async createFolder(req: Request, res: Response) {
    const data = req.body as CreateFolderRequest;
    const userId = req.userInfo?.id as string;
    try {
      await prisma.explorerItems.create({
        data: {
          id: data.id,
          name: data.name,
          is_folder: true,
          parent_id: data.parent,
          user_id: userId,
          size: 0,
          mime_type: "folder",
          last_modified: new Date(),
        },
      });
      res.json({ message: "Folder created" });
    } catch (err) {
      logger.error("Error creating folder", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteFile(req: Request, res: Response) {
    const fileId = req.params.id as string;
    const userId = req.userInfo?.id as string;
    try {
      const file = await prisma.explorerItems.findUnique({
        where: { id: fileId, is_deleted: true },
      });
      if (!file) {
        return res.status(INTERNALERROR).json({ message: "File not found" });
      }
      const extension = file.name.split(".").pop() as string;

      await prisma.$transaction(async (tx) => {
        await Store.deleteObject(`${userId}/${fileId}.${extension}`);

        await tx.user.update({
          where: { id: userId },
          data: {
            usedStorage: {
              decrement: file.size,
            },
          },
        });

        await tx.explorerItems.delete({ where: { id: fileId } });
      });

      return res.json({ message: "File deleted" });
    } catch (err) {
      logger.error("Error deleting file", err);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteFolder(req: Request, res: Response) {
    const folderItems = req.body as string[];
    const userId = req.userInfo?.id as string;
    try {
      await prisma.$transaction(async (tx) => {
        const items = await tx.explorerItems.findMany({
          where: { id: { in: folderItems }, user_id: userId, is_deleted: true },
        });

        const files = items
          .filter((item) => !item.is_folder)
          .map((file) => `${userId}/${file.id}.${file.name.split(".").pop()}`);

        await Promise.allSettled(
          files.map(async (file) => await Store.deleteObject(file))
        );

        const totalSize = items.reduce((acc, item) => acc + item.size, 0);
        await tx.user.update({
          where: { id: userId },
          data: {
            usedStorage: {
              decrement: totalSize,
            },
          },
        });

        await tx.explorerItems.deleteMany({
          where: { id: { in: folderItems }, user_id: userId },
        });
      });
      res.json({ message: "Folder deleted" });
    } catch (err) {
      logger.error("Error deleting folder", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async softDeleteFileAndFolder(req: Request, res: Response) {
    const items = req.body as (FileT | FolderT)[];
    const userId = req.userInfo?.id as string;
    try {
      await prisma.$transaction(async (tx) => {
        await Promise.all(
          items.map(async (item) => {
            await tx.explorerItems.update({
              where: { id: item.id, user_id: userId },
              data: {
                is_deleted: true,
                deletedAt: new Date(),
                parent_id: item.parent,
              },
            });
          })
        );
      });

      res.json({ message: "Files and folders deleted" });
    } catch (err) {
      logger.error("Error deleting files and folders", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async getTextFileContent(req: Request, res: Response) {
    const fileId = req.params.id as string;
    const userId = req.userInfo?.id as string;

    try {
      const file = await prisma.explorerItems.findUnique({
        where: { id: fileId, user_id: userId, is_deleted: false },
      });

      if (!file || file.mime_type !== "text/plain") {
        return res.status(INTERNALERROR).json({ message: "File not found" });
      }

      const content = await Store.getObject(
        `${userId}/${fileId}.${file.name.split(".").pop()}`
      );
      if (!content.Body) {
        return res
          .status(INTERNALERROR)
          .json({ message: "File content not found" });
      }
      const textContent = await content.Body.transformToString();
      res.set("Content-Type", "text/plain");
      res.send(textContent);
    } catch (err) {
      logger.error("Error fetching text file content", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async patchTextFileContent(req: Request, res: Response) {
    const fileId = req.params.id as string;
    const userId = req.userInfo?.id as string;
    const content = req.body.content as string;

    const contentLength = Buffer.byteLength(content, "utf-8");

    try {
      if (!(await userAvailableStorageCheck(userId, contentLength))) {
        return res.status(PAYLOADTOOLARGE).json({
          message: "Storage limit exceeded for your current plan.",
        });
      }

      prisma.$transaction(async (tx) => {
        const file = await tx.explorerItems.findUnique({
          where: { id: fileId, user_id: userId, is_deleted: false },
        });

        if (!file || file.mime_type !== "text/plain") {
          throw new Error("File not found or not a text file");
        }

        await Store.putObject(
          `${userId}/${fileId}.${file.name.split(".").pop()}`,
          content,
          "text/plain"
        );

        await tx.user.update({
          where: { id: userId },
          data: {
            usedStorage: contentLength,
          },
        });

        await tx.explorerItems.update({
          where: { id: fileId, user_id: userId },
          data: {
            last_modified: new Date(),
            size: contentLength,
          },
        });
      });

      res.json({ message: "File content updated" });
    } catch (err) {
      logger.error("Error updating text file content", err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }
}

export default FilesController.getInstance();
