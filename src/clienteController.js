const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os clientes
async function listarClientes(req, res) {
  const clientes = await prisma.cliente.findMany();
  res.json(clientes);
}

// Criar novo cliente
async function criarCliente(req, res) {
  const { nome, telefone } = req.body;
  const novoCliente = await prisma.cliente.create({
    data: { nome, telefone },
  });
  res.status(201).json(novoCliente);
}

// Editar cliente
async function editarCliente(req, res) {
  const { id } = req.params;
  const { nome, telefone } = req.body;
  const clienteAtualizado = await prisma.cliente.update({
    where: { id: Number(id) },
    data: { nome, telefone },
  });
  res.json(clienteAtualizado);
}

// Buscar cliente por ID
async function buscarCliente(req, res) {
  const { id } = req.params;
  const cliente = await prisma.cliente.findUnique({ where: { id: Number(id) } });
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(cliente);
}

// Deletar cliente
async function deletarCliente(req, res) {
  const { id } = req.params;
  try {
    await prisma.cliente.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Não foi possível apagar o cliente. Verifique se ele está vinculado a encomendas.' });
  }
}

module.exports = {
  listarClientes,
  criarCliente,
  editarCliente,
  buscarCliente,
  deletarCliente,
}; 