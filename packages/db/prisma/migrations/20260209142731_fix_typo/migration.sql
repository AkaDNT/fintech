/*
  Warnings:

  - You are about to drop the column `createAt` on the `FileObject` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `FileObject` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileObject" DROP COLUMN "createAt",
DROP COLUMN "createBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
