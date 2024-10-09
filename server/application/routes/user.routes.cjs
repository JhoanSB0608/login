const express = require('express');
const passport = require('passport');

const configPassportGoogleOAuth = require('../middlewares/GoogleOAuth.cjs');
const {googleCallback } = require('../controllers/OAuthsController.cjs')
const router = express.Router();
const {
    registerUser,
    loginUser,
    //googleAuth,
    //googleCallback,
    githubAuth,
    githubCallback,
    discordAuth,
    discordCallback
} = require('../controllers/user.controller.cjs');

// Registro de usuario
router.post('/register', registerUser);

// Login de usuario
router.post('/login', loginUser);

// Autenticación con Google
router.get('/google', (req, res, next) => {
    configPassportGoogleOAuth(passport); // Llama a la configuración de Google OAuth para Passport
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleCallback);

// Autenticación con GitHub
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

// Autenticación con Discord
router.get('/discord', discordAuth);
router.get('/discord/callback', discordCallback);

module.exports = router;