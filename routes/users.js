const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const { User } = require('../models');
const { createSignupForm, createSigninForm, bootstrapField } = require('../forms');
const async = require('hbs/lib/async');

function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

router.get('/signup', (req, res) => {
    const form = createSignupForm();
    res.render('users/signup', {
        'form': form.toHTML(bootstrapField)
    });
});

router.post('/signup', (req, res) => {
    const signupForm = createSignupForm();

    signupForm.handle(req, {
        'success': async (form) => {
            const user = new User({
                'username': form.data.username,
                'email': form.data.email,
                'password': getHashedPassword(form.data.password)
            })

            await user.save();
            req.flash("success_messages", "Your account has been registered!");
            res.redirect('/users/signin')
        },
        'error': (form) => {
            res.render('users/signup', {
                'form': form.toHTML(bootstrapField)
            })
        }
    });
});

router.get('/signin', (req, res) => {
    const signinForm = createSigninForm();
    res.render('users/signin', {
        'form': signinForm.toHTML(bootstrapField)
    });
});

router.post('/signin', (req, res) => {
    const signinForm = createSigninForm();
    signinForm.handle(req, {
        'success': async (form) => {
            let user = await User.where({
                'username': form.data.username
            }).fetch({
                require: false
            });

            if (!user) {
                req.flash('error_messages', 'Sign in Failed. Authentication details incorrect.');
                res.redirect('/users/signin');
            } else {
                if (user.get('password') == getHashedPassword(form.data.password)) {
                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username')
                    },
                    req.flash('success_messages','Welcome! Successfully Signed in.');
                    res.redirect('/users/profile'); 

                } else {
                    req.flash('error_messages', 'Sign in Failed. Authentication details incorrect.');
                    res.redirect('/users/signin');
                }
            }
        }
    });
});

router.get('/profile', async (req, res) => {
    if (req.session.user) {
        const user = await User.where({
            'id': req.session.user.id
        }).fetch({
            require: true
        })

        res.render('users/profile', {
            'user': user.toJSON()
        })
    } else {
        req.flash('error_messages', 'Sign in required.');
        res.redirect('/users/signin');
    }
});

router.get('/signout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', 'See you next time!');
    res.redirect('/users/signin');
});

module.exports = router;