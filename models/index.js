const bookshelf = require('../bookshelf');

const Service = bookshelf.model('Service', {
    tableName: 'services'
});

module.exports = { Service };