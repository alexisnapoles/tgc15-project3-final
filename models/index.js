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
    tableName: 'users',
    cartItems() {
        return this.hasMany('CartItem');
    }
});

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    service() {
        return this.belongsTo('Service')
    }
});

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'token_blacklists'
});

module.exports = {
    Service,
    Category,
    User,
    CartItem,
    BlacklistedToken
};