const express = require('express');
const path = require('path');
const router = express.Router();

/* router.get('/check', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ authenticated: false, user: null, details: 'No hay token' });
    }

    jwt.verify(token, process.env.KEY_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ authenticated: false, user: null, details: 'Token inválido' });
        }

        res.status(200).json({ authenticated: true, user, details: 'Usuario logueado' });
    });
}); */

router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ authenticated: true, user: req.user, details: 'Usuario logueado' });
    } else {
        return res.status(401).json({ authenticated: false, user: null, details: 'No se encuentra logueado' });
    }
});

module.exports = router;