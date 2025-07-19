export enum StorageLimit {
  MB_10 = 10 * 1024 * 1024, // 10MB
  MB_100 = 100 * 1024 * 1024, // 100MB
  GB_1 = 1 * 1024 * 1024 * 1024, // 1GB
  GB_10 = 10 * 1024 * 1024 * 1024, // 10GB
  GB_100 = 100 * 1024 * 1024 * 1024, // 100GB
}

export const StorageLimitLabel = {
  [StorageLimit.MB_10]: "10MB",
  [StorageLimit.MB_100]: "100MB",
  [StorageLimit.GB_1]: "1GB",
  [StorageLimit.GB_10]: "10GB",
  [StorageLimit.GB_100]: "100GB",
} as const;
