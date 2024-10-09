const passport = require('passport');
const User = require('../../domain/models/user.model.cjs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const newUser = await User.createWithPassword(username, email, password);
        res.status(201).json({ message: 'Usuario creado exitosamente', userId: newUser.userData._id });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear usuario', error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        //console.log(user)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user._id }, process.env.KEY_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
    }
};

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
// Para autenticación social, redirigir con el token
const googleCallback = (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        // Checkeo de error por si se intenta registrar con una cuenta que ya existe en base de datos
        if (info.exists && info.path == 'register') {
            return res.status(400).json({
                errorCode: 400,
                msg: 'Intento de registro de usuario que ya existe en base de datos'
            });
        }

        // Checkeo si la autenticación fue cancelada o hubo algún error
        if (err || !user) {
            return res.status(500).json({ msg: 'Error en la autenticación, fallida o cancelada' });
        }
        
        console.log(user, info);

        // Iniciar sesión con el usuario autenticado
        req.logIn(user, (err) => {
            if (err) {
                console.log(err, 'Error al iniciar sesión');
                return next(err);
            }
            
            // Generar el token después de iniciar sesión
            const token = jwt.sign({ id: user._id }, process.env.KEY_SECRET, { expiresIn: '1h' });
            // Redirigir con el token
            res.redirect(`http://localhost:5173/manage?token=${token}`);
        });
    })(req, res, next);
};

const githubAuth = passport.authenticate('github', { scope: ['profile', 'email'] });
const githubCallback = passport.authenticate('github', { failureRedirect: '/' }, (req, res) => {
    res.redirect('/'); // Redirige a la página principal o a donde quieras después de la autenticación
});

const discordAuth = passport.authenticate('discord');
const discordCallback = passport.authenticate('discord', { failureRedirect: '/' }, (req, res) => {
    res.redirect('/'); // Redirige a la página principal o a donde quieras después de la autenticación
});

module.exports = {
    registerUser,
    loginUser,
    googleAuth,
    googleCallback,
    githubAuth,
    githubCallback,
    discordAuth,
    discordCallback
};