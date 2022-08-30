-- CreateTable
CREATE TABLE `interested` (
    `idinterested` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `caseid` VARCHAR(45) NOT NULL,

    INDEX `Interested_authorId_fkey`(`userid`),
    PRIMARY KEY (`idinterested`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `idprofile` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(45) NOT NULL,
    `place` VARCHAR(45) NOT NULL,
    `userid` INTEGER NOT NULL,

    UNIQUE INDEX `Profile_userId_key`(`userid`),
    PRIMARY KEY (`idprofile`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userid` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apply` (
    `idapply` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(45) NOT NULL,
    `place` VARCHAR(45) NOT NULL,
    `userid` INTEGER NOT NULL,

    UNIQUE INDEX `Apply_userId_key`(`userid`),
    PRIMARY KEY (`idapply`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `interested` ADD CONSTRAINT `Interested_authorId_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apply` ADD CONSTRAINT `Apply_userId_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;
