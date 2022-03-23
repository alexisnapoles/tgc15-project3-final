const {Service, Category} = require('../models')

async function getServiceById(serviceId) {
    const service = await Service.where({
        'id': serviceId
    }).fetch({
        'require': false,
        withRelated: ['categories']
    });
    return product;
}

async function getAllCategories() {
    const allCategories = await Category.fetchAll().map((category) => {
        return [ category.get('id'), category.get('name') ]
    });
    return allCategories;
}


async function createService(serviceData) {
    const newService = new Service();

    newService.set('name', serviceData.name);
    newService.set('category_id', serviceData.category_id);
    newService.set('cost_per_hour', serviceData.cost_per_hour);
    newService.set('min_hours', serviceData.min_hours);
    newService.set('description', serviceData.description);
    newService.set('rating', serviceData.rating);
    newService.set('date_of_posting', serviceData.date_of_posting);

    await newService.save();
    return newService;
}

module.exports = {
    getServiceById,
    getAllCategories,
    createService
}