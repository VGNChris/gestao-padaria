import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

function PaoForm({ open, onClose, onSubmit, initialData }) {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [unidadesPorPacote, setUnidadesPorPacote] = useState(initialData?.unidadesPorPacote || '');
  const [valorPacote, setValorPacote] = useState(initialData?.valorPacote || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !unidadesPorPacote || !valorPacote) return;
    onSubmit({ nome, unidadesPorPacote: Number(unidadesPorPacote), valorPacote: Number(valorPacote) });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Pão' : 'Adicionar Novo Pão'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Nome" value={nome} onChange={e => setNome(e.target.value)} required fullWidth />
            <TextField label="Unidades por Pacote" type="number" value={unidadesPorPacote} onChange={e => setUnidadesPorPacote(e.target.value)} required fullWidth />
            <TextField label="Valor do Pacote (R$)" type="number" value={valorPacote} onChange={e => setValorPacote(e.target.value)} required fullWidth inputProps={{ step: '0.01' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default PaoForm; 