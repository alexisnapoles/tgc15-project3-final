const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const csrf = require('csurf');

require('dotenv').config();

// For Flash messages
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    res.locals.date = new Date();
    next();
});

// setting up session
app.use(session({
    'store': new FileStore(),
    'secret': 'keyboard cat',
    'resave': false,
    'saveUninitialized': true
}));

app.use(flash())

// register flash middleware
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

app.use((req, res, next) => {
    res.locals.user = req.session.user
    next();
});

app.use(csrf());

app.use((err, req, res, next) => {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'Session has expired. Please try again.');
        res.redirect('back');
    } else {
        next();
    }
});

app.use((req, res, next) => {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
});

// importing the routes
const landingRoutes = require('./routes/landing');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');

async function main() {
    // endpoints for routes
    app.use('/', landingRoutes);
    app.use('/services', serviceRoutes);
    app.use('/users', userRoutes);
};
main();

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Aye! Aye! Database has commenced in the best port, i love you ${PORT}!`);
});