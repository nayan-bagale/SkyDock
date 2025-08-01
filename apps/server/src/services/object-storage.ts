import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/aws-s3";

class Store {
  private static instance: Store;

  private constructor() {}

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  async getObjectUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  async putObjectUrl(
    userId: string,
    filename: string,
    contentType: string,
    contentLength: number
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${userId}/${filename}`,
      ContentType: contentType,
      ContentLength: contentLength,
    });
    return await getSignedUrl(s3, command);
  }

  async putObject(key: string, body: Buffer | string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    return await s3.send(command);
  }

  async deleteObject(key: string) {
    const deletedObj = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    return await s3.send(deletedObj);
  }

  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    return await s3.send(command);
  }
}

export default Store.getInstance();
