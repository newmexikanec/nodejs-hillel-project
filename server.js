const express = require('express');
const config = require('config');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const {errors} = require('celebrate');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: config.get('sessionSecret'), resave: false, saveUninitialized: true, cookie: {maxAge: 600000}
}));

app.use('/assets', express.static(path.join('public', 'assets')));
app.use((req, res, next) => {
    res.locals = {loggedin: !!req.session.user};
    next();
});
app.use('/', require('./src/MainRouter'));

app.use(errors());

mongoose
    .connect(config.get('db.connectionString'))
    .then(() => {
        app.listen(config.get('http.port'), () => {
            console.log(`Server is running on http://${config.get('http.host')}:${config.get('http.port')}`);
        });
    })
    .catch(e => console.log('Connection error: ', e));
