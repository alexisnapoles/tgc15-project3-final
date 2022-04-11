const jwt = require('jsonwebtoken');

const checkAuthentication = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error_messages', 'Sign in required.');
        res.redirect('/users/signin');
    }
};

const checkJWTAuthentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, function(err, user) {
            if (err) { 
                res.status('401').json({
                    'message': 'Forbidden'
                })
            } else {
                req.user = user;
                next();
            }
        })
    } else {
        // !authHeader === invalid || not allowed
        res.status(401).json({
            'message': 'Forbidden'
        });
    }
};

module.exports = { checkAuthentication, checkJWTAuthentication };