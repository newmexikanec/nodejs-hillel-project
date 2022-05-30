const {Joi} = require("celebrate");

function getMongoIdSchema(model, label) {
    return Joi.string().pattern(new RegExp(/^[0-9a-fA-F]{24}$/)).required().label(label)
        .options({messages: {'string.pattern.base': '{{#label}} is not correct'}});
}

function getLoginSchema() {
    return Joi.object({
        email: Joi.string().trim().email().required().label('E-mail'),
        password: Joi.string().min(6).max(15).required().label('Password')
    });
}

function getCreateUserSchema() {
    return Joi.object({
        username: Joi.string().trim().min(3).max(15).required().label('Username'),
        email: Joi.string().trim().email().required().label('E-mail'),
        birthdayDate: Joi.date().iso().label('Birthday'),
        password: Joi.string().min(6).max(15).required().label('Password'),
        repeatPassword: Joi.string().equal(Joi.ref('password')).required()
            .label('Confirm password')
            .options({messages: {'any.only': 'Field {{#label}} does not match'}})
    });
}

module.exports = {
    getMongoIdSchema,
    getLoginSchema,
    getCreateUserSchema
};
