const {Joi} = require("celebrate");
const {User} = require("../models");

function getMongoIdSchema(model, label) {
    return Joi.string().pattern(new RegExp(/^[0-9a-fA-F]{24}$/)).required().label(label)
        .external(async id => {
            await model
                .findById(id)
                .then(user => {
                    if (!user) {
                        throw new Error(`${label} does not exist`);
                    }
                })
        })
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
        username: Joi.string().trim().min(3).max(15).required()
            .label('Username')
            .external(val => isAlreadyEx({username: val})),
        email: Joi.string().trim().email().required()
            .label('E-mail')
            .external(val => isAlreadyEx({email: val})),
        birthdayDate: Joi.date().iso().required().label('Birthday'),
        password: Joi.string().min(6).max(15).required().label('Password'),
        repeatPassword: Joi.string().equal(Joi.ref('password')).required()
            .label('Confirm password')
            .options({messages: {'any.only': 'Field {{#label}} does not match'}})
    });
}

async function isAlreadyEx(obj) {
    await User
        .exists(obj)
        .then(exist => {
            if (exist) {
                throw new Error('This value is already exist')
            }
        });
}

module.exports = {
    getMongoIdSchema,
    getLoginSchema,
    getCreateUserSchema
};
