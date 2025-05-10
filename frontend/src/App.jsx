import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { EmployeeProvider } from './contexts/EmployeeContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <EmployeeProvider>
        <Router>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/employees" element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            } />
            <Route path="/employees/add" element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            } />
            <Route path="/employees/edit/:id" element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            } />
            {/* Task Routes */}
            <Route path="/tasks" element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            } />
            <Route path="/tasks/add" element={
              <PrivateRoute>
                <TaskForm />
              </PrivateRoute>
            } />
            <Route path="/tasks/edit/:id" element={
              <PrivateRoute>
                <TaskForm />
              </PrivateRoute>
            } />
            {/* Profile Route */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </EmployeeProvider>
    </ThemeProvider>
  );
}

export default App; 