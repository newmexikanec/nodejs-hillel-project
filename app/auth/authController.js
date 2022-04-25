const usersProvider = require("../service/usersDataProvider");
const bcrypt = require('bcryptjs');

class AuthController {
    async signup(req, res) {
        res.render('registration', {
            title: 'Sign Up',
            errorMessage: '',
            username: '',
            birthdayDate: '',
            email: ''
        });
    }

    async registration(req, res) {
        try {
            const {username, email, birthdayDate, password} = req.body;
            const newItem = await usersProvider.createNewUser({
                username,
                email,
                birthdayDate,
                password: bcrypt.hashSync(password, 7)
            });
            if (newItem) {
                res.cookie('loggedin', true, {httpOnly: true, maxAge: 600000});
                req.session.user = newItem;
                res.redirect('/');
            }
        } catch (e) {
            res.status(400).render('registration', {
                title: 'Sign Up',
                errorMessage: e.message,
                ...req.body
            });
        }
    }

    async loginPage(req, res) {
        res.render('login', {
            title: 'Log In',
            email: '',
            errorMessage: ''
        });
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            const user = await usersProvider.getUserByEmail(email);
            if (!user) {
                throw new Error('E-mail address is incorrect');
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                throw new Error('Password is incorrect');
            }
            res.cookie('loggedin', true, {httpOnly: true, maxAge: 600000});
            req.session.user = user;
            res.redirect('/');
        } catch (e) {
            res.status(400).render('login', {
                title: 'Log In',
                errorMessage: e.message,
                ...req.body
            });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('loggedin');
            req.session.destroy();
            res.redirect('/');
        } catch (e) {
            res.status(400).json({message: e});
        }
    }
}

module.exports = new AuthController();
