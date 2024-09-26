const { check, validationResult } = require("express-validator");
const query = require('../db/query')

const validateSignUp = [
  // Define validation rules
  check('firstname').trim().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long').isAlpha().withMessage('Name should only contain letters').escape(),
  check('lastname').isAlpha().withMessage('Name should only contain letters').trim().notEmpty().withMessage('Last name is required').escape(),
  check('username').trim().toLowerCase().notEmpty().withMessage('Username is required').escape(),
  check('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').escape(),
  check('confirmpassword')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password confirmation must be at least 6 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  // Middleware function to check validation result
  async (req, res, next) => {
    const errors = validationResult(req);

    const response = await query.checkUniqueUser(req.body.username)
    if (response) {
      errors.errors.push({ msg: 'Username already exists' })
    }

    if (!errors.isEmpty()) {
      res.locals.errors = errors.array(); // Pass errors to the view

      // Render the sign-up page with errors and the form data
      return res.render('sign-up', {
        errors: res.locals.errors,
        formData: req.body, // Send back the input data the user entered
      });
    }

    // If no errors, proceed to next middleware

    next();
  }
];

const messageValidators = [
  // Title validation
  check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long')
    .isLength({ max: 100 }).withMessage('Title can be at most 100 characters long')
    .trim()
    .escape(),
  // Body validation
  check('body')
    .notEmpty().withMessage('Message body is required')
    .isLength({ min: 10 }).withMessage('Message body must be at least 10 characters long')
    .trim()
    .escape(), 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.errors = errors.array();
      // Re-render the form with errors and form data
      return res.render('messageForm', {
        errors: res.locals.errors,
        formData: req.body,// Keep entered data in form
      });
    }
    next();
  }
]

const validateLogin = [
  check('username').trim().notEmpty().withMessage('Username is required').escape(),
  check('password').trim().notEmpty().withMessage('Password is required').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.errors = errors.array();
      return res.render('log-in', {
        errors: res.locals.errors,
        formData: req.body,
      });
    }
    next();
  }
]

const validateMemberForm = [
  check('secretKey').trim().notEmpty().withMessage('Secret key is required').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.errors = errors.array();
      return res.render('memberForm');
    }
    next();
  }
]

const validateAdmin = [
  check('admin').trim().notEmpty().withMessage('Password is required').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.errors = errors.array();
      return res.render('admin');
    }
    next();
  }
]


module.exports = {
  validateSignUp,
  messageValidators,
  validateLogin,
  validateMemberForm,
  validateAdmin
}
