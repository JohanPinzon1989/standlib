const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const conexion = require("../serv/DB/dbreg");
const pais = require("../serv/modulos/pais/rutas");
const usuarios = require("../serv/modulos/usuarios/rutas");
const newClient = require("../serv/modulos/nuevocliente/rutas");
const perUser = require("../serv/modulos/perfilUsuario/rutas");
const { add } = require("../serv/modulos/documentos");
const errors = require("../serv/red/errors");
const login = require("../serv/modulos/usuarios/autenticacion");
const storage = require("../serv/modulos/documentos/load");
const bodyParser = require("body-parser");
const { agregar } = require("../serv/modulos/pais");
const uploader = multer({ storage });

router.get("/", login.isAuthenticated, (req, res) => {
  res.render("ESP/index", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("ESP/login", { alert: false });
});

router.get("/register", (req, res) => {
  conexion.query("SELECT * FROM estado_provincia", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/registro_org", { results: results });
    }
  });
});

router.get("/aDoc", login.isAuthenticated,(req, res) => {
  res.render("ESP/addDoc");
});

router.get("/lDoc", login.isAuthenticated,(req, res) => {
  res.render("ESP/listarDoc");
});
//Inicio del menu de usuarios
router.get("/us", login.isAuthenticated,(req, res) => {
  conexion.query("SELECT * FROM usuarios", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/usuarios", { results: results });
    }
  });
});
router.get("/cus", login.isAuthenticated,(req, res) => {
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
router.use('/api/perUser', perUser);
router.use('/api/newClient', newClient);
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.post("/api/login", login.auth);
router.use(errors);
router.get("/logout", login.logout);
//cargar archivos
router.post("/upload", uploader.single("pdfFile"), add);

module.exports = router;
