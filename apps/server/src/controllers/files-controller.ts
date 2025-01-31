import { CreateFolderRequest } from "@repo/types";
import { Request, Response } from "express";
import { prisma } from "../config/db";
import messages from "../constants/messages";
import { INTERNALERROR } from "../constants/status";
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
    const userId = req.user?.id as string;
    const signed_urls = await Promise.all(
      files.map(async (file) => {
        const [filename, extension] = file.name.split(".");
        const url = await Store.putObjectUrl(
          userId,
          // `${filename?.split(" ").join("-")}-${file.id}.${extension}`,
          `${file.id}.${extension}`,
          file.type
        );
        return { [file.id]: url };
      })
    );
    res.json(signed_urls);
  }

  async saveUploadedFilesToDB(req: Request, res: Response) {
    const files = req.body as RequestFileForUploaded[];
    try {
      // Save files to database
      const userId = req.user?.id as string;
      const savedFiles = await prisma.explorerItems.createMany({
        data: files.map((file) => ({
          id: file.id,
          name: file.name,
          is_folder: file.isFolder,
          parent_id: file.parent,
          user_id: userId,
          size: file.details.size,
          mime_type: file.details.type,
          last_modified: new Date(parseInt(file.details.lastModified)),
        })),
      });
      res.json({ message: "Upload successful" });
    } catch (err) {
      console.log(err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async getAllFiles(req: Request, res: Response) {
    const userId = req.user?.id as string;
    try {
      const files = await prisma.explorerItems.findMany({
        where: { user_id: userId },
      });
      res.json(files);
    } catch (err) {
      console.log(err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async getFileUrl(req: Request, res: Response) {
    const fileName = req.params.id as string;
    const userId = req.user?.id as string;

    try {
      const fileUrl = await Store.getObjectUrl(`${userId}/${fileName}`);
      res.json({ url: fileUrl });
    } catch (err) {
      console.log(err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteFile(req: Request, res: Response) {
    const fileId = req.params.id as string;
    const userId = req.user?.id as string;
    try {
      await prisma.$transaction(async (tx) => {
        const file = await tx.explorerItems.findUnique({
          where: { id: fileId },
        });
        if (!file) {
          return res.status(INTERNALERROR).json({ message: "File not found" });
        }

        const extension = file.name.split(".").pop() as string;

        await Store.deleteObject(`${userId}/${fileId}.${extension}`);

        await tx.explorerItems.delete({ where: { id: fileId } });
      });

      return res.json({ message: "File deleted" });
    } catch (err) {
      console.log(err);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async patchFile(req: Request, res: Response) {
    const fileId = req.params.id as string;
    try {
      await prisma.explorerItems.update({
        where: { id: fileId },
        data: req.body as { name: string },
      });
      res.json({ message: "File updated" });
    } catch (err) {
      console.log(err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async createFolder(req: Request, res: Response) {
    const data = req.body as CreateFolderRequest;
    const userId = req.user?.id as string;
    try {
      await prisma.explorerItems.create({
        data: {
          id: data.id,
          name: data.name,
          is_folder: true,
          parent_id: data.parent,
          user_id: userId,
          size: "0",
          mime_type: "folder",
          last_modified: new Date(),
        },
      });
      res.json({ message: "Folder created" });
    } catch (err) {
      console.log(err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteFolder(req: Request, res: Response) {
    const folderItems = req.body as string[];
    const userId = req.user?.id as string;
    try {
      await prisma.$transaction(async (tx) => {
        const items = await tx.explorerItems.findMany({
          where: { id: { in: folderItems }, user_id: userId },
        });

        const files = items
          .filter((item) => !item.is_folder)
          .map((file) => `${userId}/${file.id}.${file.name.split(".").pop()}`);

        await Promise.allSettled(
          files.map(async (file) => await Store.deleteObject(file))
        );

        await tx.explorerItems.deleteMany({
          where: { id: { in: folderItems }, user_id: userId },
        });
      });
      res.json({ message: "Folder deleted" });
    } catch (err) {
      console.log(err);
      res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  // async moveFileIntoFolder(req: Request, res: Response) {
  //   const { fileId, folderId } = req.body;
  //   const userId = req.user?.id as string;

  //   console.log(fileId, folderId);
  //   try {
  //     await prisma.explorerItems.update({
  //       where: { id: fileId },
  //       data: { parent_id: folderId },
  //     });
  //     res.json({ message: "File moved" });
  //   } catch (err) {
  //     console.log(err);
  //   res.status(INTERNALERROR).json({ message: messages.INTERNAL_SERVER_ERROR });
  //   }
  // }
}

export default FilesController.getInstance();
