-- CreateTable
CREATE TABLE "CondicionIva" (
    "id" SERIAL NOT NULL,
    "condicionId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "CondicionIva_pkey" PRIMARY KEY ("id")
);
