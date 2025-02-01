import express from "express";
import filesController from "../controllers/files-controller";
import { middleware } from "../middleware";

const router = express.Router();

router.get("/files", middleware, async (req, res) => {
  await filesController.getAllFiles(req, res);
});

router.get("/file/:id", middleware, async (req, res) => {
  await filesController.getFileUrl(req, res);
});

router.patch("/file/:id", middleware, async (req, res) => {
  await filesController.patchFileAndFolder(req, res);
});

router.delete("/file/:id", middleware, async (req, res) => {
  await filesController.deleteFile(req, res);
});

router.post("/files/generate-upload-urls", middleware, async (req, res) => {
  await filesController.generateUploadUrls(req, res);
});

router.post("/files/upload", middleware, async (req, res) => {
  await filesController.saveUploadedFilesToDB(req, res);
});

router.post("/folder/create", middleware, async (req, res) => {
  await filesController.createFolder(req, res);
});

router.post("/folder/delete", middleware, async (req, res) => {
  await filesController.deleteFolder(req, res);
});

export default router;
