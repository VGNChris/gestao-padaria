import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Paes from './pages/Paes';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Encomendas from './pages/Encomendas';
import Producao from './pages/Producao';
import Relatorios from './pages/Relatorios';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import { Button } from '@mui/material';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#181a1b', paper: '#23272a' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)',
          borderRadius: 20,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [autenticado, setAutenticado] = React.useState(!!localStorage.getItem('padariaAuth'));
  const handleLogin = () => setAutenticado(true);
  const handleLogout = () => {
    localStorage.removeItem('padariaAuth');
    setAutenticado(false);
  };
  if (!autenticado) return <Login onLogin={handleLogin} />;
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Button onClick={handleLogout} sx={{ position: 'absolute', top: 16, right: 16 }}>Sair</Button>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/paes" element={<Paes />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/encomendas" element={<Encomendas />} />
          <Route path="/producao" element={<Producao />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
