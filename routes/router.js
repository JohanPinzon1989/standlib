const express = require("express");
const router = express.Router();

const conexion = require("../DB/database");
const pais = require("../src/modulos/pais/rutas");
const usuarios = require("../src/modulos/usuarios/rutas");
const errors = require("../src/red/errors");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//Router para registrar los datos
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.use("/api/auth", usuarios);
router.use(errors);

module.exports = router;
