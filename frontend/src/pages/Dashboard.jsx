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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Announcement as AnnouncementIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
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
      <Paper 
        elevation={3} 
        sx={{ 
          height: '100%',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }
        }}
      >
        <Card sx={{ 
          height: '100%', 
          bgcolor: color,
          borderRadius: '8px',
        }}>
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
              <Box sx={{ 
                color: 'white', 
                opacity: 0.8,
                borderRadius: '50%',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}>
                {icon}
              </Box>
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        pb: 2,
        borderBottom: '1px solid #eaeaea',
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Welcome, {user?.username || 'User'}!
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Add New Employee">
            <IconButton 
              color="primary" 
              sx={{ 
                bgcolor: 'rgba(0, 136, 255, 0.1)',
                mr: 1,
                '&:hover': {
                  bgcolor: 'rgba(0, 136, 255, 0.2)',
                }
              }}
              onClick={() => navigate('/employees/add')}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create New Task">
            <IconButton 
              color="primary" 
              sx={{ 
                bgcolor: 'rgba(0, 136, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(0, 136, 255, 0.2)',
                }
              }}
              onClick={() => navigate('/tasks/add')}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<PeopleIcon fontSize="large" />}
          color="#0088ff"
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

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Quick Overview
        </Typography>
        <Typography paragraph color="text.secondary">
          This dashboard gives you an overview of your organization's employee management.
          You can add, edit, and manage employees from the Employees section.
        </Typography>
        <Typography sx={{ fontSize: '16px' }}>
          The system currently has <b>{stats.totalEmployees}</b> employees across <b>{stats.departments}</b>{' '}
          departments with an average salary of <b>${stats.averageSalary.toLocaleString()}</b>.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              height: '100%',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Recent Activities
            </Typography>
            <Box sx={{ 
              '& > p': { 
                padding: '10px 0',
                borderBottom: '1px dashed #eaeaea',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 136, 255, 0.05)',
                  paddingLeft: '5px',
                }
              } 
            }}>
              <Typography>- John Doe was added to the Marketing department.</Typography>
              <Typography>- Sarah Smith's role changed to Senior Developer.</Typography>
              <Typography>- A new department "Customer Success" was created.</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              height: '100%',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1, color: '#0088ff' }} />
                Recent Tasks
              </Typography>
              <Button 
                variant="text" 
                sx={{ 
                  color: '#0088ff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 136, 255, 0.1)',
                  }
                }} 
                endIcon={<VisibilityIcon />}
                onClick={() => navigate('/tasks')}
              >
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
                    <ListItem 
                      sx={{ 
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 136, 255, 0.05)',
                        },
                        borderRadius: '4px'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight="medium">{task.title}</Typography>
                        }
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

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Department Distribution (Chart Placeholder)
        </Typography>
        <Box
          sx={{
            height: 200,
            bgcolor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            (Chart goes here – e.g., Pie/Bar Chart of departments)
          </Typography>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="space-between">
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ 
            bgcolor: '#0066cc',
            '&:hover': {
              bgcolor: '#004c99',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          onClick={() => navigate('/tasks/add')}
        >
          Create New Task
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PersonIcon />}
          sx={{ 
            bgcolor: '#0088ff',
            '&:hover': {
              bgcolor: '#0072d6',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          onClick={() => navigate('/employees/add')}
        >
          Add New Employee
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
 