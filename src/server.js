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

app.use(cors());
app.use(express.json());
app.use('/api', authMiddleware);

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
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 