-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "cuit" TEXT NOT NULL,
    "clave" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "puntoVenta" INTEGER NOT NULL,
    "tipoCbte" INTEGER NOT NULL,
    "concepto" INTEGER NOT NULL,
    "docTipo" INTEGER NOT NULL,
    "docNro" BIGINT NOT NULL,
    "neto" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cuit_key" ON "User"("cuit");
