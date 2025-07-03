const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os pães
async function listarPaes(req, res) {
  const paes = await prisma.pao.findMany();
  res.json(paes);
}

// Criar novo pão
async function criarPao(req, res) {
  const { nome, unidadesPorPacote, valorPacote } = req.body;
  const novoPao = await prisma.pao.create({
    data: { nome, unidadesPorPacote, valorPacote, ativo: true },
  });
  res.status(201).json(novoPao);
}

// Editar pão
async function editarPao(req, res) {
  const { id } = req.params;
  const { nome, unidadesPorPacote, valorPacote } = req.body;
  const paoAtualizado = await prisma.pao.update({
    where: { id: Number(id) },
    data: { nome, unidadesPorPacote, valorPacote },
  });
  res.json(paoAtualizado);
}

// Ativar/Desativar pão
async function alterarStatusPao(req, res) {
  const { id } = req.params;
  const { ativo } = req.body;
  const paoAtualizado = await prisma.pao.update({
    where: { id: Number(id) },
    data: { ativo },
  });
  res.json(paoAtualizado);
}

// Buscar pão por ID
async function buscarPao(req, res) {
  const { id } = req.params;
  const pao = await prisma.pao.findUnique({ where: { id: Number(id) } });
  if (!pao) return res.status(404).json({ error: 'Pão não encontrado' });
  res.json(pao);
}

// Deletar pão
async function deletarPao(req, res) {
  const { id } = req.params;
  try {
    await prisma.pao.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Não foi possível apagar o pão. Verifique se ele está vinculado a encomendas.' });
  }
}

module.exports = {
  listarPaes,
  criarPao,
  editarPao,
  alterarStatusPao,
  buscarPao,
  deletarPao,
}; 