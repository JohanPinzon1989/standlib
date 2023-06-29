const express = require("express");
const router = express.Router();

const conexion = require("../serv/DB/database");
const pais = require("../serv/modulos/pais/rutas");
const usuarios = require("../serv/modulos/usuarios/rutas");
const errors = require("../serv/red/errors");
const login = require("../serv/modulos/usuarios/autenticacion");

router.get("/", login.isAuthenticated, (req, res) => {
  res.render("ESP/index", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("ESP/login", { alert: false });
});

router.get("/register", (req, res) => {
  res.render("ESP/registro_org");
});

router.get("/registerU", (req, res) => {
  res.render("ESP/registro_usr");
});
router.get("/regUs", (req, res) => {
  res.render("ESP/usuarios");
});

//Router para registrar los datos
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.post("/api/login", login.auth);
router.use(errors);
router.get("/logout", login.logout);

module.exports = router;
