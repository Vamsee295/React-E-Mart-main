const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true,
        enum: ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales']
    },
    position: {
        type: String,
        required: true,
        trim: true,
        enum: ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator', 'Specialist']
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    hireDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'on_leave', 'terminated'],
        default: 'active'
    },
    profileImage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema); 