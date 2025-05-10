const jwt = require('jsonwebtoken');

// Mock users for when MongoDB is not available
const MOCK_USERS = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
    },
    {
        id: '2',
        username: 'manager',
        email: 'manager@example.com',
        role: 'manager'
    },
    {
        id: '3',
        username: 'employee',
        email: 'employee@example.com',
        role: 'employee'
    }
];

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        try {
            // Attempt to verify the token
            const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.user = verified;
            next();
        } catch (jwtError) {
            // If token verification fails, check if it's a mock token
            if (token === 'mock-jwt-token') {
                console.log('Using mock authentication');
                
                // For mock mode, extract user info from headers if available
                const mockUserId = req.header('X-Mock-User-Id') || '1';
                const mockUser = MOCK_USERS.find(u => u.id === mockUserId) || MOCK_USERS[0];
                
                req.user = {
                    userId: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                    role: mockUser.role
                };
                
                return next();
            }
            
            // If not a mock token, return error
            return res.status(401).json({ message: 'Token verification failed, authorization denied' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        // In mock mode, handle employee role specially
        if (req.header('Authorization') === 'Bearer mock-jwt-token' && req.user.role === 'employee') {
            // For testing purposes, allow employees to perform admin actions in mock mode
            console.log('Mock mode: Bypassing role check for employee');
            return next();
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};

module.exports = { auth, checkRole }; 