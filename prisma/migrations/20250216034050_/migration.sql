/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `codeVerifier` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `inviteToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `loggedIn` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "accessToken",
DROP COLUMN "codeVerifier",
DROP COLUMN "inviteToken",
DROP COLUMN "loggedIn",
DROP COLUMN "state";
