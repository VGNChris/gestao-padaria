-- CreateEnum
CREATE TYPE "StatusProducao" AS ENUM ('PENDENTE', 'EM_PRODUCAO', 'PRONTO_PARA_ENTREGA', 'ENTREGUE', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO');

-- CreateTable
CREATE TABLE "Pao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "unidadesPorPacote" INTEGER NOT NULL,
    "valorPacote" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encomenda" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "dataEncomenda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataEntrega" TIMESTAMP(3) NOT NULL,
    "statusProducao" "StatusProducao" NOT NULL DEFAULT 'PENDENTE',
    "statusPagamento" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "Encomenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemEncomenda" (
    "id" SERIAL NOT NULL,
    "encomendaId" INTEGER NOT NULL,
    "paoId" INTEGER NOT NULL,
    "quantidadePacotes" INTEGER NOT NULL,

    CONSTRAINT "ItemEncomenda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemEncomenda" ADD CONSTRAINT "ItemEncomenda_encomendaId_fkey" FOREIGN KEY ("encomendaId") REFERENCES "Encomenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemEncomenda" ADD CONSTRAINT "ItemEncomenda_paoId_fkey" FOREIGN KEY ("paoId") REFERENCES "Pao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
