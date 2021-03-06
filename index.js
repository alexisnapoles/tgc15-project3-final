const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const csrf = require('csurf');
const cors = require('cors');

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

app.use(cors());

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
    'secret': process.env.TOKEN_SECRET,
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

// app.use(csrf());

const csrfInstance = csrf();
app.use((req, res, next) => {
    if (req.url === '/checkout/process_payment' || req.url.slice(0,5) === '/api/') {
        return next();
    } else {
        csrfInstance(req, res, next);
    }
});

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

// API Routes
const api = {
    services: require('./routes/api/services'),
    users: require('./routes/api/users')
}

// Browser Routes
const landingRoutes = require('./routes/landing');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

async function main() {
    // endpoints for routes
    app.use('/', landingRoutes);
    app.use('/services', serviceRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary/', cloudinaryRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);

    // api routes
    app.use('/api/services', express.json(), api.services);
    app.use('/api/users', express.json(), api.users);
};
main();


const PORT = process.env.PORT || 3000
// const PORT = 3000
app.listen(PORT, () => {
    console.log(`Aye! Aye! Database has commenced in the best port! I love you ${PORT}!`);
});