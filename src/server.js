const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const paoController = require('./paoController');
const clienteController = require('./clienteController');
const encomendaController = require('./encomendaController');
const producaoController = require('./producaoController');
const relatorioController = require('./relatorioController');
const authMiddleware = require('./authMiddleware');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use('/api', authMiddleware);

// Rota de health check
app.get('/health', async (req, res) => {
  try {
    // Testar conexão com o banco
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Erro na conexão com o banco:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/', (req, res) => {
  res.send('API Gestão Padaria rodando!');
});

app.get('/api/paes', paoController.listarPaes);
app.post('/api/paes', paoController.criarPao);
app.put('/api/paes/:id', paoController.editarPao);
app.patch('/api/paes/:id/status', paoController.alterarStatusPao);
app.get('/api/paes/:id', paoController.buscarPao);
app.delete('/api/paes/:id', paoController.deletarPao);

// Clientes
app.get('/api/clientes', clienteController.listarClientes);
app.post('/api/clientes', clienteController.criarCliente);
app.put('/api/clientes/:id', clienteController.editarCliente);
app.get('/api/clientes/:id', clienteController.buscarCliente);
app.delete('/api/clientes/:id', clienteController.deletarCliente);

// Encomendas
app.get('/api/encomendas', encomendaController.listarEncomendas);
app.post('/api/encomendas', encomendaController.criarEncomenda);
app.put('/api/encomendas/:id', encomendaController.editarEncomenda);
app.get('/api/encomendas/:id', encomendaController.buscarEncomenda);
app.delete('/api/encomendas/:id', encomendaController.deletarEncomenda);
app.patch('/api/encomendas/:id/status', encomendaController.alterarStatus);

// Produção
app.get('/api/producao', producaoController.producaoPorData);

// Relatórios
app.get('/api/relatorios', relatorioController.relatorioFinanceiro);

const PORT = process.env.PORT || 3001;

// Função para inicializar o servidor
async function startServer() {
  try {
    // Testar conexão com o banco antes de iniciar
    console.log('Testando conexão com Neon.tech...');
    
    // Verificar se é uma URL do Neon
    const isNeonUrl = process.env.DATABASE_URL?.includes('neon.tech');
    if (isNeonUrl) {
      console.log('✅ URL do Neon detectada');
      if (!process.env.DATABASE_URL.includes('sslmode=require')) {
        console.warn('⚠️  URL não contém sslmode=require - pode causar problemas');
      }
    }
    
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão com o banco estabelecida com sucesso!');
    
    // Verificar se as tabelas existem
    console.log('Verificando tabelas...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(`✅ ${tables.length} tabelas encontradas no banco`);
    
    // Verificar tabelas principais
    const expectedTables = ['Pao', 'Cliente', 'Encomenda', 'ItemEncomenda'];
    const foundTables = tables.map(t => t.table_name);
    for (const table of expectedTables) {
      if (foundTables.includes(table)) {
        console.log(`✅ Tabela ${table} existe`);
      } else {
        console.log(`❌ Tabela ${table} NÃO encontrada - execute as migrações`);
      }
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Health check disponível em: http://localhost:${PORT}/health`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database URL: ${process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar o servidor:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, fechando conexões...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer(); 