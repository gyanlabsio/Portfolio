const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token = req.cookies?.admin_token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id);
        if (!req.admin) {
            return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
};

const optionalProtect = async (req, res, next) => {
    let token = req.cookies?.admin_token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = await Admin.findById(decoded.id);
        } catch (error) {}
    }
    next();
};

const authorize = (...roles) => (req, res, next) => {
    const userRole = req.admin.role || 'admin';
    // superadmin should have access to all admin routes
    if (!roles.includes(userRole) && userRole !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized for this action',
        });
    }
    next();
};

module.exports = { protect, optionalProtect, authorize };
