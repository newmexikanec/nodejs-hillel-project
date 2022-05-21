const {createUserValidation, loginUserValidation} = require('./auth.validations');
const {accessValidation} = require('./chat.validations');
const {
    apiCreateUserValidation,
    apiLoginUserValidation,
    updateUserValidation,
    addMessageValidation,
    createChatValidation,
    updateChatValidation,
    updateMessageValidation,
    messageIDParamValidation,
    userIDParamValidation,
    chatIDParamValidation
} = require('./api.validations');

module.exports = {
    createUserValidation,
    loginUserValidation,
    apiCreateUserValidation,
    apiLoginUserValidation,
    accessValidation,
    updateUserValidation,
    addMessageValidation,
    createChatValidation,
    updateChatValidation,
    updateMessageValidation,
    messageIDParamValidation,
    userIDParamValidation,
    chatIDParamValidation
}
