-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
