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