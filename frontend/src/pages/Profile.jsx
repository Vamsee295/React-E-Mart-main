import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  currentPassword: yup.string(),
  newPassword: yup.string()
    .min(6, 'Password should be of minimum 6 characters length')
    .when('currentPassword', {
      is: currentPassword => currentPassword && currentPassword.length > 0,
      then: yup.string().required('New password is required when changing password'),
    }),
  confirmPassword: yup.string()
    .when('newPassword', {
      is: newPassword => newPassword && newPassword.length > 0,
      then: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
    }),
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      role: user?.role || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        setPasswordChanged(false);
        
        const updateData = {
          username: values.username,
          email: values.email
        };
        
        // Only include password fields if the user is changing their password
        if (values.currentPassword && values.newPassword) {
          updateData.currentPassword = values.currentPassword;
          updateData.newPassword = values.newPassword;
        }
        
        const response = await axios.put(
          `http://localhost:5000/api/auth/profile`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        // Update context with new user info
        updateUser(response.data.user);
        
        // Reset password fields
        formik.setFieldValue('currentPassword', '');
        formik.setFieldValue('newPassword', '');
        formik.setFieldValue('confirmPassword', '');
        
        // Show success message for password change
        if (values.currentPassword && values.newPassword) {
          setPasswordChanged(true);
        }
        
        toast.success('Profile updated successfully');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to update profile');
        toast.error(error.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  // Update form values when user context changes
  useEffect(() => {
    if (user) {
      formik.setValues({
        ...formik.values,
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: '#1976d2',
        width: 100,
        height: 100,
        fontSize: 40,
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar {...stringAvatar(user?.username || 'User')} />
            <Typography variant="h4" sx={{ mt: 2 }}>
              {user?.username || 'User Profile'}
            </Typography>
            <Typography color="textSecondary">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Role'}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {passwordChanged && <Alert severity="success" sx={{ mb: 3 }}>Password changed successfully</Alert>}

          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  value={formik.values.role}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="currentPassword"
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                  helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                  helperText={formik.touched.newPassword && formik.errors.newPassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 