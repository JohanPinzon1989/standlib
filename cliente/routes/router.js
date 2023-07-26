const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const conexion = require("../serv/DB/dbreg");
const pais = require("../serv/modulos/pais/rutas");
const usuarios = require("../serv/modulos/usuarios/rutas");
const { actualizarUc, actualizarUcP } = require("../serv/modulos/usuarios");
const usuariosOrg = require("../serv/modulos/usuariosOrg/rutas");
const newClient = require("../serv/modulos/nuevocliente/rutas");
const perUser = require("../serv/modulos/perfilUsuario/rutas");
const {
  add,
  actualizar,
  actualizarD,
  actualizarI,
} = require("../serv/modulos/documentos");
const { actualizarT } = require("../serv/modulos/tenant");
const errors = require("../serv/red/errors");
const login = require("../serv/modulos/usuarios/autenticacion");
const adlogin = require("../serv/modulos/usuariosOrg/autenticacion");
const storage = require("../serv/modulos/documentos/load");
//const bodyParser = require("body-parser");
const { agregar } = require("../serv/modulos/pais");
const controllerRouter = require("../controller/controller.admin");
const { mysql } = require("../config");
const uploader = multer({ storage });
const router = express.Router();

/* rutas de administracion
------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Login Funcionarios
router.get("/adlogin", (req, res) => {
  res.render("ESP/admin/login", { alert: false });
});

// index de administracion
router.get("/ia", adlogin.isAuthenticated, (req, res) => {
  conexion.query("SELECT * FROM documentos", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/index", { results: results });
    }
  });
});

//router.get("/ia", adlogin.isAuthenticated, controllerRouter.index);

//Cargar Documentos
router.get("/aDoc", adlogin.isAuthenticated, (req, res) => {
  conexion.query("SELECT * FROM industria", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/addDoc", { results: results });
    }
  });
});

//Lista de documentos
router.get("/lDoc", adlogin.isAuthenticated, function (req, res) {
  conexion.query("SELECT * FROM documentos", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/listDoc", { results: results });
    }
  });
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
router.get("/lUser", adlogin.isAuthenticated, (req, res) => {
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

//Eliminar usuarios de la organizacion
router.get("/dUser/:Id", adlogin.isAuthenticated, (req, res) => {
  const Id = req.params.Id;
  conexion.query(
    "DELETE FROM usuarios_standlib WHERE Id = ?",
    [Id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/lUser");
      }
    }
  );
});

//Lista tenat de Clientes
router.get("/cli", adlogin.isAuthenticated, (req, res) => {
  conexion.query("SELECT * FROM tenant", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/admin/listTenant", { results: results });
    }
  });
});

//Lista de Clientes
router.get("/Tcli", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select usuarios.Id, usuarios.Nombre, usuarios.Apellido, usuarios.Email, usuarios.Num_Fijo, usuarios.Num_Celular, usuarios.Estado, usuarios.Estado_ing,
    usuarios.password, usuarios.Perfil, usuarios.Publicidad, tenant.Nombre_Org
    from usuarios inner join tenant
    on tenant.Id = usuarios.Tenant_Id and tenant.Estado = "Activo"
    order by tenant.Nombre_org asc`,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log(results);
        res.render("ESP/admin/listUsClient", { results: results });
      }
    }
  );
});

//Lista de Facturacion
router.get("/Fcli", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select Id,Tenant_Id, NumFactura, date_format(Fecha_inicio, "%Y-%m-%d") as Fecha_inicio, date_format(Fecha_fin, "%Y-%m-%d") as Fecha_fin,
    Estado, CostoUSD, CostoCOP from hostorial_facturacion order by Fecha_inicio asc`,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          `select * from documentos order by Nombre asc`,
          (error, results2) => {
            if (error) {
              throw error;
            } else {
              conexion.query(
                `select * from tenant order by Nombre_org asc`,
                (error, results3) => {
                  if (error) {
                    throw error;
                  } else {
                    console.log(results);
                    console.log(results2);
                    res.render("ESP/admin/listPlanes", {
                      fact: results,
                      docu: results2,
                      ten: results3,
                    });
                  }
                }
              );
            }
          }
        );
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
  conexion.query("SELECT * FROM pais_estadoprovincia", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render("ESP/user/registro_org", { results: results });
    }
  });
});

//Mensaje Dominio existente desde el registro de dominio
router.get("/Md", (req, res) => {
  res.render("ESP/user/mensajeDom", { alert: false });
});

//Mensaje Usuario existente desde el registro de dominio
router.get("/Mu", (req, res) => {
  res.render("ESP/user/mensajeUS", { alert: false });
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
//Actualizar datos de usuario cliente
router.use("/actualizarUc", actualizarUc);
//Actualizar contraseña usuario cliente
router.use("/actualizarUcP", actualizarUcP);
// Login clientes
router.post("/api/login", login.auth);
// Login funcionarios
router.post("/api/alogin", adlogin.auth);
router.use(errors);
//Logout usuarios
router.get("/logout", login.logout);
//Logout usuarios
router.get("/adlogout", adlogin.logout);
//cargar archivos
router.post("/upload", uploader.single("pdfFile"), add);
//actualizar datos de archivos
router.post("/update", actualizar);
//reemplazar archivos
router.post("/uploadD", uploader.single("pdfFile"), actualizarD);
//Cargar imagen documento
router.post("/uploadI", uploader.single("pdfFile"), actualizarI);
//actualizar tenant
router.post("/uploadTen", actualizarT);

module.exports = router;
