const express = require('express');
const config = require('config');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {errors} = require('celebrate');
const authRouter = require('./app/auth/authRouter');
const userRouter = require('./app/user/userRouter');
const apiRouter = require('./app/api/apiRouter');
const itemsProvider = require('./app/service/usersDataProvider');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.get('cookieSecret')));
app.use(session({
    secret: config.get('sessionSecret'),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));

app.use('/assets', express.static(path.join('public', 'assets')));
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);

app.use(errors());

app.get('/', async (req, res) => {
    let username = '';

    if (req.session.user) {
        username = req.session.user.username;
    }
    res.render('users',{
        title: 'Users',
        users: await itemsProvider.getUsers(),
        loggedin: req.cookies.loggedin,
        headerUserName: username
    });
});

app.listen(config.get('server.port'), () => {
    console.log(`Server is running on http://localhost:${config.get('server.port')}`);
});
