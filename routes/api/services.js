const express = require('express');
const router = express.Router();
const { createServiceForm } = require('../../forms');

const serviceDataLayer = require('../../dal/services');
const { Service } = require('../../models');
const { checkJWTAuthentication } = require('../../middlewares');
const async = require('hbs/lib/async');

router.get('/', async (req, res) => {
    const allServices = await serviceDataLayer.getAllServices();
    res.json(allServices);
});

router.post('/', checkJWTAuthentication, async (req, res) => {
    const allCategories = await serviceDataLayer.getAllCategories();
    const serviceForm = createServiceForm(allCategories);

    serviceForm.handle(req, {
        'success': async (form) => {
            let { ...serviceData } = form.data;
            const service = new Service(serviceData);
            await service.save();

            res.json(service);
        },

        'error': async (form) => {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            }
            res.json(errors);
        }
    })
});


module.exports = router;