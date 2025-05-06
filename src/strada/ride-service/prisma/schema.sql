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
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "User" (id) ON DELETE CASCADE,
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
