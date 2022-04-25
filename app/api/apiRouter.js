const Router = require('express');
const router = new Router();
const controller = require('./apiController');
const {
    loginUserValidation,
    signupUserValidation,
    usersParamValidation,
    updateUserValidation,
    chatsParamValidation,
    createChatValidation,
    updateChatValidation
} = require('./validations');

router.post('/login', loginUserValidation, controller.login);
router.post('/signup', signupUserValidation, controller.signup);

router.get('/users', controller.getUsers);
router.get('/users/:id', usersParamValidation, controller.getUsersByID);
router.post('/users', signupUserValidation, controller.createUser);
router.put('/users/:id', usersParamValidation, updateUserValidation, controller.updateUser);
router.delete('/users/:id', usersParamValidation, controller.deleteUser);

router.get('/chats', controller.getChats);
router.get('/chats/:id', chatsParamValidation, controller.getChatByID);
router.post('/chats', createChatValidation, controller.createChatMessage);
router.put('/chats/:id', usersParamValidation, updateChatValidation, controller.updateChatMessage);
router.delete('/chats/:id', chatsParamValidation, controller.deleteChat);

module.exports = router;
