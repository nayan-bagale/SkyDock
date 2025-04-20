import { JwtPayload } from "jsonwebtoken";

export interface User extends JwtPayload {
  user: { id: string; name: string; email: string };
}

export interface RequestFilesForSignedUrl {
  name: string;
  type: string;
  id: string;
  size: string;
}

export interface RequestFileForUploaded {
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
