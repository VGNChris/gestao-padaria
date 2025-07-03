import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Box, TextField, Button } from '@mui/material';

function Relatorios() {
  const [periodo, setPeriodo] = useState('');

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Relatórios Financeiros</Typography>
      <Box sx={{ mb: 3 }}>
        <TextField label="Período" type="text" value={periodo} onChange={e => setPeriodo(e.target.value)} sx={{ mr: 2 }} />
        <Button variant="contained">Filtrar</Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Faturamento Total</Typography>
            <Typography variant="h4">R$ 0,00</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total de Encomendas</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Mais Vendidos (Valor)</Typography>
            <Typography variant="h4">-</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Mais Vendidos (Qtd)</Typography>
            <Typography variant="h4">-</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Relatorios; 