import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Announcement as AnnouncementIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../contexts/EmployeeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const { getStats, loading } = useEmployees();
  const navigate = useNavigate();
  const [recentTasks, setRecentTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    averageSalary: 0,
    activeEmployees: 0,
  });

  useEffect(() => {
    if (!loading) {
      setStats(getStats());
    }
  }, [loading, getStats]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        const response = await axios.get('http://localhost:5000/api/tasks?limit=5');
        setRecentTasks(response.data.slice(0, 5)); // Get only 5 most recent tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={3} sx={{ height: '100%' }}>
        <Card sx={{ height: '100%', bgcolor: color }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" color="white">
                  {title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="white">
                  {value}
                </Typography>
              </Box>
              <Box sx={{ color: 'white', opacity: 0.8 }}>{icon}</Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Grid>
  );

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5">Loading dashboard data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="h6" gutterBottom>
        Welcome, {user?.username || 'User'}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<PeopleIcon fontSize="large" />}
          color="#1976d2"
        />
        <StatCard
          title="Departments"
          value={stats.departments}
          icon={<BusinessIcon fontSize="large" />}
          color="#2e7d32"
        />
        <StatCard
          title="Avg. Salary"
          value={`$${stats.averageSalary.toLocaleString()}`}
          icon={<MoneyIcon fontSize="large" />}
          color="#ed6c02"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<AnnouncementIcon fontSize="large" />}
          color="#9c27b0"
        />
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Overview
        </Typography>
        <Typography paragraph>
          This dashboard gives you an overview of your organization's employee management.
          You can add, edit, and manage employees from the Employees section.
        </Typography>
        <Typography>
          The system currently has {stats.totalEmployees} employees across {stats.departments}{' '}
          departments with an average salary of ${stats.averageSalary.toLocaleString()}.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Recent Activities
            </Typography>
            <Typography>- John Doe was added to the Marketing department.</Typography>
            <Typography>- Sarah Smith's role changed to Senior Developer.</Typography>
            <Typography>- A new department "Customer Success" was created.</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Tasks
              </Typography>
              <Button variant="text" color="primary" onClick={() => navigate('/tasks')}>
                View All
              </Button>
            </Box>
            
            {tasksLoading ? (
              <Typography>Loading tasks...</Typography>
            ) : recentTasks.length === 0 ? (
              <Typography>No tasks found</Typography>
            ) : (
              <List>
                {recentTasks.map((task, index) => (
                  <React.Fragment key={task._id || index}>
                    <ListItem>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              Due: {formatDate(task.dueDate)}
                            </Typography>
                            <Box mt={1}>
                              <Chip
                                label={task.status.replace('_', ' ').toUpperCase()}
                                color={getStatusColor(task.status)}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              {task.assignedTo && (
                                <Typography variant="caption" component="span">
                                  Assigned to: {task.assignedTo.firstName} {task.assignedTo.lastName}
                                </Typography>
                              )}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentTasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Department Distribution (Chart Placeholder)
        </Typography>
        <Box
          sx={{
            height: 200,
            bgcolor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            (Chart goes here – e.g., Pie/Bar Chart of departments)
          </Typography>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={() => navigate('/tasks/add')}>
          Create New Task
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/employees/add')}>
          Add New Employee
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
 