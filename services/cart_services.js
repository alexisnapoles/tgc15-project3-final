const cartDataLayer = require('../dal/cart_items');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getAllCartItems() {
        const allCartItems = await cartDataLayer.getCartItems(this.user_id);
        return allCartItems;
    }

    async addToCart(serviceId, requested_hours) {
        let itemInCart = await cartDataLayer.getCartItemsByUserAndService(this.user_id, serviceId);
        if (itemInCart) {
            cartDataLayer.updateCartItem(this.user_id, serviceId, itemInCart.get('requested_hours') + requested_hours)
        } else {
            await cartDataLayer.newCartItem(this.user_id, serviceId, requested_hours);
        }
        return itemInCart;
    }

    async updateRequestedHours(serviceId, newNumberOfHours) {
        let status = await cartDataLayer.updateCartItem(this.user_id, serviceId, newNumberOfHours);
        return status;
    }

    async removeItem(serviceId) {
        return await cartDataLayer.removeFromCart(this.user_id, serviceId);
    }
};

module.exports = CartServices;