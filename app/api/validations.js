const {celebrate, Joi, Segments} = require('celebrate');
const usersProvider = require("../service/usersDataProvider");

async function loginUserValidation(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().trim().email().required().label('E-mail'),
            password: Joi.string().min(6).max(15).required().label('Password')
        });
        await schema.validateAsync(req.body);

        const bcrypt = require("bcryptjs");
        const {email, password} = req.body;
        const user = await usersProvider.getUserByEmail(email);
        if (!user) {
            throw new Error('E-mail address is incorrect');
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            throw new Error('Password is incorrect');
        }
        next();
    } catch (e) {
        res.status(400).json({errorMessage: e.message});
    }
}

async function signupUserValidation(req, res, next) {
    try {
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
        res.status(400).json({errorMessage: e.message});
    }
}

const usersParamValidation = celebrate({
    [Segments.PARAMS]: {
        id: Joi.number().required()
    }
});

const updateUserValidation = celebrate({
    [Segments.BODY]: Joi.object({
        id: Joi.number().required(),
        username: Joi.string().trim().min(3).max(15).required().label('Username'),
        email: Joi.string().trim().email().required().label('E-mail'),
        birthdayDate: Joi.date().iso().required().label('Birthday'),
        password: Joi.string().min(6).max(15).required().label('Password'),
        repeatPassword: Joi.string().equal(Joi.ref('password')).required().label('Confirm password')
            .options({messages: {'any.only': 'Field {{#label}} does not match'}}),
    })
});

const chatsParamValidation = celebrate({
    [Segments.PARAMS]: {
        id: Joi.number().required()
    }
});

const createChatValidation = celebrate({
    [Segments.BODY]: Joi.object({
        userID: Joi.number().required(),
        date: Joi.date().iso().required(),
        message: Joi.string().trim().required()
    })
});

const updateChatValidation = celebrate({
    [Segments.BODY]: Joi.object({
        id: Joi.number().required(),
        userID: Joi.number().required(),
        date: Joi.date().iso().required(),
        message: Joi.string().trim().required()
    })
});

module.exports = {
    signupUserValidation,
    loginUserValidation,
    usersParamValidation,
    updateUserValidation,
    chatsParamValidation,
    createChatValidation,
    updateChatValidation
};
