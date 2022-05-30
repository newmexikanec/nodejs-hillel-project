const {userService} = require("../services");

class VerifyController {
    name = 'verify';

    constructor() {
        const Router = require("express");
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`/${this.name}/send/:verifyingKey`, this.checkVerifyKey);
        this.router.get(`/${this.name}/sendverifykeymessage`, this.sendVerifyKeyMessage);
    }

    async checkVerifyKey(req, res) {
        try {
            const {userService} = require('../services');
            const {verifyingKey} = req.params;
            const user = await userService.verify(verifyingKey);
            res.send(`User ${user.username} was verified`);
        } catch (e) {
            res.status(400).send(e.message);
        }
    }

    async sendVerifyKeyMessage(req, res) {
        res.render('verifymessage', {
            title: 'Verification', message: 'Please check your email for account verification'
        });
    }
}

module.exports = new VerifyController();
