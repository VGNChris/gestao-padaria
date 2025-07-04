const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar encomendas com filtros
async function listarEncomendas(req, res) {
  const { statusProducao, statusPagamento, dataEntrega, dataEntregaDe, dataEntregaAte } = req.query;
  const where = {};
  
  if (statusProducao) where.statusProducao = statusProducao;
  if (statusPagamento) where.statusPagamento = statusPagamento;
  
  if (dataEntrega) {
    // Converter para data e criar range para o dia inteiro
    const dataInicio = new Date(dataEntrega);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(dataEntrega);
    dataFim.setHours(23, 59, 59, 999);
    
    where.dataEntrega = {
      gte: dataInicio,
      lte: dataFim
    };
  }
  
  if (dataEntregaDe || dataEntregaAte) {
    where.dataEntrega = {};
    if (dataEntregaDe) {
      const dataInicio = new Date(dataEntregaDe);
      dataInicio.setHours(0, 0, 0, 0);
      where.dataEntrega.gte = dataInicio;
    }
    if (dataEntregaAte) {
      const dataFim = new Date(dataEntregaAte);
      dataFim.setHours(23, 59, 59, 999);
      where.dataEntrega.lte = dataFim;
    }
  }
  
  console.log('🔍 Filtros aplicados:', { statusProducao, statusPagamento, dataEntrega, dataEntregaDe, dataEntregaAte });
  console.log('📅 Where clause:', JSON.stringify(where, null, 2));
  
  const encomendas = await prisma.encomenda.findMany({
    where,
    include: { cliente: true, itensEncomenda: { include: { pao: true } } },
    orderBy: { dataEntrega: 'desc' },
  });
  
  console.log(`✅ ${encomendas.length} encomendas encontradas`);
  res.json(encomendas);
}

// Criar nova encomenda
async function criarEncomenda(req, res) {
  const { clienteId, itensEncomenda, dataEntrega } = req.body;
  // Buscar valores dos pães para calcular valor total
  let valorTotal = 0;
  for (const item of itensEncomenda) {
    const pao = await prisma.pao.findUnique({ where: { id: item.paoId } });
    valorTotal += pao.valorPacote * item.quantidadePacotes;
  }
  const novaEncomenda = await prisma.encomenda.create({
    data: {
      clienteId,
      dataEntrega: new Date(dataEntrega),
      valorTotal,
      itensEncomenda: {
        create: itensEncomenda.map(item => ({ paoId: item.paoId, quantidadePacotes: item.quantidadePacotes })),
      },
    },
    include: { cliente: true, itensEncomenda: { include: { pao: true } } },
  });
  res.status(201).json(novaEncomenda);
}

// Editar encomenda
async function editarEncomenda(req, res) {
  const { id } = req.params;
  const { clienteId, itensEncomenda, dataEntrega, statusProducao, statusPagamento } = req.body;
  // Deletar itens antigos e criar novos
  await prisma.itemEncomenda.deleteMany({ where: { encomendaId: Number(id) } });
  let valorTotal = 0;
  for (const item of itensEncomenda) {
    const pao = await prisma.pao.findUnique({ where: { id: item.paoId } });
    valorTotal += pao.valorPacote * item.quantidadePacotes;
  }
  const encomendaAtualizada = await prisma.encomenda.update({
    where: { id: Number(id) },
    data: {
      clienteId,
      dataEntrega: new Date(dataEntrega),
      valorTotal,
      statusProducao,
      statusPagamento,
      itensEncomenda: {
        create: itensEncomenda.map(item => ({ paoId: item.paoId, quantidadePacotes: item.quantidadePacotes })),
      },
    },
    include: { cliente: true, itensEncomenda: { include: { pao: true } } },
  });
  res.json(encomendaAtualizada);
}

// Buscar encomenda por ID
async function buscarEncomenda(req, res) {
  const { id } = req.params;
  const encomenda = await prisma.encomenda.findUnique({
    where: { id: Number(id) },
    include: { cliente: true, itensEncomenda: { include: { pao: true } } },
  });
  if (!encomenda) return res.status(404).json({ error: 'Encomenda não encontrada' });
  res.json(encomenda);
}

// Deletar encomenda
async function deletarEncomenda(req, res) {
  const { id } = req.params;
  try {
    await prisma.itemEncomenda.deleteMany({ where: { encomendaId: Number(id) } });
    await prisma.encomenda.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Não foi possível apagar a encomenda.' });
  }
}

// Alterar status de produção/pagamento
async function alterarStatus(req, res) {
  const { id } = req.params;
  const { statusProducao, statusPagamento } = req.body;
  try {
    const encomendaAtualizada = await prisma.encomenda.update({
      where: { id: Number(id) },
      data: { statusProducao, statusPagamento },
    });
    res.json(encomendaAtualizada);
  } catch (err) {
    res.status(400).json({ error: 'Não foi possível alterar o status.' });
  }
}

module.exports = {
  listarEncomendas,
  criarEncomenda,
  editarEncomenda,
  buscarEncomenda,
  deletarEncomenda,
  alterarStatus,
}; 