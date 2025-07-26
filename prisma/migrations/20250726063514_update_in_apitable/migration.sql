-- CreateEnum
CREATE TYPE "ApiStatus" AS ENUM ('active', 'inactive', 'deleted', 'expired');

-- AlterTable
ALTER TABLE "Api" ADD COLUMN     "status" "ApiStatus" NOT NULL DEFAULT 'active';
