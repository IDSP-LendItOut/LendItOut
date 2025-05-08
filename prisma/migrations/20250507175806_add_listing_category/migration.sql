/*
  Warnings:

  - You are about to drop the column `price` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `category` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condition` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Groups" AS ENUM ('ELECTRONICS', 'FASHION', 'HOME', 'FURNITURE', 'BOOKS', 'BABY', 'CLOTHING', 'OFFICE', 'SPORTS', 'TOOLS', 'TOYS', 'BEAUTY');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('BAD', 'ADEQUATE', 'GOOD', 'GREAT', 'NEW');

-- CreateEnum
CREATE TYPE "RentalDuration" AS ENUM ('HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "price",
ADD COLUMN     "group" "Groups" NOT NULL,
ADD COLUMN     "condition" "Condition" NOT NULL,
ADD COLUMN     "rentalDuration" "RentalDuration",
ADD COLUMN     "rentalPrice" DOUBLE PRECISION,
ADD COLUMN     "salePrice" DOUBLE PRECISION;
