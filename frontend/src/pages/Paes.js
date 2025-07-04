import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, CircularProgress, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import PaoForm from '../components/PaoForm';

function Paes() {
  const [paes, setPaes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    buscarPaes();
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const buscarPaes = async () => {
    setLoading(true);
    try {
      console.log('🔄 Buscando pães...');
      const res = await api.get('/paes');
      console.log('✅ Pães carregados:', res.data.length);
      setPaes(res.data);
    } catch (err) {
      console.error('❌ Erro ao buscar pães:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao buscar pães';
      showError(`Erro ao buscar pães: ${errorMessage}`);
    }
    setLoading(false);
  };

  const handleToggleAtivo = async (id, ativo) => {
    try {
      console.log('🔄 Alterando status do pão:', id, 'para:', !ativo);
      await api.patch(`/paes/${id}/status`, { ativo: !ativo });
      console.log('✅ Status alterado com sucesso');
      buscarPaes();
    } catch (err) {
      console.error('❌ Erro ao alterar status:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao alterar status';
      showError(`Erro ao alterar status: ${errorMessage}`);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };

  const handleEdit = (pao) => {
    setEditData(pao);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditData(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      console.log('🔄 Salvando pão:', data);
      if (editData) {
        await api.put(`/paes/${editData.id}`, data);
        console.log('✅ Pão editado com sucesso');
      } else {
        await api.post('/paes', data);
        console.log('✅ Pão criado com sucesso');
      }
      buscarPaes();
      handleFormClose();
    } catch (err) {
      console.error('❌ Erro ao salvar pão:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao salvar pão';
      showError(`Erro ao salvar pão: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar este pão?')) return;
    try {
      console.log('🔄 Deletando pão:', id);
      await api.delete(`/paes/${id}`);
      console.log('✅ Pão deletado com sucesso');
      buscarPaes();
    } catch (err) {
      console.error('❌ Erro ao apagar pão:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao apagar pão';
      showError(`Erro ao apagar pão: ${errorMessage}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestão de Pães</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>Adicionar Novo Pão</Button>
      
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Unidades/Pacote</TableCell>
                <TableCell>Valor (R$)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paes.map((pao) => (
                <TableRow key={pao.id}>
                  <TableCell>{pao.nome}</TableCell>
                  <TableCell>{pao.unidadesPorPacote}</TableCell>
                  <TableCell>{pao.valorPacote.toFixed(2)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={pao.ativo}
                      onChange={() => handleToggleAtivo(pao.id, pao.ativo)}
                      color="primary"
                    />
                    {pao.ativo ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(pao)}>Editar</Button>
                    <Button variant="outlined" size="small" color="error" sx={{ ml: 1 }} onClick={() => handleDelete(pao.id)}>Apagar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <PaoForm open={formOpen} onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editData} />
      
      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Paes; 