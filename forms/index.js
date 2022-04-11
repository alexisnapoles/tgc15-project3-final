const forms = require("forms");

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
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
        'image_url': fields.string({
            widget: widgets.hidden()
        }),
        'date_of_posting': fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.date(),
            validators: [validators.date()]
        }),
    })
};

const createSearchForm = function (allCategories) {
    return forms.create({
        'name': fields.string({
            required: false,
            errorAfterField: true
        }),
        'cost_per_hour': fields.number({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'rating': fields.number({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'category_id': fields.string({
            label: 'Category',
            required: false,
            widget: widgets.select(),
            choices: allCategories,
        })
    })
};


const createSignupForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.password()
        }),
        'confirm_password': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.password(),
            validators: [validators.matchField('password')]
        }),
        'date_registered': fields.date({
            required: true,
            errorAfterField: true,
            widget: widgets.date(),
            validators: [validators.date()]
        })
    });
};

const createSigninForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.password()
        })
    });
};

module.exports = {
    bootstrapField,
    createServiceForm,
    createSearchForm,
    createSignupForm,
    createSigninForm
};