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
    let newRequestedHours = req.body.new_requested_hours;
    const cartServices = new CartServices(req.session.user.id);
    await cartServices.updateRequestedHours(req.param.service_id, newRequestedHours);

    req.flash('success_messages', 'Requested number of hours has been updated');
    res.redirect('/cart/');
});

module.exports = router;