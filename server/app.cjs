const express = require('express');
const passport = require('passport');
const createServer = require('./infrastructure/server/server.cjs');
const ConnectToDatabase = require('./infrastructure/database/database.cjs');
const sessionConfigPassport = require('./infrastructure/middlewares/sessionOAuthConf.cjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = express.Router();

const startApp = async () => {
    const { app, PORT, server } = createServer(); // Aquí se obtiene la app y el puerto

    // Conectar a la base de datos
    const DBConnection = async () => {
        const dbInstance = new ConnectToDatabase();
        try {
            await dbInstance.connectOpen();
            console.log("Conexión a la db exitosa");
        } catch (error) {
            console.log("Conexión a la base de datos fallida: ", error.message);
        }
    };
    await DBConnection();

    // Aquí se inicia el servidor
    server.listen(PORT, () => {
        console.log(`Servidor escuchando en http://${process.env.EXPRESS_HOST}:${PORT}`);
    });
};

startApp();
