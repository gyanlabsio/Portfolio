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
  changePassword: [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 10 }).withMessage('New password must be at least 10 characters'),
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
    body('company')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('Company cannot exceed 100 characters'),
    body('budget')
      .optional({ values: 'falsy' })
      .isIn(['UNDER_1000', '1000_5000', '5000_10000', '10000_PLUS', 'NOT_SPECIFIED'])
      .withMessage('Invalid budget'),
    body('projectType')
      .optional({ values: 'falsy' })
      .isIn(['WEB_APP', 'SAAS', 'PORTFOLIO', 'E_COMMERCE', 'DASHBOARD', 'API', 'OTHER'])
      .withMessage('Invalid project type'),
    body('source')
      .optional({ values: 'falsy' })
      .isIn(['PORTFOLIO', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'REFERRAL', 'OTHER'])
      .withMessage('Invalid source'),
  ],
  updateStatus: [
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['NEW', 'CONTACTED', 'IN_DISCUSSION', 'CLOSED', 'SPAM'])
      .withMessage('Invalid status'),
  ],
  id: [objectIdRule('id')],
};

const contentValidators = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required'),
    body('type')
      .notEmpty().withMessage('Content type is required')
      .isIn(['BLOG', 'ARTICLE', 'CASE_STUDY', 'NOTE']).withMessage('Invalid content type'),
    body('excerpt')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
    body('coverImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Cover image must be a valid URL'),
    body('status')
      .optional()
      .isIn(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).withMessage('Invalid status'),
    body('tags')
      .optional()
      .isArray().withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 40 }).withMessage('Each tag must be 1 to 40 characters'),
    body('seoTitle')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('SEO title cannot exceed 100 characters'),
    body('seoDescription')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 160 }).withMessage('SEO description cannot exceed 160 characters'),
    body('publishedAt')
      .optional({ values: 'falsy' })
      .isISO8601().toDate().withMessage('Must be a valid date'),
    body('category')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    body('canonicalUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Canonical URL must be a valid URL'),
    body('readingTime')
      .optional()
      .isNumeric().withMessage('Reading time must be a number'),
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Title cannot be empty if provided')
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('content')
      .optional()
      .trim()
      .notEmpty().withMessage('Content cannot be empty if provided'),
    body('type')
      .optional()
      .isIn(['BLOG', 'ARTICLE', 'CASE_STUDY', 'NOTE']).withMessage('Invalid content type'),
    body('excerpt')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
    body('coverImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Cover image must be a valid URL'),
    body('status')
      .optional()
      .isIn(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).withMessage('Invalid status'),
    body('tags')
      .optional()
      .isArray().withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 40 }).withMessage('Each tag must be 1 to 40 characters'),
    body('seoTitle')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('SEO title cannot exceed 100 characters'),
    body('seoDescription')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 160 }).withMessage('SEO description cannot exceed 160 characters'),
    body('publishedAt')
      .optional({ values: 'falsy' })
      .isISO8601().toDate().withMessage('Must be a valid date'),
    body('category')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    body('canonicalUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Canonical URL must be a valid URL'),
    body('readingTime')
      .optional()
      .isNumeric().withMessage('Reading time must be a number'),
  ],
  id: [objectIdRule('id')],
};

