const env = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const chalk = require('chalk');
const mongoose = require('mongoose');

// add the list of routes here
const authRoutes = require('./routes/auth');

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

// add the list of API's here
app.use('/api/auth', authRoutes);

app.listen(app.get('port'), () => {
    console.log('%s App is running at %s:%d in %s mode', chalk.green('✓'), app.get('host'), app.get('port'), app.get('env'));
});

module.exports = app;