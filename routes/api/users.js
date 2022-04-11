const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { User } = require('../../models');
const { checkJWTAuthentication } = require('../../middlewares');

const generateToken = function(user, secret, expiresIn) {
    // customize secret and duration of expiry of the token
    const token = jwt.sign({
        'id': user.id,
        'email': user.email,
        'username': user.username
    }, secret , {
        'expiresIn': expiresIn
    });
    return token;
};

function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

router.post('/signin', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let user = await User.where({
        'username': username
    }).fetch({
        'require': false
    })

    if (user && user.get('password') == getHashedPassword(password)) {
        let accessToken = generateToken(user, process.env.TOKEN_SECRET, '1h');
        res.json({
            'accessToken': accessToken
        })
    } else {
        res.statusCode = 401;
        res.send({
            'error': 'You entered invalid credentials.'
        })
    }
});

router.get('/profile', checkJWTAuthentication, (req, res) => {
    res.json({
        'username': req.user.username,
        'email': req.user.email
    })
});

module.exports = router;

/**
 * jwt.sing({arg1}, arg2, {arg3});
 * arg1: information/data IN THE token
 * arg2: token secret
 * arg3: expiry
 */