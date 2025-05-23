import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useEmployees } from '../contexts/EmployeeContext';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  department: yup.string().required('Department is required'),
  position: yup.string().required('Position is required'),
  salary: yup.number().required('Salary is required').min(0, 'Salary must be positive'),
  status: yup.string().required('Status is required'),
  hireDate: yup.string().required('Hire date is required'),
});

const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
const positions = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator', 'Specialist'];
const statuses = ['active', 'on_leave', 'terminated'];

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee, addEmployee, updateEmployee } = useEmployees();
  const [loading, setLoading] = useState(false);
  const [fetchingEmployee, setFetchingEmployee] = useState(false);
  const isEdit = Boolean(id);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      salary: '',
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0]
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (isEdit) {
          await updateEmployee(id, values);
          toast.success('Employee updated successfully');
        } else {
          await addEmployee(values);
          toast.success('Employee added successfully');
        }
        navigate('/employees');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEdit) {
      const fetchEmployeeData = async () => {
        try {
          setFetchingEmployee(true);
          const employee = await getEmployee(id);
          
          // Format the date for the date input
          const formattedEmployee = {
            ...employee,
            hireDate: new Date(employee.hireDate).toISOString().split('T')[0]
          };
          
          formik.setValues(formattedEmployee);
        } catch (error) {
          toast.error('Failed to fetch employee details');
          navigate('/employees');
        } finally {
          setFetchingEmployee(false);
        }
      };
      fetchEmployeeData();
    }
  }, [id, isEdit, getEmployee, navigate, formik]);

  if (fetchingEmployee) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading employee details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            {isEdit ? 'Edit Employee' : 'Add Employee'}
          </Typography>
          
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  autoFocus
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  id="department"
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                >
                  {departments.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  id="position"
                  name="position"
                  label="Position"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  error={formik.touched.position && Boolean(formik.errors.position)}
                  helperText={formik.touched.position && formik.errors.position}
                >
                  {positions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="salary"
                  name="salary"
                  label="Salary"
                  type="number"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  error={formik.touched.salary && Boolean(formik.errors.salary)}
                  helperText={formik.touched.salary && formik.errors.salary}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: '8px' }}>$</span>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  id="status"
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  {statuses.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="hireDate"
                  name="hireDate"
                  label="Hire Date"
                  type="date"
                  value={formik.values.hireDate}
                  onChange={formik.handleChange}
                  error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
                  helperText={formik.touched.hireDate && formik.errors.hireDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={formik.handleReset} disabled={loading}>
                Reset
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/employees')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (isEdit ? 'Update' : 'Add')}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmployeeForm;
