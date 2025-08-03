-- AlterTable
ALTER TABLE "users" ADD COLUMN     "photo" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'local',
ALTER COLUMN "hash" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
