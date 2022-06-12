const {User, Message, Chat} = require("../models");
const {userService, jwtService} = require('../services');
const jwtHook = require('../middlewares/jwt.middleware');
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
} = require("../validations");

class ApiController {
    name = 'api';

    constructor() {
        const Router = require("express");
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(`/${this.name}/login`, apiLoginUserValidation, this.login);
        this.router.post(`/${this.name}/signup`, apiCreateUserValidation, this.signup);

        this.router.get(`/${this.name}/users`, jwtHook, this.getUsers);
        this.router.get(`/${this.name}/users/:id`, jwtHook, userIDParamValidation, this.getUsersByID);
        this.router.put(`/${this.name}/users/:id`, jwtHook, userIDParamValidation, updateUserValidation, this.updateUserByID);
        this.router.delete(`/${this.name}/users/:id`, jwtHook, userIDParamValidation, this.deleteUserByID);

        this.router.get(`/${this.name}/chat/:id`, jwtHook, chatIDParamValidation, this.getChatByID);
        this.router.post(`/${this.name}/chat`, jwtHook, createChatValidation, this.createChat);
        this.router.put(`/${this.name}/chat/:id`, jwtHook, chatIDParamValidation, updateChatValidation, this.updateChatByID);
        this.router.delete(`/${this.name}/chat/:id`, jwtHook, chatIDParamValidation, this.deleteChatByID);

        this.router.get(`/${this.name}/message/:id`, jwtHook, chatIDParamValidation, this.getChatMessagesByChatID);
        this.router.post(`/${this.name}/message`, jwtHook, addMessageValidation, this.addMessage);
        this.router.put(`/${this.name}/message/:id`, jwtHook, messageIDParamValidation, updateMessageValidation, this.updateMessageByID);
        this.router.delete(`/${this.name}/message/:id`, jwtHook, messageIDParamValidation, this.deleteMessage);
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            const {id, username} = await userService.login(email, password);
            const token = jwtService.generateTocken({id, username, email});
            res.status(200).json({token});
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async signup(req, res) {
        try {
            const {username, email, birthdayDate, password} = req.body;
            await userService.signup({username, email, birthdayDate, password});
            res.status(201).json({message: 'Please check your email for account verification'});
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async getUsers(req, res) {
        try {
            res.status(200).json({'users': await userService.getChatList(req.user ? req.user.username : null)});
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async getUsersByID(req, res) {
        try {
            await User
                .findById(req.params.id)
                .exec()
                .then(user => {
                    if (user) {
                        const {username, email, birthdayDate, regDate} = user;
                        return res.status(200).json({username, email, birthdayDate, regDate});
                    }
                    throw new Error('User does not exist');
                });
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async updateUserByID(req, res) {
        try {
            await User.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async deleteUserByID(req, res) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async createChat(req, res) {
        try {
            const {createdBy, members, name} = req.body;
            if (!members.includes(createdBy)) {
                members.push(createdBy);
            }
            const message = new Chat({
                createdBy, members: [...new Set(members)], name
            });
            await message.save();
            res.status(201).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async getChatByID(req, res) {
        try {
            await Chat
                .findById(req.params.id)
                .exec()
                .then(chat => {
                    if (chat) return res.status(200).json(chat);
                    throw new Error('Chat does not exist');
                })
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async updateChatByID(req, res) {
        try {
            const {members, name} = req.body;
            if (!members && !name) {
                return res.status(200).end();
            }
            if (members) {
                const createdBy = await Chat.getChatCreatorIDByChatID(req.params.id);
                if (!members.includes(createdBy)) {
                    members.push(createdBy);
                }
            }
            await Chat.findByIdAndUpdate(req.params.id, {members, name});
            res.status(200).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async deleteChatByID(req, res) {
        try {
            await Chat.findByIdAndDelete(req.params.id);
            res.status(200).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async addMessage(req, res) {
        try {
            const message = new Message(req.body);
            await message.save();
            res.status(201).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async updateMessageByID(req, res) {
        try {
            const {text, isRead} = req.body;
            if (!text && !isRead) {
                return res.status(200).end();
            }
            await Message.findByIdAndUpdate(req.params.id, {text, isRead, editedDate: Date.now()});
            res.status(200).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async deleteMessage(req, res) {
        try {
            await Message.findByIdAndDelete(req.params.id);
            res.status(200).end();
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }

    async getChatMessagesByChatID(req, res) {
        try {
            const messages = await Message.find({chatID: req.params.id});
            res.status(200).json(messages);
        } catch (e) {
            res.status(400).json({errorMessage: e.message});
        }
    }
}

module.exports = new ApiController();
