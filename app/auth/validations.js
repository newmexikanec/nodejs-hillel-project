const {Joi} = require('celebrate');

async function createUserValidation (req, res, next) {
    try {
        const usersProvider = require("../service/usersDataProvider");
        const schema = Joi.object({
            username: Joi.string().trim().min(3).max(15).required()
                .label('Username')
                .external(async val => {
                    const exist = await usersProvider.getUserByName(val);
                    if (exist) {
                        throw new Error('This value is already exist');
                    }
                }),
            email: Joi.string().trim().email().required()
                .label('E-mail')
                .external(async val => {
                    const exist = await usersProvider.getUserByEmail(val);
                    if (exist) {
                        throw new Error('This value is already exist');
                    }
                }),
            birthdayDate: Joi.date().iso().required().label('Birthday'),
            password: Joi.string().min(6).max(15).required().label('Password'),
            repeatPassword: Joi.string().equal(Joi.ref('password')).required()
                .label('Confirm password')
                .options({messages: {'any.only': 'Field {{#label}} does not match'}}),
        });
        await schema.validateAsync(req.body);
        next();
    } catch (e) {
        res.status(400).render('registration', {
            title: 'Sign Up',
            errorMessage: e.message,
            ...req.body
        });
    }
}

async function loginUserValidation (req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().trim().email().required().label('E-mail'),
            password: Joi.string().min(6).max(15).required().label('Password')
        });
        await schema.validateAsync(req.body);
        next();
    } catch (e) {
        res.status(400).render('login', {
            title: 'Log In',
            errorMessage: e.message,
            ...req.body
        });
    }
}

module.exports = {
    createUserValidation,
    loginUserValidation
};
