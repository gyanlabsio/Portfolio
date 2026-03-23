const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '24h',
    });
};

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
};

// @desc    Get CSRF token
// @route   GET /api/auth/csrf-token
exports.getCsrfToken = async (req, res) => {
    res.json({ success: true, csrfToken: req.csrfToken() });
};

// @desc    Login admin
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(admin._id);

        res.cookie('admin_token', token, cookieOptions);

        res.json({
            success: true,
            admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current admin
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({
        success: true,
        admin: { id: req.admin._id, email: req.admin.email, name: req.admin.name, role: req.admin.role },
    });
};

// @desc    Logout admin
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    res.clearCookie('admin_token', cookieOptions);
    res.json({ success: true, message: 'Logged out successfully' });
};
