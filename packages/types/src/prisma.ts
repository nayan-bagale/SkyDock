export interface ExplorerItemsPrismaT {
  id: string;
  name: string;
  is_folder: boolean;
  user_id: string;
  parent_id?: string;
  size: string;
  mime_type?: string;
  s3_key?: string;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  last_modified: Date;
}
