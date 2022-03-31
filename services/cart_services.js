const cartDataLayer = require('../dal/cart_items');
const { CartItem } = require('../models');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }

    async getAllCartItems() {
        const allCartItems = await cartDataLayer.getCartItems(this.user_id);
        return allCartItems;
    }

    async addToCart(serviceId, requested_hours) {
        // check whether the user has added service to the shoppingcart
        let itemInCart = await cartDataLayer.getCartItemsByUserAndService(this.user_id, serviceId);
        if (itemInCart) {
            cartDataLayer.updateCartItem(this.user_id, serviceId, itemInCart.get('requested_hours') + requested_hours)
        } else {
            await cartDataLayer.newCartItem(this.user_id, serviceId, requested_hours);
        }
        return itemInCart;
    }

    async updateRequestedHours(serviceId, new_rquested_hours) {
        let status = await cartDataLayer.updateCartItem(this.user_id, serviceId, new_rquested_hours);
        return status;
    }

    async removeItem(serviceId) {
        return await cartDataLayer.removeFromCart(this.user_id, serviceId);
    }
};

module.exports = CartServices