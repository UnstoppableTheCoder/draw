/*
  Warnings:

  - You are about to drop the column `roomId` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `BoardVersion` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `ImageAsset` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoomMember` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[boardId,index]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `boardId` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `BoardVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `ImageAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Invite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `boardId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_roomId_fkey";

-- DropForeignKey
ALTER TABLE "BoardVersion" DROP CONSTRAINT "BoardVersion_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_roomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_roomId_fkey";

-- DropForeignKey
ALTER TABLE "ImageAsset" DROP CONSTRAINT "ImageAsset_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_userId_fkey";

-- DropIndex
DROP INDEX "ActivityLog_roomId_createdAt_idx";

-- DropIndex
DROP INDEX "BoardVersion_roomId_createdAt_idx";

-- DropIndex
DROP INDEX "Call_roomId_startedAt_idx";

-- DropIndex
DROP INDEX "ChatMessage_roomId_createdAt_idx";

-- DropIndex
DROP INDEX "ImageAsset_roomId_createdAt_idx";

-- DropIndex
DROP INDEX "Invite_roomId_email_idx";

-- DropIndex
DROP INDEX "Page_roomId_index_key";

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "roomId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BoardVersion" DROP COLUMN "roomId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "roomId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "roomId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImageAsset" DROP COLUMN "roomId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "roomId",
ADD COLUMN     "boardId" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "BoardRole" NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "roomId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Room";

-- DropTable
DROP TABLE "RoomMember";

-- DropEnum
DROP TYPE "RoomRole";

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardMember" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "BoardRole" NOT NULL DEFAULT 'VIEWER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_slug_key" ON "Board"("slug");

-- CreateIndex
CREATE INDEX "Board_ownerId_idx" ON "Board"("ownerId");

-- CreateIndex
CREATE INDEX "Board_isPublic_updatedAt_idx" ON "Board"("isPublic", "updatedAt");

-- CreateIndex
CREATE INDEX "BoardMember_userId_idx" ON "BoardMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardMember_boardId_userId_key" ON "BoardMember"("boardId", "userId");

-- CreateIndex
CREATE INDEX "ActivityLog_boardId_createdAt_idx" ON "ActivityLog"("boardId", "createdAt");

-- CreateIndex
CREATE INDEX "BoardVersion_boardId_createdAt_idx" ON "BoardVersion"("boardId", "createdAt");

-- CreateIndex
CREATE INDEX "Call_boardId_startedAt_idx" ON "Call"("boardId", "startedAt");

-- CreateIndex
CREATE INDEX "ChatMessage_boardId_createdAt_idx" ON "ChatMessage"("boardId", "createdAt");

-- CreateIndex
CREATE INDEX "ImageAsset_boardId_createdAt_idx" ON "ImageAsset"("boardId", "createdAt");

-- CreateIndex
CREATE INDEX "Invite_boardId_email_idx" ON "Invite"("boardId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Page_boardId_index_key" ON "Page"("boardId", "index");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardVersion" ADD CONSTRAINT "BoardVersion_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
