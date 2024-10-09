const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        console.log('Callback', user, err, info);
        if (info.exists && info.path == 'register') {
            return res.status(400).json({
                errorCode: 400,
                msg: 'Intento de registro de usuario que ya existe en base de datos'
            });
        }

        if (err || !user) {
            return res.status(500).json({ msg: 'Error en la autenticación, fallida o cancelada' });
        }

        console.log(user, info);

        req.logIn(user, (err) => {
            if (err) {
                console.log(err, 'Error al iniciar sesión');
                return next(err);
            }

            const token = jwt.sign({ id: user._id }, process.env.KEY_SECRET, { expiresIn: '1h' });
            console.log(token);

            // Redirige al frontend y pasa el token como parámetro en la URL
            res.redirect(`http://localhost:5173/manage?token=${token}`);
        });
    })(req, res, next);
};
