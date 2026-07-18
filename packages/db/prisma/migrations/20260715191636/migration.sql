/*
  Warnings:

  - You are about to drop the column `index` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[boardId,orderKey]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderKey` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Page_boardId_index_key";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "index",
ADD COLUMN     "orderKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Page_boardId_orderKey_key" ON "Page"("boardId", "orderKey");
