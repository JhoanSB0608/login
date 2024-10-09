const session = require('express-session');
const sessionConfigPassport = require('express').Router();

module.exports = sessionConfigPassport.use(session({
    secret: process.env.KEY_SECRET || 'default_secret' ,
    resave: false,
    saveUninitialized: true,
}))
