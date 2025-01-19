-- CreateTable
CREATE TABLE "ExplorerItems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_folder" BOOLEAN NOT NULL,
    "parent_id" TEXT,
    "user_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "mime_type" TEXT,
    "s3_key" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ExplorerItems_id_key" ON "ExplorerItems"("id");
