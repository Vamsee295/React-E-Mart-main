import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  // Separate effect for loading employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await axios.get('http://localhost:5000/api/employees');
        
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
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // Effect for loading tasks with filters
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks with any applied filters
        let url = 'http://localhost:5000/api/tasks';
        const params = new URLSearchParams();
        
        if (statusFilter) params.append('status', statusFilter);
        if (priorityFilter) params.append('priority', priorityFilter);
        if (employeeFilter) params.append('employeeId', employeeFilter);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          // If backend is not available, use mock data
          console.log('Using mock task data');
          setTasks([
            {
              _id: '1',
              title: 'Complete project documentation',
              status: 'pending',
              priority: 'high',
              dueDate: new Date().toISOString(),
              assignedTo: { _id: '1', firstName: 'John', lastName: 'Doe' }
            },
            {
              _id: '2',
              title: 'Review code changes',
              status: 'in_progress',
              priority: 'medium',
              dueDate: new Date().toISOString(),
              assignedTo: { _id: '2', firstName: 'Jane', lastName: 'Smith' }
            },
            {
              _id: '3',
              title: 'Deploy application',
              status: 'completed',
              priority: 'high',
              dueDate: new Date().toISOString(),
              assignedTo: { _id: '3', firstName: 'Mike', lastName: 'Johnson' }
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        // Use mock data as fallback
        setTasks([
          {
            _id: '1',
            title: 'Complete project documentation',
            status: 'pending',
            priority: 'high',
            dueDate: new Date().toISOString(),
            assignedTo: { _id: '1', firstName: 'John', lastName: 'Doe' }
          },
          {
            _id: '2',
            title: 'Review code changes',
            status: 'in_progress',
            priority: 'medium',
            dueDate: new Date().toISOString(),
            assignedTo: { _id: '2', firstName: 'Jane', lastName: 'Smith' }
          },
          {
            _id: '3',
            title: 'Deploy application',
            status: 'completed',
            priority: 'high',
            dueDate: new Date().toISOString(),
            assignedTo: { _id: '3', firstName: 'Mike', lastName: 'Johnson' }
          }
        ]);
        toast.error('Failed to fetch tasks. Using mock data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [statusFilter, priorityFilter, employeeFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Tasks
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/tasks/add"
            >
              Add Task
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="priority-filter-label">Priority</InputLabel>
                <Select
                  labelId="priority-filter-label"
                  id="priority-filter"
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="employee-filter-label">Assigned To</InputLabel>
                <Select
                  labelId="employee-filter-label"
                  id="employee-filter"
                  value={employeeFilter}
                  label="Assigned To"
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  disabled={loadingEmployees}
                  startAdornment={
                    loadingEmployees ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null
                  }
                >
                  <MenuItem value="">All Employees</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      {employee.firstName} {employee.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No tasks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task) => (
                      <TableRow key={task._id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>
                          {task.assignedTo?.firstName} {task.assignedTo?.lastName}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={task.status.replace('_', ' ').toUpperCase()} 
                            color={getStatusColor(task.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={task.priority.toUpperCase()} 
                            color={getPriorityColor(task.priority)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{formatDate(task.dueDate)}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            component={Link} 
                            to={`/tasks/edit/${task._id}`}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(task._id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default TaskList; 