const bookshelf = require('../bookshelf');

const Service = bookshelf.model('Service', {
    tableName: 'services',

    categories() {
        return this.belongsTo('Category');
    }
});

const Category = bookshelf.model('Category', {
    tableName: 'categories',

    services() {
        return this.hasMany('Service');
    }
});

module.exports = { Service, Category };