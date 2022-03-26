const express = require('express');
const async = require('hbs/lib/async');
const router = express.Router();

const {
    Service,
    Category
} = require('../models');
const {
    bootstrapField,
    createServiceForm,
    createSearchForm
} = require('../forms');

const serviceDataLayer = require('../dal/services');

router.get('/', async (req, res) => {
    const allCategories = await serviceDataLayer.getAllCategories();
    allCategories.unshift([0, "N/A"]);

    const searchForm = createSearchForm(allCategories);
    let query = Service.collection();

    searchForm.handle(req, {
        'empty': async function (form) {
            let services = await query.fetch({
                withRelated: ['category']
            })
            res.render('services/index', {
                'services': services.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            });
        },
        'success': async function (form) {
            if (form.data.name) {
                query.where('name', 'like', '%' + req.query.name + '%');
            }

            if (form.data.category_id && form.data.category_id != "0") {
                query.where('category_id', '=', form.data.category_id)
            }

            if (form.data.cost_per_hour) {
                query.where('cost_per_hour', '>=', form.data.cost_per_hour)
            }

            let services = await query.fetch({
                withRelated: ['category']
            })
            res.render('services/index', {
                'services': services.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'error': async () => {
            res.render('services/index')
        }
    })

});

router.get('/create', async (req, res) => {

    const allCategories = await serviceDataLayer.getAllCategories();

    const serviceForm = createServiceForm(allCategories);

    res.render('services/create', {
        'form': serviceForm.toHTML(bootstrapField)
    });
});

router.post('/create', async (req, res) => {

    const allCategories = await serviceDataLayer.getAllCategories();

    const servicesForm = createServiceForm(allCategories);
    servicesForm.handle(req, {
        'success': async (form) => {
            // console.log(form.data);
            const newService = await serviceDataLayer.createService(form.data)

            if (form.data.categories) {
                let selectedCategory = form.data.categories.split(',');
                await newService.tags().attach(selectedCategory);
            }
            res.redirect('/services');
        },
        'error': async (form) => {
            res.render('services/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    });
});


router.get('/:service_id/update', async (req, res) => {
    const allCategories = await serviceDataLayer.getAllCategories();

    const serviceId = req.params.service_id;
    const service = await serviceDataLayer.getServiceById(serviceId);

    const serviceForm = createServiceForm(allCategories);
    serviceForm.fields.name.value = service.get('name');
    serviceForm.fields.category_id.value = service.get('category_id');
    serviceForm.fields.cost_per_hour.value = service.get('cost_per_hour');
    serviceForm.fields.min_hours.value = service.get('min_hours');
    serviceForm.fields.description.value = service.get('description');
    serviceForm.fields.rating.value = service.get('rating');

    // const selectedCategory = await service.related('categories').pluck('id');
    // serviceForm.fields.category_id.value = selectedCategory

    res.render('services/update', {
        'form': serviceForm.toHTML(bootstrapField),
        'service': service.toJSON()
    })
});

router.post('/:service_id/update', async (req, res) => {
    const service = await serviceDataLayer.getServiceById(req.params.service_id);
    const allCategories = await serviceDataLayer.getAllCategories();

    const serviceForm = createSearchForm(allCategories);
    serviceForm.handle(req, {
        'success': async function (form) {
            service.set('name', form.data.name);
            service.set('cost_per_hour', form.data.cost_per_hour);
            service.set('min_hours', form.data.min_hours);
            service.set('description', form.data.description);
            service.set('rating', form.data.rating);
            service.set('date_of_posting', form.data.date_of_posting);
            service.set('category_id', form.data.category_id);

            await service.save();

            res.redirect('/services');
        },
        'error': function () {
           
        }
    })
});

router.get('/:service_id/delete', async (req, res) => {
    const service = await serviceDataLayer.getServiceById(req.params.service_id);
    res.render('services/delete', {
        'service': service.toJSON()
    })
});

router.post('/:service_id/delete', async (req, res) => {
    const service = await serviceDataLayer.getServiceById(req.params.service_id);
    await service.destroy();
    res.redirect('/services');
});

module.exports = router;