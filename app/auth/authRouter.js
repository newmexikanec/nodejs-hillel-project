const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {createUserValidation, loginUserValidation} = require('./validations');

router.get('/signup', controller.signup);
router.get('/login', controller.loginPage);
router.get('/logout', controller.logout);
router.post('/signup', createUserValidation, controller.registration);
router.post('/login', loginUserValidation, controller.login);

module.exports = router;
