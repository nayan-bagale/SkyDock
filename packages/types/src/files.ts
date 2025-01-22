export interface AllFilesResponse {
  id: string;
  name: string;
  is_folder: boolean;
  parent_id: string | null;
  user_id: string;
  size: string;
  mime_type: string | null;
  s3_key: string | null;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  last_modified: Date;
}

export interface CreateFolderRequest {
  id: string;
  isFolder: boolean;
  name: string;
  parent: string;
  details: {
    size: number;
    lastModified: string;
  };
  children: string[];
}
