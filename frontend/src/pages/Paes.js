import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import PaoForm from '../components/PaoForm';

function Paes() {
  const [paes, setPaes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    buscarPaes();
  }, []);

  const buscarPaes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/paes');
      setPaes(res.data);
    } catch (err) {
      alert('Erro ao buscar pães');
    }
    setLoading(false);
  };

  const handleToggleAtivo = async (id, ativo) => {
    try {
      await api.patch(`/paes/${id}/status`, { ativo: !ativo });
      buscarPaes();
    } catch (err) {
      alert('Erro ao alterar status');
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
      if (editData) {
        await api.put(`/paes/${editData.id}`, data);
      } else {
        await api.post('/paes', data);
      }
      buscarPaes();
      handleFormClose();
    } catch (err) {
      alert('Erro ao salvar pão');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar este pão?')) return;
    try {
      await api.delete(`/paes/${id}`);
      buscarPaes();
    } catch (err) {
      alert('Erro ao apagar pão');
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
    </Container>
  );
}

export default Paes; 