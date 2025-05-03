/*
  Warnings:

  - You are about to drop the `KitchenTool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeKitchenTool` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `preparationMethod` on the `Recipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "RecipeKitchenTool" DROP CONSTRAINT "RecipeKitchenTool_kitchenToolId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeKitchenTool" DROP CONSTRAINT "RecipeKitchenTool_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "preparationMethod",
ADD COLUMN     "preparationMethod" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" TEXT DEFAULT 'local',
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "numberOfRecipes" DROP NOT NULL,
ALTER COLUMN "numberOfFollowers" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "isActive" DROP NOT NULL;

-- DropTable
DROP TABLE "KitchenTool";

-- DropTable
DROP TABLE "RecipeKitchenTool";

-- CreateTable
CREATE TABLE "_UserFollowing" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollowing_AB_unique" ON "_UserFollowing"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollowing_B_index" ON "_UserFollowing"("B");

-- AddForeignKey
ALTER TABLE "_UserFollowing" ADD CONSTRAINT "_UserFollowing_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowing" ADD CONSTRAINT "_UserFollowing_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
