const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { User, BlacklistedToken } = require('../../models');
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
        let accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, '15m');
        let refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, "1h");
        res.json({
            'accessToken': accessToken,
            'refreshToken': refreshToken
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

router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    let result = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })

    if (result) {
        res.status(401);
        res.json({
            'message': 'Refresh token expired.'
        });
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let accessToken = generateToken(user, process.env.TOKEN_SECRET, '15m')
            res.json({
                'accessToken': accessToken
            })
        }
    });
});

router.post('/signout', async (req, res) => {
    let refreshToken = req.body.refreshToken;

    if(!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                res.sendStatus(403);
                return;
            } else {
                const token = new BlacklistedToken();
                token.set('token', refreshToken);
                token.set('date_created', new Date());

                await token.save();
                res.json({
                    'message': 'Logged out'
                })
            }
        });
    }
});

module.exports = router;

/**
 * jwt.sing({arg1}, arg2, {arg3});
 * arg1: information/data IN THE token
 * arg2: token secret
 * arg3: expiry
 */