import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, Stepper, Step, StepLabel, Select, InputLabel, FormControl, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const steps = ['Cliente', 'Itens', 'Entrega'];

function EncomendaForm({ open, onClose, onSubmit, initialData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [paes, setPaes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([]);
  const [dataEntrega, setDataEntrega] = useState('');

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      if (initialData) {
        setClienteId(initialData.clienteId || '');
        setItens(initialData.itensEncomenda || []);
        setDataEntrega(initialData.dataEntrega ? initialData.dataEntrega.slice(0,10) : '');
      } else {
        setClienteId('');
        setItens([]);
        setDataEntrega('');
      }
    }
  }, [initialData, open]);

  useEffect(() => {
    api.get('/clientes').then(res => setClientes(res.data));
    api.get('/paes').then(res => setPaes(res.data.filter(p => p.ativo)));
  }, []);

  const handleAddItem = () => {
    setItens([...itens, { paoId: '', quantidadePacotes: 1 }]);
  };

  const handleItemChange = (idx, field, value) => {
    const newItens = [...itens];
    newItens[idx][field] = value;
    setItens(newItens);
  };

  const handleRemoveItem = (idx) => {
    setItens(itens.filter((_, i) => i !== idx));
  };

  const valorTotal = itens.reduce((sum, item) => {
    const pao = paes.find(p => p.id === Number(item.paoId));
    return sum + (pao ? pao.valorPacote * item.quantidadePacotes : 0);
  }, 0);

  const handleNext = () => setActiveStep(s => s + 1);
  const handleBack = () => setActiveStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clienteId || itens.length === 0 || !dataEntrega) return;
    onSubmit({ clienteId: Number(clienteId), itensEncomenda: itens.map(i => ({ paoId: Number(i.paoId), quantidadePacotes: Number(i.quantidadePacotes) })), dataEntrega, valorTotal });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Encomenda' : 'Criar Nova Encomenda'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>
          {activeStep === 0 && (
            <FormControl fullWidth sx={{ mb: 2 }} required>
              <InputLabel>Cliente</InputLabel>
              <Select value={clienteId} label="Cliente" onChange={e => setClienteId(e.target.value)}>
                {clientes.map(c => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
              </Select>
            </FormControl>
          )}
          {activeStep === 1 && (
            <Box>
              {itens.map((item, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                  <FormControl sx={{ minWidth: 180 }} required>
                    <InputLabel>Pão</InputLabel>
                    <Select value={item.paoId} label="Pão" onChange={e => handleItemChange(idx, 'paoId', e.target.value)}>
                      {paes.map(p => <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField label="Pacotes" type="number" value={item.quantidadePacotes} onChange={e => handleItemChange(idx, 'quantidadePacotes', e.target.value)} required sx={{ width: 100 }} />
                  <IconButton onClick={() => handleRemoveItem(idx)}><DeleteIcon /></IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mt: 1 }}>Adicionar Pão</Button>
              <Typography sx={{ mt: 2 }}>Valor Total: <b>R$ {valorTotal.toFixed(2)}</b></Typography>
            </Box>
          )}
          {activeStep === 2 && (
            <TextField label="Data de Entrega" type="date" value={dataEntrega} onChange={e => setDataEntrega(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
          )}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && <Button onClick={handleBack}>Voltar</Button>}
          {activeStep < steps.length - 1 && <Button onClick={handleNext} disabled={activeStep === 0 && !clienteId || activeStep === 1 && itens.length === 0}>Avançar</Button>}
          {activeStep === steps.length - 1 && <Button type="submit" variant="contained">Salvar</Button>}
          <Button onClick={onClose}>Cancelar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EncomendaForm; 