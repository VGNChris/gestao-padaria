import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import api from '../services/api';

function Producao() {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [producao, setProducao] = useState([]);

  const buscarProducao = async () => {
    setLoading(true);
    try {
      const res = await api.get('/producao', { params: { data } });
      setProducao(res.data);
    } catch (err) {
      alert('Erro ao buscar produção');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Lista de Produção</Typography>
      <TextField label="Data" type="date" value={data} onChange={e => setData(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mr: 2 }} />
      <Button variant="contained" onClick={buscarProducao} disabled={!data}>Buscar</Button>
      {loading ? <CircularProgress sx={{ mt: 2 }} /> : producao.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pão</TableCell>
                <TableCell>Total de Pacotes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {producao.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.totalPacotes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default Producao; 