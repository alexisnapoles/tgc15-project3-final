// const parse = require('pg-connection-string').parse;
// const pgconfig = parse(process.env.DATABASE_URL);
// pgconfig.ssl = {
//     rejectUnauthorized: false
// };

const knex = require('knex')({
    "client": process.env.DB_DRIVER,
    "connection": {
         "user": process.env.DB_USER,
         "password": process.env.DB_PASS,
         "database": process.env.DB_DB,
         "host": process.env.DB_HOST,
         "ssl": {
            'rejectUnauthorized': false
         }
     }
     // pgconfig
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;