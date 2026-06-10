const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(e => `${e.path}: ${e.msg}`).join(', ');
        return res.status(400).json({
            success: false,
            message: `Validation failed: ${errorMessages}`,
            errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

module.exports = validate;
