const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const conexion = require("../serv/DB/dbreg");
const pais = require("../serv/modulos/pais/rutas");
const usuarios = require("../serv/modulos/usuarios/rutas");
const errors = require("../serv/red/errors");
const login = require("../serv/modulos/usuarios/autenticacion");
const uploades = multer({ dest: "../../../public/doc/uploades" });

router.get("/", login.isAuthenticated, (req, res) => {
  res.render("ESP/index", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("ESP/login", { alert: false });
});

router.get("/register", (req, res) => {
  res.render("ESP/registro_org");
});

router.get("/aDoc", (req, res) => {
  res.render("ESP/addDoc");
});

//cargar archivos
router.post("/upload", uploades.single("pdfFile"), (req, res) => {
  console.log(Nombre);
  res.send(Nombre);
});

//Inicio del menu de usuarios
router.get("/us", (req, res) => {
  conexion.query("SELECT * FROM usuarios", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/usuarios", { results: results });
    }
  });
});
router.get("/cus", (req, res) => {
  let ep1;
  let pu1;
  conexion.query("SELECT * FROM estado_provincia", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/crearUsuarios", { est_prv: results });
    }
  });
  conexion.query("SELECT * FROM perfil_usuario", (error, result) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/crearUsuarios", { per_us: result });
    }
  });
  console.log(ep1);
});
router.get("/wp", (req, res) => {
  res.render("ESP/whitePage");
});

//Router para registrar los datos
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.post("/api/login", login.auth);
router.use(errors);
router.get("/logout", login.logout);

module.exports = router;
