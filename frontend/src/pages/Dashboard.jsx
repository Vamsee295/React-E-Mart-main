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
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
    <Grid item xs={6} sm={6} md={3}>
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
          <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant={isMobile ? "body1" : "h6"} color="white">
                  {title}
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" color="white">
                  {value}
                </Typography>
              </Box>
              <Box sx={{ 
                color: 'white', 
                opacity: 0.8,
                borderRadius: '50%',
                padding: isMobile ? '6px' : '10px',
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 64px)' }}>
        <Typography variant="h5">Loading dashboard data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      mt: { xs: 2, sm: 3, md: 4 }, 
      mb: { xs: 2, sm: 3, md: 4 }, 
      px: { xs: 1, sm: 2, md: 3 },
      minHeight: 'calc(100vh - 64px)' 
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 2,
        pb: 2,
        borderBottom: '1px solid #eaeaea',
        gap: isMobile ? 2 : 0,
      }}>
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom color="text.secondary">
            Welcome, {user?.username || 'User'}!
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignSelf: isMobile ? 'flex-end' : 'center' }}>
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

      <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: { xs: 2, sm: 3, md: 4 }, mt: 1 }}>
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<PeopleIcon fontSize={isMobile ? "medium" : "large"} />}
          color="#0088ff"
        />
        <StatCard
          title="Departments"
          value={stats.departments}
          icon={<BusinessIcon fontSize={isMobile ? "medium" : "large"} />}
          color="#2e7d32"
        />
        <StatCard
          title="Avg. Salary"
          value={`$${stats.averageSalary.toLocaleString()}`}
          icon={<MoneyIcon fontSize={isMobile ? "medium" : "large"} />}
          color="#ed6c02"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<AnnouncementIcon fontSize={isMobile ? "medium" : "large"} />}
          color="#9c27b0"
        />
      </Grid>

      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold">
          Quick Overview
        </Typography>
        <Typography paragraph color="text.secondary" sx={{ fontSize: isMobile ? '14px' : '16px' }}>
          This dashboard gives you an overview of your organization's employee management.
          You can add, edit, and manage employees from the Employees section.
        </Typography>
        <Typography sx={{ fontSize: isMobile ? '14px' : '16px' }}>
          The system currently has <b>{stats.totalEmployees}</b> employees across <b>{stats.departments}</b>{' '}
          departments with an average salary of <b>${stats.averageSalary.toLocaleString()}</b>.
        </Typography>
      </Paper>

      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 3, md: 4 }, 
              height: '100%',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold">
              Recent Activities
            </Typography>
            <Box sx={{ 
              '& > p': { 
                padding: isMobile ? '8px 0' : '10px 0',
                borderBottom: '1px dashed #eaeaea',
                transition: 'background-color 0.2s',
                fontSize: isMobile ? '14px' : '16px',
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
              p: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 3, md: 4 }, 
              height: '100%',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: isMobile ? 1 : 0
            }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                gutterBottom={!isMobile} 
                fontWeight="bold" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <AssignmentIcon sx={{ mr: 1, color: '#0088ff' }} />
                Recent Tasks
              </Typography>
              <Button 
                variant="text" 
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  color: '#0088ff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 136, 255, 0.1)',
                  },
                  ml: 'auto'
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
              <List dense={isMobile}>
                {recentTasks.map((task, index) => (
                  <React.Fragment key={task._id || index}>
                    <ListItem 
                      sx={{ 
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 136, 255, 0.05)',
                        },
                        borderRadius: '4px',
                        py: isMobile ? 0.5 : 1
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight="medium" fontSize={isMobile ? '14px' : '16px'}>
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span" fontSize={isMobile ? '12px' : '14px'}>
                              Due: {formatDate(task.dueDate)}
                            </Typography>
                            <Box mt={0.5}>
                              <Chip
                                label={task.status.replace('_', ' ').toUpperCase()}
                                color={getStatusColor(task.status)}
                                size="small"
                                sx={{ mr: 1, height: isMobile ? '20px' : '24px', fontSize: isMobile ? '10px' : '12px' }}
                              />
                              {task.assignedTo && (
                                <Typography variant="caption" component="span" fontSize={isMobile ? '10px' : '12px'}>
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
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3, md: 4 },
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold">
          Department Distribution (Chart Placeholder)
        </Typography>
        <Box
          sx={{
            height: isMobile ? 150 : 200,
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
          <Typography variant="body2" color="text.secondary" fontSize={isMobile ? '12px' : '14px'}>
            (Chart goes here – e.g., Pie/Bar Chart of departments)
          </Typography>
        </Box>
      </Paper>

      <Box 
        display="flex" 
        justifyContent="space-between"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={isMobile ? 2 : 0}
      >
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          fullWidth={isMobile}
          sx={{ 
            bgcolor: '#0066cc',
            '&:hover': {
              bgcolor: '#004c99',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            padding: isMobile ? '8px 16px' : '10px 20px',
            fontSize: isMobile ? '13px' : '14px',
          }}
          onClick={() => navigate('/tasks/add')}
        >
          Create New Task
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PersonIcon />}
          fullWidth={isMobile}
          sx={{ 
            bgcolor: '#0088ff',
            '&:hover': {
              bgcolor: '#0072d6',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            padding: isMobile ? '8px 16px' : '10px 20px',
            fontSize: isMobile ? '13px' : '14px',
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
 