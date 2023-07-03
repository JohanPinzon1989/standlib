const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const conexion = require("../serv/DB/dbreg");
const pais = require("../serv/modulos/pais/rutas");
const usuarios = require("../serv/modulos/usuarios/rutas");
const usuariosOrg = require("../serv/modulos/usuariosOrg/rutas");
const newClient = require("../serv/modulos/nuevocliente/rutas");
const perUser = require("../serv/modulos/perfilUsuario/rutas");
const { add } = require("../serv/modulos/documentos");
const errors = require("../serv/red/errors");
const login = require("../serv/modulos/usuarios/autenticacion");
const adlogin = require("../serv/modulos/usuariosOrg/autenticacion");
const storage = require("../serv/modulos/documentos/load");
const bodyParser = require("body-parser");
const { agregar } = require("../serv/modulos/pais");
const uploader = multer({ storage });

router.get("/", login.isAuthenticated, (req, res) => {
  res.render("ESP/user/index", { user: req.user });
});
//Login Clientes
router.get("/login", (req, res) => {
  res.render("ESP/user/login", { alert: false });
});

//Login Funcionarios
router.get("/adlogin", (req, res) => {
  res.render("ESP/admin/login", { alert: false });
});

router.get("/register", (req, res) => {
  conexion.query("SELECT * FROM estado_provincia", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/user/registro_org", { results: results });
    }
  });
});
router.get("/regUsOrg", (req, res) => {
  conexion.query("SELECT * FROM Rol_Usuarios_Empresa", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/regUserOrg", { results: results });
    }
  });
});

router.get("/aDoc", login.isAuthenticated,(req, res) => {
  res.render("ESP/admin/addDoc");
});

router.get("/lDoc", login.isAuthenticated,(req, res) => {
  res.render("ESP/admin/listarDoc");
});
//Inicio del menu de usuarios
router.get("/us", login.isAuthenticated,(req, res) => {
  conexion.query("SELECT * FROM usuarios", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/usuarios", { results: results });
    }
  });
});
//Listar usuarios de Organizacion
router.get("/lUser", login.isAuthenticated,(req, res) => {
  conexion.query("SELECT * FROM usuarios_standlib", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/ListUser", { results: results });
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
      res.render("ESP/user/crearUsuarios", { est_prv: results });
    }
  });
  conexion.query("SELECT * FROM perfil_usuario", (error, result) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/user/crearUsuarios", { per_us: result });
    }
  });
  console.log(ep1);
});

//Router para registrar los datos
router.use('/api/perUser', perUser);
router.use('/api/newClient', newClient);
router.use('/api/newUs', usuariosOrg);
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.post("/api/login", login.auth);
router.post("/api/alogin", adlogin.auth);
router.use(errors);
router.get("/logout", login.logout);
//cargar archivos
router.post("/upload", uploader.single("pdfFile"), add);

module.exports = router;
