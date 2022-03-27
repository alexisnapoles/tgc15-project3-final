const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

require('dotenv').config();

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: false
}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// For Flash messages
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// setting up session
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(flash())

// register flash middleware
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

// importing the routes
const landingRoutes = require('./routes/landing');
const serviceRoutes = require('./routes/services');

async function main() {
    // landing endpoint routes
    app.use('/', landingRoutes);

    // services routes
    app.use('/services', serviceRoutes);
};
main();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Aye! Aye! Database has commenced in the best port, i love you ${PORT}!`);
});