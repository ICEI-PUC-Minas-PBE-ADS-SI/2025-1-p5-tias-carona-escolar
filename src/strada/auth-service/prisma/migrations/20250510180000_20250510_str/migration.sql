/*
  Warnings:

  - You are about to drop the column `numberOfRecipes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CuisineStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteRecipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeCuisineStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeMealType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ViewRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteRecipe" DROP CONSTRAINT "FavoriteRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteRecipe" DROP CONSTRAINT "FavoriteRecipe_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeCuisineStyle" DROP CONSTRAINT "RecipeCuisineStyle_cuisineStyleId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeCuisineStyle" DROP CONSTRAINT "RecipeCuisineStyle_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeMealType" DROP CONSTRAINT "RecipeMealType_mealTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeMealType" DROP CONSTRAINT "RecipeMealType_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "ViewRecipe" DROP CONSTRAINT "ViewRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "ViewRecipe" DROP CONSTRAINT "ViewRecipe_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "numberOfRecipes";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "CuisineStyle";

-- DropTable
DROP TABLE "FavoriteRecipe";

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "MealType";

-- DropTable
DROP TABLE "Recipe";

-- DropTable
DROP TABLE "RecipeCuisineStyle";

-- DropTable
DROP TABLE "RecipeIngredient";

-- DropTable
DROP TABLE "RecipeMealType";

-- DropTable
DROP TABLE "ViewRecipe";
