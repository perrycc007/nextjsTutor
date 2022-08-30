/*
  Warnings:

  - You are about to drop the `interested` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `apply` DROP FOREIGN KEY `Apply_userId_fkey`;

-- DropForeignKey
ALTER TABLE `interested` DROP FOREIGN KEY `Interested_authorId_fkey`;

-- AlterTable
ALTER TABLE `profile` ADD COLUMN `availtime` VARCHAR(600) NULL,
    MODIFY `subject` VARCHAR(45) NULL,
    MODIFY `place` VARCHAR(45) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `password` TINYTEXT NOT NULL;

-- DropTable
DROP TABLE `interested`;

-- CreateTable
CREATE TABLE `favourite` (
    `favouriteid` INTEGER NOT NULL,
    `caseid` JSON NOT NULL,
    `userid` INTEGER NOT NULL,

    UNIQUE INDEX `favourite_userid_key`(`userid`),
    PRIMARY KEY (`favouriteid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `favourite` ADD CONSTRAINT `Favourite_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;
