const {createUserValidation, loginUserValidation} = require('./auth.validations');
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
    updateUserValidation,
    addMessageValidation,
    createChatValidation,
    updateChatValidation,
    updateMessageValidation,
    messageIDParamValidation,
    userIDParamValidation,
    chatIDParamValidation
}
