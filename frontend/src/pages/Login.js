import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      // Testa autenticação com uma chamada simples (ex: /api/paes)
      const res = await fetch('/api/paes', {
        headers: {
          'Authorization': 'Basic ' + btoa(usuario + ':' + senha)
        }
      });
      if (res.status === 401) throw new Error('Usuário ou senha inválidos');
      localStorage.setItem('padariaAuth', btoa(usuario + ':' + senha));
      onLogin();
    } catch (err) {
      setErro(err.message);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Usuário" value={usuario} onChange={e => setUsuario(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          {erro && <Typography color="error" sx={{ mb: 2 }}>{erro}</Typography>}
          <Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login; 