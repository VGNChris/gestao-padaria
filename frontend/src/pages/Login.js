import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import api from '../services/api';

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
      console.log('🔐 Tentando fazer login...');
      
      // Criar uma instância temporária do axios com as credenciais
      const tempApi = api.create({
        baseURL: api.defaults.baseURL,
        headers: {
          'Authorization': 'Basic ' + btoa(usuario + ':' + senha)
        }
      });
      
      // Testar autenticação fazendo uma requisição para a API
      const res = await tempApi.get('/api/paes');
      console.log('✅ Login bem-sucedido');
      
      // Salvar credenciais no localStorage
      localStorage.setItem('padariaAuth', btoa(usuario + ':' + senha));
      
      // Chamar callback de login
      onLogin();
      
    } catch (err) {
      console.error('❌ Erro no login:', err);
      if (err.response?.status === 401) {
        setErro('Usuário ou senha inválidos');
      } else if (err.response?.data?.error) {
        setErro(err.response.data.error);
      } else {
        setErro('Erro ao fazer login. Verifique sua conexão.');
      }
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            label="Usuário" 
            value={usuario} 
            onChange={e => setUsuario(e.target.value)} 
            fullWidth 
            required 
            sx={{ mb: 2 }} 
          />
          <TextField 
            label="Senha" 
            type="password" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            fullWidth 
            required 
            sx={{ mb: 2 }} 
          />
          {erro && <Typography color="error" sx={{ mb: 2 }}>{erro}</Typography>}
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login; 