/*
  Warnings:

  - A unique constraint covering the columns `[miniModuleId,number]` on the table `LessonVideo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LessonVideo_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "LessonVideo_miniModuleId_number_key" ON "LessonVideo"("miniModuleId", "number");
