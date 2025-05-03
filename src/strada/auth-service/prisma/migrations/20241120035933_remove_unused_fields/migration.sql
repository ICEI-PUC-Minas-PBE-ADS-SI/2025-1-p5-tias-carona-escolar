/*
  Warnings:

  - You are about to drop the column `category` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `cookTime` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `servingSize` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `sourceUrl` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `totalTime` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `_UserFollowing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserFollowing" DROP CONSTRAINT "_UserFollowing_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollowing" DROP CONSTRAINT "_UserFollowing_B_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "category",
DROP COLUMN "cookTime",
DROP COLUMN "experienceLevel",
DROP COLUMN "servingSize",
DROP COLUMN "sourceUrl",
DROP COLUMN "tags",
DROP COLUMN "totalTime",
DROP COLUMN "videoUrl";

-- DropTable
DROP TABLE "_UserFollowing";
