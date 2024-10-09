const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../domain/models/user.model.cjs');

// Removemos el parámetro 'path' de la función de configuración de Passport
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (user, done) => {
        try {
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback", // Aquí se define el callback URL sin path adicional
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile, 'DENTRO');
        const { _json } = profile;
        _json.provider = profile.provider;

        try {
            // Buscamos si existe un usuario con el correo recibido
            const existingUser = await User.findByEmail(_json.email);
            console.log("Usuario existente:", existingUser);

            // Si existe, se crea la sesión con esos datos
            if (existingUser) {
                return done(null, existingUser); // Quitamos el argumento 'path'
            }
        
            // Si no existe, se crea un nuevo usuario
            const newUserData = {
                email: _json.email,
                username: _json.given_name, // Se asume que el nombre de usuario será el nombre recibido de Google
                password: "default_password" // Podrías asignar una contraseña predeterminada, pero sería mejor requerir que el usuario la establezca luego
            };
            
            const newUser = await User.create(newUserData); // Crea el usuario en la Base de datos
            console.log("Nuevo usuario creado:", newUser);
            done(null, newUser); // Quitamos el argumento 'path'
        } catch (error) {
            console.error('Error saving/updating user:', error);
            done(error, null);
        }
    }));
}

