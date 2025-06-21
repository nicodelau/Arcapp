/*
  Warnings:

  - You are about to drop the column `descripcion` on the `ProductoFacturado` table. All the data in the column will be lost.
  - You are about to drop the column `precioUnitario` on the `ProductoFacturado` table. All the data in the column will be lost.
  - Added the required column `productoId` to the `ProductoFacturado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductoFacturado" DROP COLUMN "descripcion",
DROP COLUMN "precioUnitario",
ADD COLUMN     "productoId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductoFacturado" ADD CONSTRAINT "ProductoFacturado_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
