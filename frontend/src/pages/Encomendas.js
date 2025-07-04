import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import EncomendaForm from '../components/EncomendaForm';

function Encomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatusProducao, setFiltroStatusProducao] = useState('');
  const [filtroStatusPagamento, setFiltroStatusPagamento] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const statusProducaoOptions = [
    'PENDENTE',
    'EM_PRODUCAO',
    'PRONTO_PARA_ENTREGA',
    'ENTREGUE',
    'CANCELADA',
  ];
  const statusPagamentoOptions = [
    'PENDENTE',
    'PAGO',
  ];

  useEffect(() => {
    buscarEncomendas();
  }, [filtroStatusProducao, filtroStatusPagamento]);

  const buscarEncomendas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/encomendas', {
        params: {
          statusProducao: filtroStatusProducao,
          statusPagamento: filtroStatusPagamento,
        },
      });
      setEncomendas(res.data);
    } catch (err) {
      alert('Erro ao buscar encomendas');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(false);
    setTimeout(() => setFormOpen(true), 0);
  };

  const handleEdit = (encomenda) => {
    setEditData(encomenda);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditData(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editData) {
        await api.put(`/encomendas/${editData.id}`, data);
      } else {
        await api.post('/encomendas', data);
      }
      buscarEncomendas();
      handleFormClose();
    } catch (err) {
      alert('Erro ao salvar encomenda');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar esta encomenda?')) return;
    try {
      await api.delete(`/encomendas/${id}`);
      buscarEncomendas();
    } catch (err) {
      alert('Erro ao apagar encomenda');
    }
  };

  const handleStatusChange = async (id, statusProducao, statusPagamento) => {
    try {
      await api.patch(`/encomendas/${id}/status`, { statusProducao, statusPagamento });
      buscarEncomendas();
    } catch (err) {
      alert('Erro ao alterar status');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestão de Encomendas</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>Criar Nova Encomenda</Button>
      <FormControl sx={{ mr: 2, minWidth: 180 }}>
        <InputLabel>Status Produção</InputLabel>
        <Select value={filtroStatusProducao} label="Status Produção" onChange={e => setFiltroStatusProducao(e.target.value)}>
          <MenuItem value="">Todos</MenuItem>
          {statusProducaoOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ mr: 2, minWidth: 140 }}>
        <InputLabel>Status Pagamento</InputLabel>
        <Select value={filtroStatusPagamento} label="Status Pagamento" onChange={e => setFiltroStatusPagamento(e.target.value)}>
          <MenuItem value="">Todos</MenuItem>
          {statusPagamentoOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Data de Entrega</TableCell>
                <TableCell>Valor Total (R$)</TableCell>
                <TableCell>Status Produção</TableCell>
                <TableCell>Status Pagamento</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {encomendas.map((enc) => (
                <TableRow key={enc.id}>
                  <TableCell>{enc.cliente?.nome}</TableCell>
                  <TableCell>{new Date(enc.dataEntrega).toLocaleDateString()}</TableCell>
                  <TableCell>{enc.valorTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={enc.statusProducao}
                      size="small"
                      onChange={e => handleStatusChange(enc.id, e.target.value, enc.statusPagamento)}
                    >
                      {statusProducaoOptions.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={enc.statusPagamento}
                      size="small"
                      onChange={e => handleStatusChange(enc.id, enc.statusProducao, e.target.value)}
                    >
                      {statusPagamentoOptions.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(enc)}>Editar</Button>
                    <Button variant="outlined" size="small" color="error" sx={{ ml: 1 }} onClick={() => handleDelete(enc.id)}>Apagar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <EncomendaForm open={formOpen} onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editData} />
    </Container>
  );
}

export default Encomendas; 