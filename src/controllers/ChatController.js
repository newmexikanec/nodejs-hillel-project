const {User} = require('../models');
const {accessValidation} = require("../validations");

class ChatController {
    name = 'chat';

    constructor() {
        const Router = require("express");
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', this.chatList);
        this.router.get(`/${this.name}`, this.chatList);
        this.router.get(`/${this.name}/:id`, accessValidation, this.chat);
    }

    async chatList(req, res) {
        let users = await User.find();
        let username = '';
        if (req.session.user) {
            username = req.session.user.username;
            users = users.filter(user => user.username !== username);
        }

        res.render('users', {
            title: 'Users', users: users, loggedin: !!username, headerUserName: username
        });
    }

    async chat(req, res) {
        try {
            res.send(`user ${req.params.id}`);
        } catch (e) {
            res.status(400).send(e.message);
        }
    }
}

module.exports = new ChatController();
