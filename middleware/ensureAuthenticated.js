function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    }
    res.redirect('/login'); // If not authenticated, redirect to the login page
}

module.exports = ensureAuthenticated;
