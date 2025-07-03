import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    encomendasHoje: 0,
    faturamentoDia: 0,
    faturamentoMes: 0,
    paoMaisVendido: '-',
    proximasEntregas: [],
  });
  const [dataFaturamento, setDataFaturamento] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().slice(0,10);
  });
  const [dataProducao, setDataProducao] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().slice(0,10);
  });
  const [producao, setProducao] = useState([]);

  useEffect(() => {
    async function fetchDashboard() {
      const hoje = new Date();
      const hojeStr = hoje.toISOString().slice(0,10);
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      // Encomendas para hoje (dataEntrega)
      const encomendasHojeRes = await api.get('/encomendas', { params: { dataEntrega: hojeStr } });
      // Faturamento do dia (dataEntrega = dataFaturamento)
      const encomendasDiaRes = await api.get('/encomendas', { params: { dataEntrega: dataFaturamento } });
      const faturamentoDia = encomendasDiaRes.data.reduce((sum, e) => sum + e.valorTotal, 0);
      // Faturamento do mês
      const relatorioMesRes = await api.get('/relatorios', { params: { inicio: inicioMes.toISOString().slice(0,10), fim: fimMes.toISOString().slice(0,10) } });
      // Pão mais vendido
      const paoMaisVendido = relatorioMesRes.data.maisVendidosQtd?.[0]?.[0] || '-';
      // Próximas entregas (7 dias)
      const fimSemana = new Date(hoje); fimSemana.setDate(hoje.getDate() + 7);
      const encomendasSemanaRes = await api.get('/encomendas', { params: { dataEntregaDe: hojeStr, dataEntregaAte: fimSemana.toISOString().slice(0,10) } });
      setDashboard({
        encomendasHoje: encomendasHojeRes.data.length,
        faturamentoDia,
        faturamentoMes: relatorioMesRes.data.faturamentoTotal,
        paoMaisVendido,
        proximasEntregas: encomendasSemanaRes.data,
      });
    }
    fetchDashboard();
  }, [dataFaturamento]);

  useEffect(() => {
    async function fetchProducao() {
      if (!dataProducao) return setProducao([]);
      const res = await api.get('/producao', { params: { data: dataProducao } });
      setProducao(res.data);
    }
    fetchProducao();
  }, [dataProducao]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Painel Principal</Typography>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main' }}>
            <Typography variant="h6" color="primary" gutterBottom>Encomendas para hoje</Typography>
            <Typography variant="h3" color="primary.main">{dashboard.encomendasHoje}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', border: '2px solid', borderColor: 'secondary.main' }}>
            <Typography variant="h6" color="secondary" gutterBottom>Faturamento do dia</Typography>
            <TextField
              type="date"
              value={dataFaturamento}
              onChange={e => setDataFaturamento(e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="h3" color="secondary.main">R$ {dashboard.faturamentoDia.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main' }}>
            <Typography variant="h6" color="primary" gutterBottom>Faturamento do mês</Typography>
            <Typography variant="h3" color="primary.main">R$ {dashboard.faturamentoMes.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', border: '2px solid', borderColor: 'secondary.main' }}>
            <Typography variant="h6" color="secondary" gutterBottom>Pão mais vendido</Typography>
            <Typography variant="h3" color="secondary.main">{dashboard.paoMaisVendido}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 3, mt: 2, bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main' }}>
            <Typography variant="h6" color="primary" gutterBottom>Produção do dia</Typography>
            <TextField
              type="date"
              value={dataProducao}
              onChange={e => setDataProducao(e.target.value)}
              size="small"
              sx={{ mb: 1, ml: 2 }}
            />
            {producao.length === 0 ? (
              <Typography sx={{ mt: 2 }}>Nenhum pão para produzir nesta data.</Typography>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 18 }}>
                {producao.map((item, idx) => (
                  <li key={idx}><b>{item.nome}</b>: <span style={{ color: '#90caf9', fontWeight: 700 }}>{Number(item.totalUnidades) || 0} unidades</span></li>
                ))}
              </ul>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>Próximas Entregas (7 dias)</Typography>
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
          {dashboard.proximasEntregas.length === 0 ? (
            <ListItem>
              <ListItemText primary="Nenhuma entrega agendada" />
            </ListItem>
          ) : dashboard.proximasEntregas.map((enc) => (
            <ListItem key={enc.id} divider>
              <ListItemText primary={<b>{enc.cliente?.nome}</b>} secondary={`${new Date(enc.dataEntrega).toLocaleDateString()} - R$ ${enc.valorTotal.toFixed(2)}`} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/encomendas')}>Criar Nova Encomenda</Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/clientes')}>Adicionar Cliente</Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/paes')}>Adicionar Pão</Button>
      </Box>
    </Container>
  );
}

export default Dashboard; 