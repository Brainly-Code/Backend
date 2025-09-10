-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';
