/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('SUPER_ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER';
