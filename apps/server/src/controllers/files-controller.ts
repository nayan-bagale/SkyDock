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
          `${filename?.split(" ").join("-")}-${Date.now()}.${extension}`,
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
}

export default FilesController.getInstance();
