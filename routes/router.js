const express = require("express");
const router = express.Router();

const conexion = require("../DB/database");
const pais = require("../src/modulos/pais/rutas");
const usuarios = require("../src/modulos/usuarios/rutas");
const errors = require("../src/red/errors");
const login = require("../src/modulos/usuarios/autenticacion");

router.get("/", login.isAuthenticated, (req, res) => {
  res.render("index", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("login", { alert: false });
});

router.get("/register", (req, res) => {
  res.render("register");
});

//Router para registrar los datos
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.post("/api/login", login.auth);
router.use(errors);
router.get("/logout", login.logout);

module.exports = router;
