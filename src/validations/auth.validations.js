const {getLoginSchema, getCreateUserSchema} = require('./global.joi');

async function createUserValidation(req, res, next) {
    try {
        await getCreateUserSchema().validateAsync(req.body);
        next();
    } catch (e) {
        res.status(400).render('registration', {
            title: 'Sign Up',
            errorMessage: e.message,
            ...req.body
        });
    }
}

async function loginUserValidation(req, res, next) {
    try {
        await getLoginSchema().validateAsync(req.body);
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
