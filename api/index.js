const express = require("express");
const session = require("express-session");
const addMessage = require('../middleware/addMessage'); // Update path
const passport = require('../middleware/passport'); // Custom passport configuration
const path = require("path");
const pgSession = require('connect-pg-simple')(session);
const router = require('../routes/router'); // Update path
const pool = require('../db/pool'); // Update path

const app = express();

// Set view engine
app.set("views", path.join(__dirname, "../views")); // Update path
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '../public'))); // Update path

// Session configuration with PostgreSQL store
app.use(session({
    secret: "cats", // Use a more secure secret in production
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true, // Automatically create the session table if it doesn't exist
    }),
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // Session valid for 30 days
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use the addMessage middleware
app.use(addMessage);

// Make the current user available globally in views
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Use router for handling routes
app.use(router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the app for Vercel's serverless functions
module.exports = app;
