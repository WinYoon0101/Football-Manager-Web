-- AlterTable
ALTER TABLE "parameters" ADD COLUMN     "categorySort" TEXT[] DEFAULT ARRAY['điểm', 'hiệu_số', 'bàn_thắng']::TEXT[],
ADD COLUMN     "drawScore" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "loseScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winScore" INTEGER NOT NULL DEFAULT 3;
