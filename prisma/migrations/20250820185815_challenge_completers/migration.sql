/*
  Warnings:

  - You are about to drop the column `completions` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "completions";

-- CreateTable
CREATE TABLE "CompletedChallenges" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,

    CONSTRAINT "CompletedChallenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompletedChallengesToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompletedChallengesToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompletedChallengesToCourse_B_index" ON "_CompletedChallengesToCourse"("B");

-- AddForeignKey
ALTER TABLE "CompletedChallenges" ADD CONSTRAINT "CompletedChallenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedChallenges" ADD CONSTRAINT "CompletedChallenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompletedChallengesToCourse" ADD CONSTRAINT "_CompletedChallengesToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "CompletedChallenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompletedChallengesToCourse" ADD CONSTRAINT "_CompletedChallengesToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
