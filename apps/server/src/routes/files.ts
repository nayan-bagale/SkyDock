import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import express from "express";
import s3 from "../config/aws-s3";
import { middleware } from "../middleware";

export interface FileT {
  id: string;
  isFolder: false;
  name: string;
  parent: string;
  details: {
    name: string;
    size: string;
    type: string;
    lastModified: string;
    // File: File;
  };
}

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

router.post("/files/generate-upload-urls", middleware, async (req, res) => {
  const { files } = req.body;
  // const signed_urls = await Promise.all(
  //   files.map(async (file: any) => {
  //     const [filename, extension] = file.name.split(".");
  //     const url = await putObjectUrl(
  //       `${filename.split(" ").join("-")}-${Date.now()}.${extension}`,
  //       file.type
  //     );
  //     return { [file.id]: url };
  //   })
  // );
  console.log(req.user);
  // const url = await putObjectUrl(`image-${Date.now()}.png`, `image/png`);
  // const url = await getObjectUrl("uploads/image-1734369597730.png");
  res.json("signed_urls");
});

router.post("/files/upload", async (req, res) => {
  const files = req.body as FileT[];
  console.log(files);
  res.json({ message: "Upload successful" });
});

export default router;
