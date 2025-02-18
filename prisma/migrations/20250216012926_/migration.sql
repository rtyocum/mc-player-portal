-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "codeVerifier" TEXT,
ADD COLUMN     "inviteToken" TEXT,
ADD COLUMN     "loggedIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
