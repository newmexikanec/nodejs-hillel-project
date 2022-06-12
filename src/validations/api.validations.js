const {celebrate, Joi, Segments} = require('celebrate');
const {getMongoIdSchema, getLoginSchema, getCreateUserSchema} = require('./global.joi');
const {User, Chat, Message} = require("../models");

const apiCreateUserValidation = celebrate({
    [Segments.BODY]: getCreateUserSchema()
});

const apiLoginUserValidation = celebrate({
    [Segments.BODY]: getLoginSchema()
});

const userIDParamValidation = celebrate({
    [Segments.PARAMS]: {
        id: getMongoIdSchema(User, 'User ID'),
    }
});

const chatIDParamValidation = celebrate({
    [Segments.PARAMS]: {
        id: getMongoIdSchema(Chat, 'Chat ID'),
    }
});

const messageIDParamValidation = celebrate({
    [Segments.PARAMS]: {
        id: getMongoIdSchema(Message, 'Message ID'),
    }
});

const updateUserValidation = celebrate({
    [Segments.BODY]: Joi.object({
        username: Joi.string().trim().min(3).max(15).label('Username'),
        birthdayDate: Joi.date().iso().label('Birthday'),
        password: Joi.string().min(6).max(15).when('repeatPassword', {
            is: Joi.exist(), then: Joi.required()
        }).label('Password'),
        repeatPassword: Joi.string().label('Confirm password')
    }).when(Joi.object({'password': Joi.exist()}).unknown(), {
        then: Joi.object({repeatPassword: Joi.required().equal(Joi.ref('password'))})
    }).when(Joi.object({'repeatPassword': Joi.exist()}).unknown(), {
        then: Joi.object({password: Joi.required()})
    })
});

const createChatValidation = celebrate({
    [Segments.BODY]: Joi.object({
        createdBy: getMongoIdSchema(User, 'Creator ID'),
        members: Joi.array().items(getMongoIdSchema(User, 'User ID')).required(),
        name: Joi.string().trim().min(3).label('Chat name')
    })
});

const updateChatValidation = celebrate({
    [Segments.BODY]: Joi.object({
        members: Joi.array().items(getMongoIdSchema(User, 'User ID')),
        name: Joi.string().trim().min(3).label('Chat name')
    })
});

const addMessageValidation = celebrate({
    [Segments.BODY]: Joi.object({
        chatID: getMongoIdSchema(Chat, 'Chat ID'),
        senderID: getMongoIdSchema(User, 'Sender ID'),
        text: Joi.string().trim().required().label('Text')
    })
});

const updateMessageValidation = celebrate({
    [Segments.BODY]: Joi.object({
        text: Joi.string().trim().label('Text'),
        isRead: Joi.boolean().label('Is read')
    })
});

module.exports = {
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
};
