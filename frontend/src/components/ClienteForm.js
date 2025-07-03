import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

function ClienteForm({ open, onClose, onSubmit, initialData }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    setNome(initialData?.nome || '');
    setTelefone(initialData?.telefone || '');
  }, [initialData, open]);

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    if (value.length > 10) value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
    setTelefone(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !telefone) return;
    onSubmit({ nome, telefone });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Nome" value={nome} onChange={e => setNome(e.target.value)} required fullWidth />
            <TextField label="Telefone" value={telefone} onChange={handleTelefoneChange} required fullWidth placeholder="(99) 99999-9999" />
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

export default ClienteForm; 