const forms = require("forms");

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function(name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = []; 
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';
    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createServiceForm = (categories) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
        }),
        'category_id': fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: categories
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
        }),
        'rating': fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'cost_per_hour': fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'min_hours': fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'date_of_posting': fields.date({
            required: true,
            errorAfterField: true,
        }),   
    })
};

const createSearchForm = function(allCategories) {
    return forms.create({
        'name': fields.string({
            required: false,
        }),
        'cost_per_hour': fields.number({
            required: false,
            validators: [validators.integer(), validators.min(0)]
        }),
        'min_hours': fields.number({
            required: false,
            validators: [validators.integer(), validators.min(0)]
        }),
        'description': fields.string({
            required: false,
        }),
        'rating': fields.number({
            required: false,
            validators: [validators.integer(), validators.min(0)]
        }),
        'date_of_posting': fields.date({
            required: false,
        }),
        'category_id': fields.string({
            label: 'Category',
            required: false,
            widget: widgets.select(),
            choices: allCategories,
        })
    })
}

module.exports = { 
    bootstrapField, 
    createServiceForm,
    createSearchForm
}