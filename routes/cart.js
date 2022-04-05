const express = require('express');
const async = require('hbs/lib/async');
const f = require('session-file-store');
const { checkAuthentication } = require('../middlewares');
const router = express.Router();

const CartServices = require('../services/cart_services');

router.get('/', checkAuthentication, async (req, res) => {
    let userId = req.session.user.id;
    const cartServices = new CartServices(userId);
    const allCartItems = await cartServices.getAllCartItems();
    // res.send(allCartItems);
    res.render('cart/index', {
        'cartItems': allCartItems.toJSON()
    });
});

router.get('/:service_id/add', checkAuthentication, async (req, res) => {
    let userId = req.session.user.id;
    let serviceId = req.params.service_id;
    let requested_hours = 1;

    let cartServices = new CartServices(userId);
    await cartServices.addToCart(serviceId, requested_hours);

    req.flash('success_messages', 'Product has been added to cart');
    res.redirect('/cart/');
});

router.post('/:service_id/update', checkAuthentication, async (req, res) => {
    let newRequestedHours = req.body.newNumberOfHours;
    let userId = req.session.user.id;

    const cartServices = new CartServices(userId);
    await cartServices.updateRequestedHours(req.params.service_id, newRequestedHours);

    req.flash('success_messages', 'Number of hours updated.');
    res.redirect('/cart/');
});

router.get('/:service_id/remove', async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.removeItem(req.params.service_id);

    req.flash('success_messages', 'Item removed');
    res.redirect('/cart/');
});

module.exports = router;