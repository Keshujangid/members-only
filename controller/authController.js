const passport = require('../middleware/passport')

const passportAuth = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        console.log('message',info.message)
        if (!user) {
            req.addMessage('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.addMessage('success', 'Welcome back!');
            return res.redirect('/');
        });
    })(req, res, next);
}



module.exports = passportAuth;