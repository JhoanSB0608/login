const express = require("express");
const http = require("http");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const sessionConfigPassport = require("../middlewares/sessionOAuthConf.cjs");
const indexRouter = require("../../application/routes/index.router.cjs");
const userRoutes = require("../../application/routes/user.routes.cjs");
const productRoutes = require("../../application/routes/products.routes.cjs");
require("dotenv").config();

const createServer = () => {
  const app = express();
  const PORT = process.env.EXPRESS_PORT || 3000;

  // Configuración de CORS
  app.use(
    cors({
      origin: "http://localhost:5173", // Permitir solicitudes desde http://localhost:5173
      credentials: true, // Permitir el uso de cookies y encabezados de autenticación
    })
  );

  const server = http.createServer(app);

  app.use(
    "/",
    sessionConfigPassport,
    passport.initialize(),
    passport.session(),
    (req, res, next) => {
      console.log(req.isAuthenticated(), "asfhuashfuashf");
      let validRoutesUnProtected = ["/login", "/register", "/auth", "/user"];
      let isProtectedRoute = validRoutesUnProtected.some((route) =>
        req.originalUrl.startsWith(route)
      );

      if (!req.isAuthenticated() && !isProtectedRoute) {
        return res
          .status(401)
          .json({
            authenticated: false,
            user: null,
            details: "No hay usuario logueado",
            redirect: "/",
          });
      }
      console.log(req.user);
      next();
    },
    indexRouter
  );

  // Las demás rutas...
  app.use("/auth", userRoutes);
  app.use("/products", productRoutes);

  // Middlewares
  /* app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(session({
        secret: process.env.SESSION_SECRET || 'default_secret', // Usa un secreto seguro
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    }));

    app.use(passport.initialize());
    app.use(passport.session()); */

  return { app, server, PORT }; // Devuelve app y PORT para usarlos en app.js
};

module.exports = createServer;
