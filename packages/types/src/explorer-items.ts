import React from "react";
import { ActionsT } from "./common";
import { OptionalExceptForId } from "./custom-types";
import { ExplorerTabs } from "./enums/explorer";
import { ExplorerItemsPrismaT } from "./prisma";

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

export type PatchItemRequest = Omit<
  OptionalExceptForId<ExplorerItemsPrismaT, "id">,
  "user_id"
>;

export interface FolderT {
  id: string;
  isFolder: true;
  name: string;
  parent: string;
  details: {
    size: number;
    lastModified: string;
  };
  isDeleted?: boolean;
  deletedAt?: Date | null;
  children: string[];
}

export interface FileT {
  id: string;
  isFolder: false;
  state?: {
    currentState:
      | "idle"
      | "success"
      | "failed"
      | "cancelled"
      | "uploding"
      | "downloading";
    progress: number;
  };
  name: string;
  parent: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  details: {
    name: string;
    size: string;
    type: string;
    lastModified: string;
    // File: File;
  };
}
export type ExplorerItemsActiveTabs = (typeof ExplorerTabs)[number];

export interface ExplorerT {
  explorerItems: {
    [key: string]: FileT | FolderT;
  };
  currentFolder: string;
  backStack: string[];
  forwardStack: string[];
  actions: ActionsT;
  activeTab: ExplorerItemsActiveTabs;
  settings: {
    view: "grid" | "row";
  };
  itemDragged: null | FileT | FolderT;
  clipboard: {
    items: string[];
    operation: "copy" | "cut" | null;
    // sourceFolder: string | null;
  };
  state: {
    isLoading: boolean;
  };
}

export type ExplorerItemT = FileT | FolderT;

export type handleDragStartT = (e: any, item: FileT | FolderT) => void;

export type handleDropT = (
  e: React.DragEvent<HTMLElement>,
  item: FileT | FolderT,
  targetIndex: number
) => Promise<void>;

export type DragEventT = (e: React.DragEvent<HTMLElement>) => void;

export type MouseEventT = (
  event: MouseEvent | TouchEvent | PointerEvent,
  info: any
) => void;
