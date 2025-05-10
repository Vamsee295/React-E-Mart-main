import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

// Mock data for employees
const MOCK_EMPLOYEES = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    department: 'IT',
    position: 'Developer',
    salary: 85000,
    hireDate: '2020-01-15T00:00:00.000Z',
    status: 'active',
    createdAt: '2020-01-15T00:00:00.000Z',
    updatedAt: '2023-04-10T00:00:00.000Z'
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    department: 'HR',
    position: 'Manager',
    salary: 95000,
    hireDate: '2019-06-20T00:00:00.000Z',
    status: 'active',
    createdAt: '2019-06-20T00:00:00.000Z',
    updatedAt: '2023-03-15T00:00:00.000Z'
  },
  {
    _id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '555-555-5555',
    department: 'Finance',
    position: 'Analyst',
    salary: 75000,
    hireDate: '2021-03-10T00:00:00.000Z',
    status: 'active',
    createdAt: '2021-03-10T00:00:00.000Z',
    updatedAt: '2023-01-05T00:00:00.000Z'
  },
  {
    _id: '4',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    phone: '555-222-3333',
    department: 'Marketing',
    position: 'Coordinator',
    salary: 65000,
    hireDate: '2022-02-05T00:00:00.000Z',
    status: 'on_leave',
    createdAt: '2022-02-05T00:00:00.000Z',
    updatedAt: '2023-05-20T00:00:00.000Z'
  },
  {
    _id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '555-444-7777',
    department: 'Sales',
    position: 'Representative',
    salary: 70000,
    hireDate: '2021-07-15T00:00:00.000Z',
    status: 'terminated',
    createdAt: '2021-07-15T00:00:00.000Z',
    updatedAt: '2022-12-01T00:00:00.000Z'
  }
];

const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendAvailable } = useAuth();
  
  // Initialize employees data
  useEffect(() => {
    fetchEmployees();
  }, [backendAvailable]);

  const fetchEmployees = async () => {
    setLoading(true);
    
    if (backendAvailable) {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        setEmployees(response.data);
      } catch (error) {
        toast.error('Failed to fetch employees');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      // Use mock data
      setTimeout(() => {
        setEmployees([...MOCK_EMPLOYEES]);
        setLoading(false);
      }, 500);
    }
  };

  const getEmployee = async (id) => {
    if (backendAvailable) {
      try {
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
        return response.data;
      } catch (error) {
        toast.error('Failed to fetch employee details');
        throw error;
      }
    } else {
      // Use mock data
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const employee = MOCK_EMPLOYEES.find(emp => emp._id === id);
          if (employee) {
            resolve({...employee});
          } else {
            reject(new Error('Employee not found'));
          }
        }, 300);
      });
    }
  };

  const addEmployee = async (employeeData) => {
    if (backendAvailable) {
      try {
        const response = await axios.post('http://localhost:5000/api/employees', employeeData);
        setEmployees([response.data, ...employees]);
        return response.data;
      } catch (error) {
        toast.error('Failed to add employee');
        throw error;
      }
    } else {
      // Simulate adding employee
      return new Promise((resolve) => {
        setTimeout(() => {
          const newEmployee = {
            ...employeeData,
            _id: String(Date.now()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Update the local state
          setEmployees([newEmployee, ...employees]);
          MOCK_EMPLOYEES.unshift(newEmployee);
          
          resolve(newEmployee);
        }, 500);
      });
    }
  };

  const updateEmployee = async (id, employeeData) => {
    if (backendAvailable) {
      try {
        const response = await axios.put(`http://localhost:5000/api/employees/${id}`, employeeData);
        setEmployees(employees.map(emp => emp._id === id ? response.data : emp));
        return response.data;
      } catch (error) {
        toast.error('Failed to update employee');
        throw error;
      }
    } else {
      // Simulate updating employee
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedEmployee = {
            ...employeeData,
            _id: id,
            updatedAt: new Date().toISOString()
          };
          
          // Update both states
          setEmployees(employees.map(emp => emp._id === id ? updatedEmployee : emp));
          
          // Update mock data
          const index = MOCK_EMPLOYEES.findIndex(emp => emp._id === id);
          if (index !== -1) {
            MOCK_EMPLOYEES[index] = updatedEmployee;
          }
          
          resolve(updatedEmployee);
        }, 500);
      });
    }
  };

  const deleteEmployee = async (id) => {
    if (backendAvailable) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
        return true;
      } catch (error) {
        toast.error('Failed to delete employee');
        throw error;
      }
    } else {
      // Simulate deleting employee
      return new Promise((resolve) => {
        setTimeout(() => {
          setEmployees(employees.filter(emp => emp._id !== id));
          
          // Update mock data
          const index = MOCK_EMPLOYEES.findIndex(emp => emp._id === id);
          if (index !== -1) {
            MOCK_EMPLOYEES.splice(index, 1);
          }
          
          resolve(true);
        }, 500);
      });
    }
  };

  const getStats = () => {
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const departments = [...new Set(employees.map(emp => emp.department))].length;
    const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
    const averageSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;
    
    return {
      totalEmployees: employees.length,
      activeEmployees,
      departments,
      averageSalary
    };
  };

  return (
    <EmployeeContext.Provider value={{
      employees,
      loading,
      fetchEmployees,
      getEmployee,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getStats
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
}; 