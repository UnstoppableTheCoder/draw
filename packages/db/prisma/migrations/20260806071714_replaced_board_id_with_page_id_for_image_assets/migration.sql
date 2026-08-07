/*
  Warnings:

  - You are about to drop the column `boardId` on the `ImageAsset` table. All the data in the column will be lost.
  - Added the required column `pageId` to the `ImageAsset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageAsset" DROP CONSTRAINT "ImageAsset_boardId_fkey";

-- DropIndex
DROP INDEX "ImageAsset_boardId_createdAt_idx";

-- AlterTable
ALTER TABLE "ImageAsset" DROP COLUMN "boardId",
ADD COLUMN     "pageId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ImageAsset_pageId_createdAt_idx" ON "ImageAsset"("pageId", "createdAt");

-- AddForeignKey
ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
