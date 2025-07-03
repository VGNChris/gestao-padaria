const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lista de produção por data
async function producaoPorData(req, res) {
  const { data } = req.query;
  if (!data) return res.status(400).json({ error: 'Data obrigatória' });
  const encomendas = await prisma.encomenda.findMany({
    where: { dataEntrega: new Date(data) },
    include: { itensEncomenda: { include: { pao: true } } },
  });
  const agregados = {};
  encomendas.forEach(enc => {
    enc.itensEncomenda.forEach(item => {
      const unidadesPorPacote = Number(item.pao.unidadesPorPacote) || 0;
      if (!agregados[item.pao.nome]) agregados[item.pao.nome] = 0;
      agregados[item.pao.nome] += item.quantidadePacotes * unidadesPorPacote;
    });
  });
  const resultado = Object.entries(agregados).map(([nome, totalUnidades]) => ({ nome, totalUnidades }));
  res.json(resultado);
}

module.exports = { producaoPorData }; 