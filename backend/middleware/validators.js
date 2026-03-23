const { body, param } = require('express-validator');

const objectIdRule = (field) =>
  param(field).isMongoId().withMessage(`${field} must be a valid id`);

const authValidators = {
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
};

const contactValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('subject')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ max: 5000 }).withMessage('Message cannot exceed 5000 characters'),
  ],
  id: [objectIdRule('id')],
};

const blogValidators = {
  createOrUpdate: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required'),
    body('excerpt')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
    body('featuredImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Featured image must be a valid URL'),
    body('tags')
      .optional()
      .isArray().withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 40 }).withMessage('Each tag must be 1 to 40 characters'),
    body('published')
      .optional()
      .isBoolean().withMessage('Published must be a boolean'),
  ],
  id: [objectIdRule('id')],
};

const projectValidators = {
  createOrUpdate: [
    body('title')
      .trim()
      .notEmpty().withMessage('Project title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Project description is required')
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('shortDescription')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),
    body('techStack')
      .optional()
      .isArray().withMessage('Tech stack must be an array'),
    body('techStack.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 40 }).withMessage('Each tech value must be 1 to 40 characters'),
    body('featuredImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Featured image must be a valid URL'),
    body('images')
      .optional()
      .isArray().withMessage('Images must be an array'),
    body('images.*')
      .optional()
      .trim()
      .isURL().withMessage('Each image must be a valid URL'),
    body('githubUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('GitHub URL must be valid'),
    body('liveUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Live URL must be valid'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    body('order')
      .optional()
      .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  ],
  id: [objectIdRule('id')],
};

module.exports = {
  authValidators,
  blogValidators,
  contactValidators,
  projectValidators,
};
