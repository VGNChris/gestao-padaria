const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Relatório financeiro
async function relatorioFinanceiro(req, res) {
  const { inicio, fim } = req.query;
  const where = {};
  if (inicio && fim) {
    where.dataEntrega = {
      gte: new Date(inicio),
      lte: new Date(fim),
    };
  }
  const encomendas = await prisma.encomenda.findMany({
    where,
    include: { itensEncomenda: { include: { pao: true } } },
  });
  const faturamentoTotal = encomendas.reduce((sum, e) => sum + e.valorTotal, 0);
  const totalEncomendas = encomendas.length;
  const rankingValor = {};
  const rankingQtd = {};
  encomendas.forEach(e => {
    e.itensEncomenda.forEach(item => {
      if (!rankingValor[item.pao.nome]) rankingValor[item.pao.nome] = 0;
      if (!rankingQtd[item.pao.nome]) rankingQtd[item.pao.nome] = 0;
      rankingValor[item.pao.nome] += item.quantidadePacotes * item.pao.valorPacote;
      rankingQtd[item.pao.nome] += item.quantidadePacotes;
    });
  });
  const maisVendidosValor = Object.entries(rankingValor).sort((a,b) => b[1]-a[1]);
  const maisVendidosQtd = Object.entries(rankingQtd).sort((a,b) => b[1]-a[1]);
  res.json({ faturamentoTotal, totalEncomendas, maisVendidosValor, maisVendidosQtd });
}

module.exports = { relatorioFinanceiro }; 