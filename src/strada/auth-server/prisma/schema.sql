-- Table for Users
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    imgUrl VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT TRUE
);

-- Table for Recipes
CREATE TABLE "Recipe" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) NOT NULL,
    ingredientsText TEXT NOT NULL,
    preparationMethod TEXT NOT NULL,
    preparationTime INT NOT NULL,
    imgUrl VARCHAR(255),
    difficultyLevel VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    userId UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "User" (id) ON DELETE CASCADE
);

-- Table for Ratings
CREATE TABLE "Rating" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    comment TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    rating INT NOT NULL CHECK (
        rating >= 1
        AND rating <= 5
    ),
    userId UUID NOT NULL,
    recipeId UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "User" (id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe FOREIGN KEY (recipeId) REFERENCES "Recipe" (id) ON DELETE CASCADE
);

-- Table for Ingredients
CREATE TABLE "Ingredient" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Table for RecipeIngredients (many-to-many relationship)
CREATE TABLE "RecipeIngredient" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    recipeId UUID NOT NULL,
    ingredientId UUID NOT NULL,
    CONSTRAINT fk_recipe FOREIGN KEY (recipeId) REFERENCES "Recipe" (id) ON DELETE CASCADE,
    CONSTRAINT fk_ingredient FOREIGN KEY (ingredientId) REFERENCES "Ingredient" (id) ON DELETE CASCADE
);

-- Table for RefreshTokens
CREATE TABLE "RefreshToken" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    token TEXT NOT NULL,
    userId UUID NOT NULL,
    isRevoked BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "User" (id) ON DELETE CASCADE
);

-- Table for PasswordRecovery
CREATE TABLE "PasswordRecovery" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    token TEXT NOT NULL,
    userId UUID NOT NULL,
    isRevoked BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "User" (id) ON DELETE CASCADE
);