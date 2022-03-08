const knex = require('knex')({
    "client": process.env.DB_DRIVER,
    "connection": {
        "user": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_DB
    }
})

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;