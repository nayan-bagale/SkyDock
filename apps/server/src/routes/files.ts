import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import express from "express";
import s3 from "../config/aws-s3";

const router = express.Router();

const getObjectUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

const putObjectUrl = async (filename: string, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${filename}`,
    ContentType: contentType,
  });
  return await getSignedUrl(s3, command);
};

router.get("/files/upload", async (req, res) => {
  // const { filename, contentType } = req.body;
  // if (!filename || !contentType) {
  //   res.status(400).json({ message: "Filename and contentType are required" });
  //   return;
  // }

  const url = await putObjectUrl(`image-${Date.now()}.png`, `image/png`);

  res.json({ url });
});

export default router;
