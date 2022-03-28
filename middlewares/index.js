const checkAuthentication = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error_messages', 'Sign in required.');
        res.redirect('/users/signin');
    }
};

module.exports = { checkAuthentication };