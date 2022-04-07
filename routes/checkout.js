const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {
    const cart = new CartServices(req.session.user.id);

    const itemsInCart = await cart.getAllCartItems();
    
    // line item is an item user has to pay for
    const lineItems = [];
    const meta = [];
    for (let item of itemsInCart) {
        const lineItem = {
            'name': item.related('service').get('name'),
            'amount': item.related('service').get('cost_per_hour'),
            'quantity': item.get('requested_hours'),
            'currency': 'SGD'
        }
        // console.log(lineItem);
        if(item.related('service').get('image_url')) {
            lineItem['images'] = [item.related('service').get('image_url')];
        }
        lineItems.push(lineItem);
        // for each service how many hours was requested
        meta.push({
            'service_id': item.get('service_id'),
            'quantity': item.get('requested_hours')
        })
    }
    // res.json(meta);
    // #2 creating stripe payment
    // converting array into json file
    let metaData = JSON.stringify(meta);
    // res.send(metaData);
    const payment = {
        'payment_method_types': ['card'],
        'line_items': lineItems,
        'success_url': 'https://www.google.com/',
        'cancel_url': 'https://www.facebook.com/',
        'metadata': {
            'orders': metaData
        }
    }
    // #3  get session id from stripes
    const stripeSession = await Stripe.checkout.sessions.create(payment);
    // res.json(stripeSession);
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
});

router.get('/success/:sessionId', (req, res) => {
    console.log(req.params.sessionId);
    res.render('checkout/success');
});

router.get('/cancel', (req, res) => {
    res.render('checkout/cancel')
});

router.post('/process_payment', express.raw({
    'type': 'application/json'
}), (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    } catch(err) {
        res.send({
            'error': err.message
        })
        console.log(err);
    }

    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;
        console.log(stripeSession);

        let orders = JSON.parse(stripeSession.metadata.orders);
        console.log(orders);
    }
    res.send({
        'received': true
    });
});

module.exports = router;