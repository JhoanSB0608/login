const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../domain/models/user.model.cjs');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback' // Debe coincidir con la URL en tu cliente
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Aquí puedes buscar el usuario en la base de datos y devolver el usuario
        //console.log(profile.emails[0].value)
        let user = await User.findByEmail(profile.emails[0].value);
        if (!user) {
            // Si no existe, puedes crear un nuevo usuario
            user = await User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                // Otras propiedades necesarias
            });
        }
        done(null, user); // Este usuario se asigna a req.user
    } catch (err) {
        done(err, null);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findByGitHubId(profile.id);
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = await User.create({
            githubId: profile.id,
            username: profile.username,
            email: profile.emails[0].value
        });
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: "/auth/discord/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findByDiscordId(profile.id);
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = await User.create({
            discordId: profile.id,
            username: profile.username,
            email: profile.email
        });
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});