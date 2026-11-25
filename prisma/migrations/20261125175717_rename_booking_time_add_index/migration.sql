/*
  Warnings:

  - Changed the type of `time` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BookingTime" AS ENUM ('09:00', '13:00', '18:00');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "time",
ADD COLUMN     "time" "BookingTime" NOT NULL;

-- DropEnum
DROP TYPE "Time";

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
