-- CreateTable
CREATE TABLE "ViewRecipe" (
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewRecipe_pkey" PRIMARY KEY ("userId","recipeId")
);

-- AddForeignKey
ALTER TABLE "ViewRecipe" ADD CONSTRAINT "ViewRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewRecipe" ADD CONSTRAINT "ViewRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
