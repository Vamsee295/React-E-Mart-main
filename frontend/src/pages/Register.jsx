import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const validationSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username should be of minimum 3 characters length')
    .required('Username is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        // Remove confirmPassword as it's not needed for the API
        const { confirmPassword, ...userData } = values;
        await register(userData);
        toast.success('Registration successful!');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

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
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, px: 4 }}>
            Register an account to join our system and access employee management tools and resources.
          </Typography>
          
          <Button 
            variant="outlined" 
            color="inherit" 
            sx={{ 
              borderColor: 'white', 
              borderRadius: 50, 
              px: 4, 
              py: 1, 
              mb: 6,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            component={Link}
            to="/login"
          >
            Already have an account? Sign in.
          </Button>
          
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="body2" sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              Terms of Service • Privacy Policy
            </Typography>
          </Box>
        </Box>

        {/* Right side - Register form */}
        <Box sx={{ width: '50%', p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
            Signup
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="username"
              name="username"
              placeholder="Username"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="Email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              variant="outlined"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                bgcolor: '#0088ff',
                '&:hover': { bgcolor: '#0066cc' },
                borderRadius: 1,
                py: 1.5,
                mb: 3
              }}
            >
              {loading ? 'REGISTERING...' : 'SIGNUP'}
            </Button>
          </form>

          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
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
      </Paper>
    </Container>
  );
};

export default Register; 