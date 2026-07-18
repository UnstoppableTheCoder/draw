/*
  Warnings:

  - The values [ADMIN] on the enum `BoardRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `slug` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BoardRole_new" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
ALTER TABLE "public"."BoardMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "BoardMember" ALTER COLUMN "role" TYPE "BoardRole_new" USING ("role"::text::"BoardRole_new");
ALTER TABLE "Invite" ALTER COLUMN "role" TYPE "BoardRole_new" USING ("role"::text::"BoardRole_new");
ALTER TYPE "BoardRole" RENAME TO "BoardRole_old";
ALTER TYPE "BoardRole_new" RENAME TO "BoardRole";
DROP TYPE "public"."BoardRole_old";
ALTER TABLE "BoardMember" ALTER COLUMN "role" SET DEFAULT 'VIEWER';
COMMIT;

-- DropIndex
DROP INDEX "Board_slug_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "slug",
ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";

-- CreateIndex
CREATE INDEX "Board_favorite_idx" ON "Board"("favorite");
