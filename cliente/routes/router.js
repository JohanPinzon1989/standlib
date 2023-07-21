const express = require("express");
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
const controllerRouter = require("../controller/controller.admin");
const uploader = multer({ storage });
const router = express.Router();

/* rutas de administracion
------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Login Funcionarios
router.get("/adlogin", (req, res) => {
  res.render("ESP/admin/login", { alert: false });
});

/* index de administracion
router.get("/ia", adlogin.isAuthenticated, (req, res) => {
  res.render("ESP/admin/index", { user: req.user });
});*/

router.get("/ia", adlogin.isAuthenticated, controllerRouter.index);

//Cargar Documentos
router.get("/aDoc", adlogin.isAuthenticated, (req, res) => {
  res.render("ESP/admin/addDoc");
});

//Lista de documentos
router.get("/lDoc", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    "SELECT * FROM documentos WHERE Estado = 'Activo' ",
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/admin/listDoc", { results: results });
      }
    }
  );
});

// Ver documento
/*router.post("/VDoc/ver", adlogin.isAuthenticated,(req, res) => {
  const Id = req.params.Id;
  conexion.query("SELECT * FROM documentos WHERE Id = ?",[Id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/verDoc", { results: results });
    }
  });
});*/
router.post("/VDoc/ver", adlogin.isAuthenticated, controllerRouter.rDoc);

//Listar usuarios de Organizacion
router.get("/lUser", (req, res) => {
  conexion.query("SELECT * FROM usuarios_standlib", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/ListUserOrg", { results: results });
    }
  });
});

//Agregar Usuario de Organizacion
router.get("/regUsOrg", (req, res) => {
  res.render("ESP/admin/regUserOrg", { alert: false });
});

//Editar usuarios de Organizacion
router.get("/EUser/:Id", adlogin.isAuthenticated, (req, res) => {
  const Id = req.params.Id;
  conexion.query(
    "SELECT * FROM usuarios_standlib WHERE Id = ?",
    [Id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/admin/EditUserOrg", { user: results[0] });
      }
    }
  );
});
//router.get("/EUser", adlogin.isAuthenticated, (req, res) => {
//res.render("ESP/admin/EditUserOrg", { alert: false });
//});
//router.post("/EUser/edit", adlogin.isAuthenticated, controllerRouter.edit);

//Eliminar usuarios de la organizacion
router.post(
  "/dUser/destroy",
  adlogin.isAuthenticated,
  controllerRouter.destroy
);

//Lista de Clientes
router.get("/cli", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    "SELECT * FROM tenant WHERE Estado = 'Activo' ",
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/admin/prductClientes", { results: results });
      }
    }
  );
});

/* Ruta de clientes
------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Login Clientes
router.get("/login", (req, res) => {
  res.render("ESP/user/login", { alert: false });
});

// Registro de usuarios y tenant
router.get("/register", (req, res) => {
  conexion.query("SELECT * FROM estado_provincia", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/user/registro_org", { results: results });
    }
  });
});

// index de Clientes
router.get("/ia", adlogin.isAuthenticated, (req, res) => {
  res.render("ESP/user/index", { user: req.user });
});

//Listado de usuarios
router.get("/us", login.isAuthenticated, (req, res) => {
  conexion.query("SELECT * FROM usuarios", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/user/usuarios", { results: results });
    }
  });
});

router.get("/cus", login.isAuthenticated, (req, res) => {
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
router.use("/api/perUser", perUser);
router.use("/api/newClient", newClient);
router.use("/api/Us", usuariosOrg);
router.use("/api/pais", pais);
router.use("/api/usuarios", usuarios);
router.post("/api/login", login.auth);
router.post("/api/alogin", adlogin.auth);
router.use(errors);
router.get("/logout", login.logout);
//cargar archivos
router.post("/upload", uploader.single("pdfFile"), add);

module.exports = router;
