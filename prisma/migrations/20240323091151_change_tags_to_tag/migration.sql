/*
  Warnings:

  - You are about to drop the column `tags` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tag]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tag` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tag_tags_key";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tags",
ADD COLUMN     "tag" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tag_key" ON "Tag"("tag");
