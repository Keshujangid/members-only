const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../db/pool'); // Assuming you have a database connection set up in `db.js`

// Configure the Local Strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'username', 
        passwordField: 'password',
    },
    async (username, password, done) => {
        try {
            // Fetch user from the database
            const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            // Compare the password using bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            console.log('user', user)
            // User authenticated successfully
            return done(null, user , { message: 'Welcome back!' });
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize user to store user ID in session
passport.serializeUser((user, done) => {
    done(null, user.id); // Save user ID to session
});

// Deserialize user to retrieve full user data from session ID
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
