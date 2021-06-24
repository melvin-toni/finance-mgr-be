const env = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const chalk = require('chalk');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const { StatusCodes } = require("http-status-codes");
const fs = require('fs');
const RSA_PUBLIC_KEY = fs.readFileSync('jwtRS256.key.pub', 'utf8');
const {
	failedLog
} = require("./helpers/logger");

// add the list of routes here
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

let envPath = 'environments/.env.development'
env.config({
    debug: process.env.DEBUG,
    path: envPath
})

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log(chalk.green('✓'), 'MongoDB connection established');
}).catch((error) => {
    console.log(chalk.red('✘'), 'MongoDB connection error');
    console.log(error);
});

const app = express();
app.set('host', process.env.HOST || 'localhost');
app.set('port', process.env.PORT || 8000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(expressJwt({
    secret: RSA_PUBLIC_KEY,
    algorithms: ['RS256'],
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({
    // add route here to exclude API from token auth check
    path: [
        '/api/auth/login',
        '/api/user/register'
    ]
}), (error, req, res, next) => {
    if (error) { 
        failedLog(req, res, {
            status: false, message: error.message, debug: error, code: StatusCodes.UNAUTHORIZED
        });
    }
});

// add the list of API's here
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(app.get('port'), () => {
    console.log('%s App is running at %s:%d in %s mode', chalk.green('✓'), app.get('host'), app.get('port'), app.get('env'));
});

module.exports = app;