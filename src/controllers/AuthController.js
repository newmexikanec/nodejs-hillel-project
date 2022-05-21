const {User} = require('../models');
const bcrypt = require("bcryptjs");
const {createUserValidation, loginUserValidation} = require("../validations");

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
        res.render('registration', {
            title: 'Sign Up', errorMessage: '', username: '', birthdayDate: '', email: ''
        });
    }

    async registration(req, res) {
        try {
            const {username, email, birthdayDate, password} = req.body;
            const userData = {
                username, email, birthdayDate, password: bcrypt.hashSync(password, 7)
            };
            const user = new User(userData);
            await user.save().then(() => {
                req.session.user = userData;
                res.redirect('/');
            });
        } catch (e) {
            res.status(400).render('registration', {
                title: 'Sign Up', errorMessage: e.message, ...req.body
            });
        }
    }

    async loginPage(req, res) {
        res.render('login', {
            title: 'Log In', email: '', errorMessage: ''
        });
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            await User
                .findOne({email})
                .then(user => {
                    if (!user) {
                        throw new Error('E-mail address is incorrect');
                    }
                    const validPassword = bcrypt.compareSync(password, user.password);
                    if (!validPassword) {
                        throw new Error('Password is incorrect');
                    }
                    req.session.user = user;
                    res.redirect('/');
                });
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
