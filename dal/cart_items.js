const {
    CartItem
} = require('../models');

const getCartItems = async function(userId) {
    let itemsInCart = await CartItem.collection()
        .where({
            'user_id': userId
        }).fetch({
            // false value because it's possible that a user will not have anything in shopping cart
            'require': false,
            'withRelated': ['service', 'service.category']
        })
    return itemsInCart;
};

const getCartItemsByUserAndService = async function(userId, serviceId) {
    const itemInCart = await CartItem.where({
        'user_id': userId,
        'service_id': serviceId
    }).fetch({
        'require': false,
        'withRelated': ['service', 'service.category']
    })
    return itemInCart;
};

const newCartItem = async function(userId, serviceId, requested_hours) {
    const itemInCart = new CartItem({
        'user_id': userId,
        'service_id': serviceId,
        'requested_hours': requested_hours
    })
    await itemInCart.save();
    return itemInCart;
};

const updateCartItem = async function(userId, serviceId, newNumberOfHours) {
    let itemInCart = await getCartItemsByUserAndService(userId, serviceId);
    if (itemInCart) {
        itemInCart.set('requested_hours', newNumberOfHours);
        await itemInCart.save();
        return true;
    }
    return false;
};

const removeFromCart = async function(userId, serviceId) {
    let itemInCart = await getCartItemsByUserAndService(userId, serviceId);
    if (itemInCart) {
        await itemInCart.destroy();
        return true;
    }
    return false;
};

module.exports = {
    getCartItems,
    getCartItemsByUserAndService,
    newCartItem,
    updateCartItem,
    removeFromCart
};