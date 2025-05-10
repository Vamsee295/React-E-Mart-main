import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Employee Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/')}>
                <DashboardIcon sx={{ mr: 1 }} />
                Dashboard
              </Button>

              <Button color="inherit" onClick={() => navigate('/employees')}>
                <GroupIcon sx={{ mr: 1 }} />
                Employees
              </Button>

              <Button color="inherit" onClick={() => navigate('/tasks')}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Tasks
              </Button>

              <Button color="inherit" onClick={() => navigate('/profile')}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                Profile
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Button>

              <Button color="inherit" onClick={() => navigate('/register')}>
                <PersonAddIcon sx={{ mr: 1 }} />
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
