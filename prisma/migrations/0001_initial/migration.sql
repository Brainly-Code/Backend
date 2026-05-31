-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WRIGHT', 'WRONG', 'JUST');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "username" TEXT,
    "role" "Role" DEFAULT 'USER',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "courseId" INTEGER,
    "photo" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfileImage" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserProfileImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "duration" TEXT NOT NULL DEFAULT '',
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCourseProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "UserCourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseModule" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userModuleProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseModuleId" INTEGER NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" INTEGER,

    CONSTRAINT "userModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniModule" (
    "id" SERIAL NOT NULL,
    "courseModuleId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "MiniModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniModuleProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "miniModuleId" INTEGER NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiniModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "more" TEXT,
    "example" TEXT,
    "note" TEXT,
    "assignment" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "miniModuleId" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonVideo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "miniModuleId" INTEGER NOT NULL,

    CONSTRAINT "LessonVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSolution" (
    "id" SERIAL NOT NULL,
    "solution" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "LessonSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLessonProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "relation" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 0,
    "useEditor" BOOLEAN DEFAULT false,
    "documentUrl" TEXT,
    "useInput" BOOLEAN DEFAULT false,
    "takesUrl" BOOLEAN DEFAULT false,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseResource" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,

    CONSTRAINT "ChallengeLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeInstructions" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChallengeInstructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSolutions" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "solution" TEXT NOT NULL,
    "challengeId" INTEGER NOT NULL,

    CONSTRAINT "ChallengeSolutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedChallenges" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT,
    "userSolution" TEXT,
    "correct" "Status" NOT NULL DEFAULT 'JUST',
    "marks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CompletedChallenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_base" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sourceId" INTEGER,
    "sourceType" TEXT,
    "embedding" vector(1536),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fine_tuning_jobs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "modelId" TEXT,
    "trainingData" JSONB NOT NULL,
    "results" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fine_tuning_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompletedChallengesToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompletedChallengesToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileImage_userId_key" ON "UserProfileImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CourseLike_userId_courseId_key" ON "CourseLike"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseModule_courseId_number_key" ON "CourseModule"("courseId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Video_courseId_number_key" ON "Video"("courseId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "MiniModule_courseModuleId_number_key" ON "MiniModule"("courseModuleId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "LessonVideo_miniModuleId_number_key" ON "LessonVideo"("miniModuleId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSolution_lessonId_key" ON "LessonSolution"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseResource_courseId_number_key" ON "CourseResource"("courseId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeLike_userId_challengeId_key" ON "ChallengeLike"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSolutions_number_key" ON "ChallengeSolutions"("number");

-- CreateIndex
CREATE UNIQUE INDEX "chat_sessions_sessionId_key" ON "chat_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "_CompletedChallengesToCourse_B_index" ON "_CompletedChallengesToCourse"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileImage" ADD CONSTRAINT "UserProfileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLike" ADD CONSTRAINT "CourseLike_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLike" ADD CONSTRAINT "CourseLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourseProgress" ADD CONSTRAINT "UserCourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourseProgress" ADD CONSTRAINT "UserCourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseModule" ADD CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userModuleProgress" ADD CONSTRAINT "userModuleProgress_courseModuleId_fkey" FOREIGN KEY ("courseModuleId") REFERENCES "CourseModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userModuleProgress" ADD CONSTRAINT "userModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniModule" ADD CONSTRAINT "MiniModule_courseModuleId_fkey" FOREIGN KEY ("courseModuleId") REFERENCES "CourseModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniModuleProgress" ADD CONSTRAINT "MiniModuleProgress_miniModuleId_fkey" FOREIGN KEY ("miniModuleId") REFERENCES "MiniModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniModuleProgress" ADD CONSTRAINT "MiniModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_miniModuleId_fkey" FOREIGN KEY ("miniModuleId") REFERENCES "MiniModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonVideo" ADD CONSTRAINT "LessonVideo_miniModuleId_fkey" FOREIGN KEY ("miniModuleId") REFERENCES "MiniModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolution" ADD CONSTRAINT "LessonSolution_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRating" ADD CONSTRAINT "CourseRating_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRating" ADD CONSTRAINT "CourseRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseResource" ADD CONSTRAINT "CourseResource_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeLike" ADD CONSTRAINT "ChallengeLike_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeLike" ADD CONSTRAINT "ChallengeLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeInstructions" ADD CONSTRAINT "ChallengeInstructions_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSolutions" ADD CONSTRAINT "ChallengeSolutions_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedChallenges" ADD CONSTRAINT "CompletedChallenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedChallenges" ADD CONSTRAINT "CompletedChallenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompletedChallengesToCourse" ADD CONSTRAINT "_CompletedChallengesToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "CompletedChallenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompletedChallengesToCourse" ADD CONSTRAINT "_CompletedChallengesToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

