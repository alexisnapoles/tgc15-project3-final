const express = require('express');
const async = require('hbs/lib/async');
const router = express.Router();

const { Service } = require('../models');
const { bootstrapField, createServiceForm } = require('../forms');

router.get('/', async (req, res) => {
    let services = await Service.collection().fetch();
    res.render('services/index', {
        'services': services.toJSON()
    });
});

router.get('/create', async (req, res) => {
    const servicesForm = createServiceForm();
    res.render('services/create', {
        'form': servicesForm.toHTML(bootstrapField)
    });
});

router.post('/create', async (req, res) => {
    const servicesForm = createServiceForm();
    servicesForm.handle(req, {
        'success': async(form) => {
            const service = new Service();
            service.set('name', form.data.name);
            service.set('cost_per_hour', form.data.cost_per_hour);
            service.set('min_hours', form.data.min_hours);
            service.set('description', form.data.description);
            service.set('rating', form.data.rating);
            service.set('date_of_posting', form.data.date_of_posting);
            service.set('thumbnail', form.data.thumbnail);

            await service.save();
            res.redirect('/services');
        }
    });
});

module.exports = router;