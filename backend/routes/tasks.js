const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth, checkRole } = require('../middleware/auth');

// Mock data for when MongoDB is not available
let MOCK_TASKS = [
    {
        _id: '1',
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the project',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(),
        assignedTo: { _id: '1', firstName: 'John', lastName: 'Doe' },
        assignedBy: { _id: '1', username: 'admin', email: 'admin@example.com' },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '2',
        title: 'Review code changes',
        description: 'Review pull requests and code changes',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(),
        assignedTo: { _id: '2', firstName: 'Jane', lastName: 'Smith' },
        assignedBy: { _id: '1', username: 'admin', email: 'admin@example.com' },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '3',
        title: 'Deploy application',
        description: 'Deploy the application to production',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(),
        assignedTo: { _id: '3', firstName: 'Mike', lastName: 'Johnson' },
        assignedBy: { _id: '1', username: 'admin', email: 'admin@example.com' },
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Helper function to check if MongoDB is available
const isMockMode = async () => {
    try {
        // Try to connect to MongoDB by finding one document
        await Task.findOne();
        return false; // MongoDB is available
    } catch (error) {
        console.log('MongoDB not available, using mock data');
        return true; // MongoDB is not available
    }
};

// Get all tasks (with optional filtering)
router.get('/', auth, async (req, res) => {
    try {
        const mockMode = await isMockMode();

        if (mockMode) {
            // Use mock data
            let filteredTasks = [...MOCK_TASKS];
            
            // Apply filtering
            if (req.query.employeeId) {
                filteredTasks = filteredTasks.filter(task => 
                    task.assignedTo._id === req.query.employeeId);
            }
            if (req.query.status) {
                filteredTasks = filteredTasks.filter(task => 
                    task.status === req.query.status);
            }
            if (req.query.priority) {
                filteredTasks = filteredTasks.filter(task => 
                    task.priority === req.query.priority);
            }
            
            return res.json(filteredTasks);
        }

        // Real MongoDB mode
        const filter = {};
        
        // Filter by assignedTo if specified
        if (req.query.employeeId) {
            filter.assignedTo = req.query.employeeId;
        }
        
        // Filter by status if specified
        if (req.query.status) {
            filter.status = req.query.status;
        }
        
        // Filter by priority if specified
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'firstName lastName email')
            .populate('assignedBy', 'username email')
            .sort({ dueDate: 1 });
            
        res.json(tasks);
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
    try {
        const mockMode = await isMockMode();

        if (mockMode) {
            // Use mock data
            const task = MOCK_TASKS.find(task => task._id === req.params.id);
            
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            
            return res.json(task);
        }

        // Real MongoDB mode
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'firstName lastName email')
            .populate('assignedBy', 'username email');
            
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        console.error('Error getting task by ID:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create task (admin and manager only)
router.post('/', auth, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const mockMode = await isMockMode();

        if (mockMode) {
            // Use mock data
            const newId = (MOCK_TASKS.length + 1).toString();
            const newTask = {
                _id: newId,
                ...req.body,
                assignedBy: {
                    _id: req.user.userId,
                    username: req.user.username || 'admin',
                    email: req.user.email || 'admin@example.com'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Find the assigned employee from our mock data
            const assignedEmployee = [
                { _id: '1', firstName: 'John', lastName: 'Doe' },
                { _id: '2', firstName: 'Jane', lastName: 'Smith' },
                { _id: '3', firstName: 'Mike', lastName: 'Johnson' }
            ].find(emp => emp._id === req.body.assignedTo);
            
            if (assignedEmployee) {
                newTask.assignedTo = assignedEmployee;
            }
            
            MOCK_TASKS.push(newTask);
            return res.status(201).json(newTask);
        }

        // Real MongoDB mode
        const task = new Task({
            ...req.body,
            assignedBy: req.user.userId
        });
        
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    try {
        const mockMode = await isMockMode();

        if (mockMode) {
            // Use mock data
            const taskIndex = MOCK_TASKS.findIndex(task => task._id === req.params.id);
            
            if (taskIndex === -1) {
                return res.status(404).json({ message: 'Task not found' });
            }
            
            // Check permissions
            const task = MOCK_TASKS[taskIndex];
            if (req.user.role !== 'admin' && 
                req.user.role !== 'manager' && 
                task.assignedTo._id !== req.user.userId) {
                return res.status(403).json({ message: 'Not authorized to update this task' });
            }
            
            // Update the task
            if (req.user.role === 'employee' && task.assignedTo._id === req.user.userId) {
                // Employees can only update status
                MOCK_TASKS[taskIndex] = {
                    ...task,
                    status: req.body.status,
                    updatedAt: new Date()
                };
            } else {
                // Admins and managers can update all fields
                const updatedTask = { ...task, ...req.body, updatedAt: new Date() };
                
                // Find the assigned employee from our mock data if it changed
                if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo._id) {
                    const assignedEmployee = [
                        { _id: '1', firstName: 'John', lastName: 'Doe' },
                        { _id: '2', firstName: 'Jane', lastName: 'Smith' },
                        { _id: '3', firstName: 'Mike', lastName: 'Johnson' }
                    ].find(emp => emp._id === req.body.assignedTo);
                    
                    if (assignedEmployee) {
                        updatedTask.assignedTo = assignedEmployee;
                    }
                }
                
                MOCK_TASKS[taskIndex] = updatedTask;
            }
            
            return res.json(MOCK_TASKS[taskIndex]);
        }
        
        // Real MongoDB mode
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Only admin, manager, or the person assigned to the task can update it
        if (req.user.role !== 'admin' && 
            req.user.role !== 'manager' && 
            task.assignedTo.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }
        
        // If a regular employee is updating, they can only update the status
        if (req.user.role === 'employee' && task.assignedTo.toString() === req.user.userId) {
            task.status = req.body.status;
        } else {
            // Admins and managers can update all fields
            Object.assign(task, req.body);
        }
        
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete task (admin and manager only)
router.delete('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const mockMode = await isMockMode();

        if (mockMode) {
            // Use mock data
            const taskIndex = MOCK_TASKS.findIndex(task => task._id === req.params.id);
            
            if (taskIndex === -1) {
                return res.status(404).json({ message: 'Task not found' });
            }
            
            MOCK_TASKS.splice(taskIndex, 1);
            return res.json({ message: 'Task deleted' });
        }

        // Real MongoDB mode
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 