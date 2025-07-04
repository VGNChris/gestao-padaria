const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os pães
async function listarPaes(req, res) {
  try {
    console.log('Tentando listar pães...');
    const paes = await prisma.pao.findMany();
    console.log(`✅ ${paes.length} pães encontrados`);
    res.json(paes);
  } catch (error) {
    console.error('❌ Erro ao listar pães:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
}

// Criar novo pão
async function criarPao(req, res) {
  try {
    const { nome, unidadesPorPacote, valorPacote } = req.body;
    console.log('Tentando criar pão:', { nome, unidadesPorPacote, valorPacote });
    
    const novoPao = await prisma.pao.create({
      data: { nome, unidadesPorPacote, valorPacote, ativo: true },
    });
    console.log('✅ Pão criado com sucesso:', novoPao.id);
    res.status(201).json(novoPao);
  } catch (error) {
    console.error('❌ Erro ao criar pão:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
}

// Editar pão
async function editarPao(req, res) {
  try {
    const { id } = req.params;
    const { nome, unidadesPorPacote, valorPacote } = req.body;
    console.log('Tentando editar pão:', id);
    
    const paoAtualizado = await prisma.pao.update({
      where: { id: Number(id) },
      data: { nome, unidadesPorPacote, valorPacote },
    });
    console.log('✅ Pão atualizado com sucesso');
    res.json(paoAtualizado);
  } catch (error) {
    console.error('❌ Erro ao editar pão:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pão não encontrado' });
    }
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
}

// Ativar/Desativar pão
async function alterarStatusPao(req, res) {
  try {
    const { id } = req.params;
    const { ativo } = req.body;
    console.log('Tentando alterar status do pão:', id, 'para:', ativo);
    
    const paoAtualizado = await prisma.pao.update({
      where: { id: Number(id) },
      data: { ativo },
    });
    console.log('✅ Status do pão alterado com sucesso');
    res.json(paoAtualizado);
  } catch (error) {
    console.error('❌ Erro ao alterar status do pão:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pão não encontrado' });
    }
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
}

// Buscar pão por ID
async function buscarPao(req, res) {
  try {
    const { id } = req.params;
    console.log('Tentando buscar pão:', id);
    
    const pao = await prisma.pao.findUnique({ where: { id: Number(id) } });
    if (!pao) {
      console.log('❌ Pão não encontrado:', id);
      return res.status(404).json({ error: 'Pão não encontrado' });
    }
    console.log('✅ Pão encontrado');
    res.json(pao);
  } catch (error) {
    console.error('❌ Erro ao buscar pão:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
}

// Deletar pão
async function deletarPao(req, res) {
  try {
    const { id } = req.params;
    console.log('Tentando deletar pão:', id);
    
    await prisma.pao.delete({ where: { id: Number(id) } });
    console.log('✅ Pão deletado com sucesso');
    res.status(204).end();
  } catch (error) {
    console.error('❌ Erro ao deletar pão:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Não foi possível apagar o pão. Verifique se ele está vinculado a encomendas.' 
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pão não encontrado' });
    }
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
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