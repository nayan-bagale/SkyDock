import express from "express";
import filesController from "../controllers/files-controller";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

router.get("/files", authMiddleware, async (req, res) => {
  await filesController.getAllFiles(req, res);
});

router.get("/file/:id", authMiddleware, async (req, res) => {
  await filesController.getFileUrl(req, res);
});

router.patch("/file/:id", authMiddleware, async (req, res) => {
  await filesController.patchFileAndFolder(req, res);
});

router.delete("/file/:id", authMiddleware, async (req, res) => {
  await filesController.deleteFile(req, res);
});

router.post("/files/generate-upload-urls", authMiddleware, async (req, res) => {
  await filesController.generateUploadUrls(req, res);
});

router.post("/files/upload", authMiddleware, async (req, res) => {
  await filesController.saveUploadedFilesToDB(req, res);
});

router.post("/folder/create", authMiddleware, async (req, res) => {
  await filesController.createFolder(req, res);
});

router.post("/folder/delete", authMiddleware, async (req, res) => {
  await filesController.deleteFolder(req, res);
});

router.get("/file/text/:id", authMiddleware, async (req, res) => {
  await filesController.getTextFileContent(req, res);
});

router.patch("/file/text/:id", authMiddleware, async (req, res) => {
  await filesController.patchTextFileContent(req, res);
});

router.put(
  "/folderAndFile/softDelete",
  authMiddleware,
  filesController.softDeleteFileAndFolder
);

// router.put("/restore/storage", authMiddleware, async (req, res) => {
//   await filesController.restoreUserStorage(req, res);
// });

export default router;
