-- CreateTable
CREATE TABLE "Api" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hashed_secret" TEXT NOT NULL,
    "full_key" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Api_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Api" ADD CONSTRAINT "Api_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
