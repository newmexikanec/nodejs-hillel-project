const express = require('express');
const config = require('config');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const {errors} = require('celebrate');
// const RedisStore = require("connect-redis")(session);
// const {createClient} = require("redis");
const MongoStore = require('connect-mongo');
const cors = require('cors');

(async () => {
    try {
        const app = express();

        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, 'views'));
        app.set('trust proxy', 1);

        // const redisClient = createClient({
        //     legacyMode: true, url: 'redis://redis'
        // });
        // await redisClient.connect();

        app.use(session({
            // store: new RedisStore({client: redisClient}),
            store: MongoStore.create({mongoUrl: config.get('db.connectionString')}),
            secret: config.get('session.secret'),
            resave: false,
            saveUninitialized: true
        }));
        app.use(express.json());
        app.use(cors());
        app.use(express.urlencoded({extended: true}));
        app.use('/assets', express.static(path.join('public', 'assets')));
        app.use((req, res, next) => {
            res.locals = {loggedin: !!req.session.user};
            next();
        });
        app.use('/', require('./src/MainRouter'));
        app.use(errors());

        await mongoose.connect(config.get('db.connectionString'));

        app.listen(config.get('http.port'), () => {
            console.log(`Server is running on http://${config.get('http.host')}:${config.get('http.port')}`);
        });
    } catch (e) {
        console.log('Connection error: ', e);
    }
})();
