import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  dueDate: yup.date().required('Due date is required'),
  assignedTo: yup.string().required('Assigned employee is required'),
});

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, backendAvailable } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  // Check if user has permission to create tasks
  const canCreateTask = user?.role === 'admin' || user?.role === 'manager';

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0], // Default to today
      assignedTo: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          toast.error('Authentication token not found. Please log in again.');
          return;
        }

        // Set up request headers
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        if (isEdit) {
          const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, values, config);
          toast.success('Task updated successfully');
          console.log('Task updated:', response.data);
        } else {
          const response = await axios.post('http://localhost:5000/api/tasks', values, config);
          toast.success('Task added successfully');
          console.log('Task created:', response.data);
        }
        
        navigate('/tasks');
      } catch (error) {
        console.error('Task operation failed:', error);
        
        // Handle different error scenarios
        if (error.response) {
          // Server responded with an error status code
          const statusCode = error.response.status;
          const errorMessage = error.response.data?.message || 'Operation failed';
          
          if (statusCode === 401) {
            setError('Authentication failed. Please log in again.');
          } else if (statusCode === 403) {
            setError('You do not have permission to perform this action. Only admins and managers can create tasks.');
          } else {
            setError(`Error: ${errorMessage}`);
          }
          
          toast.error(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          setError('No response from server. Please check your connection.');
          toast.error('Server not responding. Please try again later.');
        } else {
          // Error in setting up the request
          setError(`Error: ${error.message}`);
          toast.error(error.message || 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    // Fetch employees for dropdown
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        const token = localStorage.getItem('token');
        const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
        
        const response = await axios.get('http://localhost:5000/api/employees', config);
        
        if (response.data && Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          // If backend is not available, use mock data
          console.log('Using mock employee data');
          setEmployees([
            { _id: '1', firstName: 'John', lastName: 'Doe' },
            { _id: '2', firstName: 'Jane', lastName: 'Smith' },
            { _id: '3', firstName: 'Mike', lastName: 'Johnson' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        // Use mock data as fallback
        setEmployees([
          { _id: '1', firstName: 'John', lastName: 'Doe' },
          { _id: '2', firstName: 'Jane', lastName: 'Smith' },
          { _id: '3', firstName: 'Mike', lastName: 'Johnson' },
        ]);
        toast.error('Failed to fetch employees. Using mock data.');
      } finally {
        setFetchingEmployees(false);
      }
    };

    fetchEmployees();

    // If editing, fetch task details
    if (isEdit) {
      const fetchTask = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
          
          const response = await axios.get(`http://localhost:5000/api/tasks/${id}`, config);
          
          // Format date to YYYY-MM-DD for the date input
          const task = response.data;
          task.dueDate = new Date(task.dueDate).toISOString().split('T')[0];
          
          formik.setValues(task);
        } catch (error) {
          toast.error('Failed to fetch task details');
          navigate('/tasks');
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [id, isEdit]);

  // Display warning if user doesn't have permission to create tasks
  useEffect(() => {
    if (!canCreateTask && !isEdit && backendAvailable) {
      toast.warning('Note: Only admins and managers can create tasks. Your task creation might fail.');
    }
  }, [canCreateTask, isEdit, backendAvailable]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </Typography>
          
          {!canCreateTask && !isEdit && backendAvailable && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Only administrators and managers can create tasks. Your current role is {user?.role}.
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Task Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formik.values.status}
                    label="Status"
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    label="Priority"
                    onChange={formik.handleChange}
                    error={formik.touched.priority && Boolean(formik.errors.priority)}
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="dueDate"
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.assignedTo && Boolean(formik.errors.assignedTo)}>
                  <InputLabel id="assigned-to-label">Assigned To</InputLabel>
                  <Select
                    labelId="assigned-to-label"
                    id="assignedTo"
                    name="assignedTo"
                    value={formik.values.assignedTo}
                    label="Assigned To"
                    onChange={formik.handleChange}
                    disabled={fetchingEmployees}
                    startAdornment={
                      fetchingEmployees ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null
                    }
                  >
                    {employees.length === 0 ? (
                      <MenuItem disabled value="">
                        No employees available
                      </MenuItem>
                    ) : (
                      employees.map((employee) => (
                        <MenuItem key={employee._id} value={employee._id}>
                          {employee.firstName} {employee.lastName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {formik.touched.assignedTo && formik.errors.assignedTo && (
                    <Typography color="error" variant="caption">
                      {formik.errors.assignedTo}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/tasks')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || fetchingEmployees}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : isEdit ? 'Update Task' : 'Create Task'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default TaskForm; 