const projectValidators = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Project title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Project description is required')
      .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
    body('techStack')
      .optional()
      .isArray().withMessage('Tech stack must be an array'),
    body('techStack.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 40 }).withMessage('Each tech value must be 1 to 40 characters'),
    body('coverImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Cover image must be a valid URL'),
    body('githubLink')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('GitHub link must be valid'),
    body('liveLink')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Live link must be valid'),
    body('category')
      .optional({ values: 'falsy' })
      .isIn(['WEB_APP', 'SAAS', 'DASHBOARD', 'E_COMMERCE', 'MOBILE', 'OTHER'])
      .withMessage('Invalid category'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Project title cannot be empty if provided')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .optional()
      .trim()
      .notEmpty().withMessage('Project description cannot be empty if provided')
      .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
    body('techStack')
      .optional()
      .isArray().withMessage('Tech stack must be an array'),
    body('techStack.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 40 }).withMessage('Each tech value must be 1 to 40 characters'),
    body('coverImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Cover image must be a valid URL'),
    body('githubLink')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('GitHub link must be valid'),
    body('liveLink')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Live link must be valid'),
    body('category')
      .optional({ values: 'falsy' })
      .isIn(['WEB_APP', 'SAAS', 'DASHBOARD', 'E_COMMERCE', 'MOBILE', 'OTHER'])
      .withMessage('Invalid category'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
  ],
  id: [objectIdRule('id')],
};

const testimonialValidators = {
  create: [
    body('clientName')
      .trim()
      .notEmpty().withMessage('Client name is required')
      .isLength({ max: 100 }).withMessage('Client name cannot exceed 100 characters'),
    body('testimonial')
      .trim()
      .notEmpty().withMessage('Testimonial content is required')
      .isLength({ max: 2000 }).withMessage('Testimonial cannot exceed 2000 characters'),
    body('clientRole')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('Client role cannot exceed 100 characters'),
    body('company')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('Company cannot exceed 100 characters'),
    body('avatar')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Avatar must be a valid URL'),
    body('rating')
      .optional({ values: 'falsy' })
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    body('status')
      .optional()
      .isIn(['PENDING', 'APPROVED', 'ARCHIVED']).withMessage('Invalid status'),
    body('source')
      .optional({ values: 'falsy' })
      .isIn(['LINKEDIN', 'UPWORK', 'FIVERR', 'EMAIL', 'DIRECT_CLIENT', 'OTHER'])
      .withMessage('Invalid source'),
    body('sourceUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Source URL must be valid'),
    body('projectId')
      .optional({ values: 'falsy' })
      .isMongoId().withMessage('Project ID must be a valid Mongo ID'),
  ],
  update: [
    body('clientName')
      .optional()
      .trim()
      .notEmpty().withMessage('Client name cannot be empty if provided')
      .isLength({ max: 100 }).withMessage('Client name cannot exceed 100 characters'),
    body('testimonial')
      .optional()
      .trim()
      .notEmpty().withMessage('Testimonial content cannot be empty if provided')
      .isLength({ max: 2000 }).withMessage('Testimonial cannot exceed 2000 characters'),
    body('clientRole')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('Client role cannot exceed 100 characters'),
    body('company')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('Company cannot exceed 100 characters'),
    body('avatar')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Avatar must be a valid URL'),
    body('rating')
      .optional({ values: 'falsy' })
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    body('status')
      .optional()
      .isIn(['PENDING', 'APPROVED', 'ARCHIVED']).withMessage('Invalid status'),
    body('source')
      .optional({ values: 'falsy' })
      .isIn(['LINKEDIN', 'UPWORK', 'FIVERR', 'EMAIL', 'DIRECT_CLIENT', 'OTHER'])
      .withMessage('Invalid source'),
    body('sourceUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Source URL must be valid'),
    body('projectId')
      .optional({ values: 'falsy' })
      .isMongoId().withMessage('Project ID must be a valid Mongo ID'),
  ],
  updateStatus: [
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['PENDING', 'APPROVED', 'ARCHIVED'])
      .withMessage('Invalid status'),
  ],
  id: [objectIdRule('id')],
};

const serviceValidators = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Service title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Service description is required')
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('features')
      .optional()
      .isArray().withMessage('Features must be an array'),
    body('features.*')
      .optional()
      .trim()
      .isLength({ max: 150 }).withMessage('Each feature cannot exceed 150 characters'),
    body('startingPrice')
      .optional()
      .trim(),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Service title cannot be empty if provided')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .optional()
      .trim()
      .notEmpty().withMessage('Service description cannot be empty if provided')
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('features')
      .optional()
      .isArray().withMessage('Features must be an array'),
    body('features.*')
      .optional()
      .trim()
      .isLength({ max: 150 }).withMessage('Each feature cannot exceed 150 characters'),
    body('startingPrice')
      .optional()
      .trim(),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
  ],
  id: [objectIdRule('id')],
};

const leadValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('phone')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters'),
    body('company')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('Company cannot exceed 100 characters'),
    body('projectType')
      .optional({ values: 'falsy' })
      .isIn(['WEB_APP', 'SAAS', 'DASHBOARD', 'E_COMMERCE', 'MOBILE', 'OTHER']).withMessage('Invalid project type'),
    body('budget')
      .optional({ values: 'falsy' })
      .isIn(['UNDER_1000', '1000_5000', '5000_10000', '10000_PLUS', 'NOT_SPECIFIED']).withMessage('Invalid budget'),
    body('source')
      .optional({ values: 'falsy' })
      .isIn(['PORTFOLIO', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'REFERRAL', 'OTHER']).withMessage('Invalid source'),
    body('status')
      .optional({ values: 'falsy' })
      .isIn(['NEW', 'CONTACTED', 'IN_DISCUSSION', 'WON', 'LOST']).withMessage('Invalid status'),
    body('notes')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty().withMessage('Name cannot be empty if provided')
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
      .optional()
      .trim()
      .notEmpty().withMessage('Email cannot be empty if provided')
      .isEmail().withMessage('Please provide a valid email'),
    body('phone')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters'),
    body('company')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 }).withMessage('Company cannot exceed 100 characters'),
    body('projectType')
      .optional({ values: 'falsy' })
      .isIn(['WEB_APP', 'SAAS', 'DASHBOARD', 'E_COMMERCE', 'MOBILE', 'OTHER']).withMessage('Invalid project type'),
    body('budget')
      .optional({ values: 'falsy' })
      .isIn(['UNDER_1000', '1000_5000', '5000_10000', '10000_PLUS', 'NOT_SPECIFIED']).withMessage('Invalid budget'),
    body('source')
      .optional({ values: 'falsy' })
      .isIn(['PORTFOLIO', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'REFERRAL', 'OTHER']).withMessage('Invalid source'),
    body('status')
      .optional({ values: 'falsy' })
      .isIn(['NEW', 'CONTACTED', 'IN_DISCUSSION', 'WON', 'LOST']).withMessage('Invalid status'),
    body('notes')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),
  ],
  id: [objectIdRule('id')],
};

const uploadValidators = {
  moduleCheck: [
    body('module')
      .notEmpty().withMessage('Module category is required')
      .isIn(['PROJECT', 'CONTENT', 'TESTIMONIAL', 'SERVICE'])
      .withMessage('Invalid module category'),
  ],
  id: [objectIdRule('id')],
};

const analyticsValidators = {
  create: [
    body('type')
      .notEmpty().withMessage('Event type is required')
      .isIn(['PAGE_VIEW', 'CLICK', 'FORM_SUBMISSION']).withMessage('Invalid event type'),
    body('page')
      .trim()
      .notEmpty().withMessage('Page identifier is required'),
    body('module')
      .notEmpty().withMessage('Module category is required')
      .isIn(['PROJECT', 'CONTENT', 'SERVICE', 'CONTACT', 'TESTIMONIAL', 'OTHER']).withMessage('Invalid module category'),
    body('element')
      .optional({ values: 'falsy' })
      .trim(),
    body('metadata')
      .optional()
      .isObject().withMessage('Metadata must be a valid JSON object'),
  ],
};

const settingsValidators = {
  update: [
    body('siteTitle')
      .optional()
      .trim()
      .notEmpty().withMessage('Site title cannot be empty if provided'),
    body('email')
      .optional()
      .trim()
      .notEmpty().withMessage('Email cannot be empty if provided')
      .isEmail().withMessage('Please provide a valid email'),
    body('logoUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Logo URL must be a valid URL'),
    body('faviconUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Favicon URL must be a valid URL'),
    body('resumeUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Resume URL must be a valid URL'),
    body('availabilityStatus')
      .optional({ values: 'falsy' })
      .isIn(['AVAILABLE', 'BUSY', 'UNAVAILABLE']).withMessage('Invalid availability status'),
    body('socialLinks')
      .optional()
      .isObject().withMessage('Social links must be a valid JSON object'),
    body('homepageSections')
      .optional()
      .isObject().withMessage('Homepage sections must be a valid JSON object'),
  ],
};

const seoValidators = {
  create: [
    body('pageSlug')
      .trim()
      .notEmpty().withMessage('Page slug is required'),
    body('canonicalUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Canonical URL must be a valid URL'),
    body('ogImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('OG Image must be a valid URL'),
    body('twitterCard')
      .optional({ values: 'falsy' })
      .isIn(['summary', 'summary_large_image']).withMessage('Invalid twitter card type'),
  ],
  update: [
    body('pageSlug')
      .optional()
      .trim()
      .notEmpty().withMessage('Page slug cannot be empty if provided'),
    body('canonicalUrl')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('Canonical URL must be a valid URL'),
    body('ogImage')
      .optional({ values: 'falsy' })
      .trim()
      .isURL().withMessage('OG Image must be a valid URL'),
    body('twitterCard')
      .optional({ values: 'falsy' })
      .isIn(['summary', 'summary_large_image']).withMessage('Invalid twitter card type'),
  ],
};

module.exports = {
  authValidators,
  contentValidators,
  contactValidators,
  projectValidators,
  testimonialValidators,
  serviceValidators,
  leadValidators,
  uploadValidators,
  analyticsValidators,
  settingsValidators,
  seoValidators,
};
