import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Container, 
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Deep blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    background: {
      default: '#f0f2f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#1976d2',
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
  },
});

const OwnerLoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/users/login', { email, password });
      const { user, token } = res.data;
      if (user.role !== 'owner') {
        setError('Not authorized as owner');
        return;
      }
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Paper 
            elevation={6} 
            sx={{ 
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 4,
              borderRadius: 3,
            }}
          >
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <LockOutlinedIcon 
                sx={{ 
                  fontSize: 60, 
                  color: theme.palette.primary.main,
                  marginBottom: 2,
                }} 
              />
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  marginBottom: 2,
                  fontWeight: 600,
                }}
              >
                Owner Login
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%', 
                    marginBottom: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" sx={{ width: '100%' }}>
                <TextField 
                  label="Email" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
                <TextField 
                  label="Password" 
                  variant="outlined" 
                  type="password" 
                  fullWidth 
                  margin="normal"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  sx={{ 
                    marginTop: 2,
                    padding: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth 
                  sx={{ 
                    marginTop: 2,
                    padding: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default OwnerLoginPage;