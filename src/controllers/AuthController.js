const {createUserValidation, loginUserValidation} = require("../validations");
const {userService} = require('../services');

class AuthController {
    name = 'auth';

    constructor() {
        const Router = require("express");
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`/${this.name}/signup`, this.signup);
        this.router.get(`/${this.name}/login`, this.loginPage);
        this.router.get(`/${this.name}/logout`, this.logout);
        this.router.post(`/${this.name}/signup`, createUserValidation, this.registration);
        this.router.post(`/${this.name}/login`, loginUserValidation, this.login);
    }

    async signup(req, res) {
        if (res.locals.loggedin) {
            res.redirect('/');
        } else {
            res.render('registration', {
                title: 'Sign Up', errorMessage: '', username: '', birthdayDate: '', email: ''
            });
        }
    }

    async registration(req, res) {
        try {
            const {username, email, birthdayDate, password} = req.body;
            await userService.signup({
                username, email, birthdayDate, password
            });
            res.redirect('/verify/sendverifykeymessage');
        } catch (e) {
            res.status(400).render('registration', {
                title: 'Sign Up', errorMessage: e.message, ...req.body
            });
        }
    }

    async loginPage(req, res) {
        if (res.locals.loggedin) {
            res.redirect('/');
        } else {
            res.render('login', {
                title: 'Log In', email: '', errorMessage: ''
            });
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            req.session.user = await userService.login(email, password);
            res.redirect('/');
        } catch (e) {
            res.status(400).render('login', {
                title: 'Log In', errorMessage: e.message, ...req.body
            });
        }
    }

    async logout(req, res) {
        try {
            req.session.destroy();
            res.redirect('/');
        } catch (e) {
            res.status(400).json({message: e});
        }
    }
}

module.exports = new AuthController();
