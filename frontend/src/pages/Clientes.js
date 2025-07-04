import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import ClienteForm from '../components/ClienteForm';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/clientes');
      setClientes(res.data);
    } catch (err) {
      alert('Erro ao buscar clientes');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(false);
    setTimeout(() => setFormOpen(true), 0);
  };

  const handleEdit = (cliente) => {
    setEditData(cliente);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditData(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editData) {
        await api.put(`/clientes/${editData.id}`, data);
      } else {
        await api.post('/clientes', data);
      }
      buscarClientes();
      handleFormClose();
    } catch (err) {
      alert('Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      buscarClientes();
    } catch (err) {
      alert('Erro ao apagar cliente');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestão de Clientes</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>Adicionar Novo Cliente</Button>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(cliente)}>Editar</Button>
                    <Button variant="outlined" size="small" color="error" sx={{ ml: 1 }} onClick={() => handleDelete(cliente.id)}>Apagar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ClienteForm open={formOpen} onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editData} />
    </Container>
  );
}

export default Clientes; 