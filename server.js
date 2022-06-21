const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const config = require('config');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const {errors} = require('celebrate');
const MongoStore = require('connect-mongo');
const onConnection = require('./src/socket');

(async () => {
    try {
        const app = express();
        const httpServer = createServer(app);
        const io = new Server(httpServer);

        io.on('connection', socket => {
            onConnection(io, socket)
        });

        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, 'views'));
        app.set('trust proxy', 1);

        app.use(session({
            store: MongoStore.create({mongoUrl: config.get('db.connectionString')}),
            secret: config.get('session.secret'),
            resave: false,
            saveUninitialized: false
        }));

        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use('/assets', express.static(path.join('public', 'assets')));
        app.use((req, res, next) => {
            res.locals = {loggedin: !!req.session.user};
            next();
        });
        app.use('/', require('./src/MainRouter'));
        app.use(errors());

        await mongoose.connect(config.get('db.connectionString'));

        httpServer.listen(config.get('http.port'), () => {
            console.log(`Server is running on http://${config.get('http.host')}:${config.get('http.port')}`);
        });
    } catch (e) {
        console.log('Connection error: ', e);
    }
})();
