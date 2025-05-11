import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await login(values.username, values.password);
        toast.success('Login successful!');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    toast.info('Google login feature coming soon');
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', display: 'flex', borderRadius: 2 }}>
        {/* Left side - Blue section */}
        <Box
          sx={{
            width: '50%',
            bgcolor: '#0088ff',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            position: 'relative',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            EMPLOYEE MANAGEMENT SYSTEM
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 6 }}>
            Access your workspace to manage tasks and employee information securely.
          </Typography>
          <Box 
            sx={{ 
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 6
            }}
          >
            <Typography 
              sx={{ 
                color: '#0088ff', 
                fontSize: '36px',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            >
              {'{:}'}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="body2" sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              Terms of Service • Privacy Policy
            </Typography>
          </Box>
        </Box>

        {/* Right side - Login form */}
        <Box sx={{ width: '50%', p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
            Login
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Before you get started, you must login or{' '}
            <Link to="/register" style={{ color: '#0088ff', textDecoration: 'none' }}>
              register
            </Link>{' '}
            if you don't already have an account.
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Username
            </Typography>
            <TextField
              fullWidth
              id="username"
              name="username"
              placeholder="Enter your username"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Password
              </Typography>
              <Link to="/forgot-password" style={{ color: '#0088ff', textDecoration: 'none', fontSize: '14px' }}>
                Forgot Password?
              </Link>
            </Box>
            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Link to="/register" style={{ color: '#0088ff', textDecoration: 'none', fontSize: '14px' }}>
                Create an account?
              </Link>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  bgcolor: '#0088ff',
                  '&:hover': { bgcolor: '#0066cc' },
                  borderRadius: 1,
                  px: 4,
                  py: 1
                }}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              or signup with
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  minWidth: 'auto',
                  p: 1,
                  borderRadius: '50%',
                  borderColor: '#ddd',
                  color: '#3b5998'
                }}
              >
                <FacebookIcon />
              </Button>
              <Button
                variant="outlined"
                sx={{
                  minWidth: 'auto',
                  p: 1,
                  borderRadius: '50%',
                  borderColor: '#ddd',
                  color: '#db4437'
                }}
              >
                <GoogleIcon />
              </Button>
              <Button
                variant="outlined"
                sx={{
                  minWidth: 'auto',
                  p: 1,
                  borderRadius: '50%',
                  borderColor: '#ddd',
                  color: '#0077b5'
                }}
              >
                <LinkedInIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 