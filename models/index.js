const bookshelf = require('../bookshelf');

const Service = bookshelf.model('Service', {
    tableName: 'services',
    category() {
        return this.belongsTo('Category');
    }
});

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    services() {
        return this.hasMany('Service', 'category_id');
    }
});

const User = bookshelf.model('User', {
    tableName: 'users'
});

module.exports = {
    Service,
    Category,
    User
};