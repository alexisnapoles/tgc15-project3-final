const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

require('dotenv').config();

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

async function main() {
    app.get('/', (req, res) => {
        res.send('HA HA HA! Restart pt2 now you use template. Awesome job, reading properly! Keep going!')
    });
};
main();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Aye! Aye! Database has commenced!');
});