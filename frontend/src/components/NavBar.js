import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Gestão Padaria
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/paes">Pães</Button>
          <Button color="inherit" component={RouterLink} to="/clientes">Clientes</Button>
          <Button color="inherit" component={RouterLink} to="/encomendas">Encomendas</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar; 