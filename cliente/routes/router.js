const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const conexion = require("../serv/DB/dbreg");
const { agregarP, updateP} = require("../serv/modulos/pais");
const usuarios = require("../serv/modulos/usuarios/rutas");
const {
  actualizarUc,
  actualizarUcP,
  agregarCLi,
  actualizarCU,
  actualizarCcP,
  actualizarPC,
} = require("../serv/modulos/usuarios");
const {
  agregarF,
  actualizarF,
  asignarF,
  asignarFI,
  asignarFO,
} = require("../serv/modulos/factura");
const usuariosOrg = require("../serv/modulos/usuariosOrg/rutas");
const newClient = require("../serv/modulos/nuevocliente/rutas");
const perUser = require("../serv/modulos/perfilUsuario/rutas");
const {
  add,
  actualizar,
  actualizarD,
  actualizarI,
} = require("../serv/modulos/documentos");
const { actualizarT, actualizarTC } = require("../serv/modulos/tenant");
const {
  asignarDocUC,
  asignarIndUC,
  asignarAutUC,
} = require("../serv/modulos/documentosUsuario");
const errors = require("../serv/red/errors");
const login = require("../serv/modulos/usuarios/autenticacion");
const adlogin = require("../serv/modulos/usuariosOrg/autenticacion");
const storage = require("../serv/modulos/documentos/load");
//const bodyParser = require("body-parser");
const { agregar } = require("../serv/modulos/pais");
const { agregarI, updateI } = require("../serv/modulos/industria");
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
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/admin/index", { usuario: results });
      }
    }
  );
});

//router.get("/ia", adlogin.isAuthenticated, controllerRouter.index);

//Cargar Documentos
router.get("/aDoc", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM industria", (error, results1) => {
          if (error) {
            throw error;
          } else {
            res.render("ESP/admin/addDoc", {
              usuario: results,
              results: results1,
            });
          }
        });
      }
    }
  );
});

//Lista de documentos
router.get("/lDoc", adlogin.isAuthenticated, function (req, res) {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM documentos", (error, results1) => {
          if (error) {
            throw error;
          } else {
            res.render("ESP/admin/listDoc", {
              usuario: results,
              results: results1,
            });
          }
        });
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
router.get("/lUser", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM usuarios_standlib", (error, results1) => {
          if (error) {
            throw error;
          } else {
            res.render("ESP/admin/ListUserOrg", {
              usuario: results,
              results: results1,
            });
          }
        });
      }
    }
  );
});

//Agregar Usuario de Organizacion
router.get("/regUsOrg", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/admin/regUserOrg", { usuario: results });
      }
    }
  );
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
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query("SELECT * FROM tenant", (error, results1) => {
          if (error) {
            throw error;
          } else {
            res.render("ESP/admin/listTenant", {
              usuario: results,
              results: results1,
            });
          }
        });
      }
    }
  );
});

//Lista de Clientes
router.get("/Tcli", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          `select usuarios.Id, usuarios.Nombre, usuarios.Apellido, usuarios.Email, usuarios.Num_Fijo, usuarios.Num_Celular, usuarios.Estado, usuarios.Estado_ing,
        usuarios.password, usuarios.Perfil, usuarios.Publicidad, tenant.Nombre_Org
        from usuarios inner join tenant
        on tenant.Id = usuarios.Tenant_Id and tenant.Estado = "Activo"
        order by tenant.Nombre_org asc`,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/admin/listUsClient", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});

//Lista de Facturacion
router.get("/Fcli", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results4) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          `select Id,Tenant_Id, NumFactura, date_format(Fecha_inicio, "%Y-%m-%d") as Fecha_inicio, date_format(Fecha_fin, "%Y-%m-%d") as Fecha_fin,
           Estado, CostoUSD, CostoCOP from historial_facturacion order by Fecha_inicio asc`,
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
                          conexion.query(
                            `select DISTINCT Autor from Documentos order by Autor asc`,
                            (error, results5) => {
                              if (error) {
                                throw error;
                              } else {
                                conexion.query(
                                  `select DISTINCT Industria from Documentos order by Industria asc`,
                                  (error, results6) => {
                                    if (error) {
                                      throw error;
                                    } else {
                                      conexion.query(
                                        `select d.Id as IdD, d.Nombre as NombDoc, d.Abreviacion as dAbrev, d.Version, d.Autor, d.Industria, d.Estado, d.LinkDoc, d.Descripcion,
                                        f.IdFactura as IdF
                                        from documentos as d
                                        inner join facturacion_documentos as f 
                                        where d.Id = f.IdDocumentos and d.Estado = "Activo" order by NombDoc asc`,
                                        (error, results7) => {
                                          if (error) {
                                            throw error;
                                          } else {
                                            res.render("ESP/admin/listPlanes", {
                                              usuario: results4,
                                              fact: results,
                                              docu: results2,
                                              ten: results3,
                                              autor: results5,
                                              industria: results6,
                                              documents: results7,
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
                        }
                      }
                    );
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

//Agregar Factura
router.get("/regFact", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          `select * from tenant where Estado = "Activo" order by Nombre_org asc`,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/admin/crearFactura", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});

//Eliminar asifnacion documento de fatura por documento
router.get("/delDocFact/:IdF,:IdD", adlogin.isAuthenticated, (req, res) => {
  const IdF = req.params.IdF;
  const IdD = req.params.IdD;

  console.log(IdF, IdD);
  conexion.query(
    "DELETE FROM facturacion_documentos WHERE IdDocumentos = ? AND IdFactura = ?",
    [IdD, IdF],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/Fcli");
      }
    }
  );
});
//Eliminar factura
router.get("/delFact/:Id,:It", adlogin.isAuthenticated, (req, res) => {
  const Id = req.params.Id;
  const It = req.params.It;

  console.log(Id, It);
  conexion.query(
    "DELETE FROM Historial_facturacion WHERE Id = ?",
    [Id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          "DELETE FROM facturacion_documentos WHERE IdTenant = ? AND IdFactura = ?",
          [It, Id],
          (error, results) => {
            if (error) {
              throw error;
            } else {
              res.redirect("/Fcli");
            }
          }
        );
      }
    }
  );
});

//agregar o eliminar asignacion
router.use("/docFact", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          `select Id,Tenant_Id, NumFactura, date_format(Fecha_inicio, "%Y-%m-%d") as Fecha_inicio, date_format(Fecha_fin, "%Y-%m-%d") as Fecha_fin,
    Estado, CostoUSD, CostoCOP from historial_facturacion where Estado="Activo" order by Fecha_inicio asc`,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              conexion.query(
                `select * from documentos where Estado="Activo" and Pago= "Si" order by Nombre asc`,
                (error, results2) => {
                  if (error) {
                    throw error;
                  } else {
                    conexion.query(
                      `select DISTINCT Autor from Documentos order by Autor asc`,
                      (error, results3) => {
                        if (error) {
                          throw error;
                        } else {
                          conexion.query(
                            `select DISTINCT Industria from Documentos order by Industria asc`,
                            (error, results4) => {
                              if (error) {
                                throw error;
                              } else {
                                res.render("ESP/admin/asigDocument", {
                                  usuario: results,
                                  fact: results1,
                                  docu: results2,
                                  autor: results3,
                                  industria: results4,
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
            }
          }
        );
      }
    }
  );
});

// Listar Industria
router.get("/listInd", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          `select * from industria order by Industria asc`,
          req.cookies.jwt,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/admin/listIndus", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});

// Agregar Industria
router.get("/adInds", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/admin/addIndustria", {
          usuario: results
        });
      }
    }
  );
});

//Eliminar Industria
router.get("/dIndust/:Id", adlogin.isAuthenticated, (req, res) => {
  const Id = req.params.Id;
  conexion.query(
    "DELETE FROM industria WHERE Id = ?",
    [Id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/listInd");
      }
    }
  );
});

// Listar Pais y region
router.get("/listPaReg", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(
          `select * from pais_estadoprovincia order by departament asc`,
          req.cookies.jwt,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/admin/listPaisReg", { usuario: results, results:results1 });
            }
          }
        );
      }
    }
  );
});

// Agregar Pais region
router.get("/adPais", adlogin.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios_standlib as u
  inner join controlcona as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/admin/addPais", {
          usuario: results
        });
      }
    }
  );
});

//Eliminar Pais region
router.get("/dPais/:Id", adlogin.isAuthenticated, (req, res) => {
  const Id = req.params.Id;
  conexion.query(
    "DELETE FROM pais_estadoprovincia WHERE Id = ?",
    [Id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/listPaReg");
      }
    }
  );
});

router.get("/modAsc", (req, res) => {
  res.render("ESP/admin/asigDocument");
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
router.get("/iu", login.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/user/index", { usuario: results });
      }
    }
  );
});

// Mensaje de correo ya registrado
router.get("/mue", login.isAuthenticated, (req, res) => {
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("ESP/user/MessageUserExist", { usuario: results });
      }
    }
  );
});

//Listado de usuarios
router.get("/us", login.isAuthenticated, (req, res) => {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          "SELECT * FROM usuarios where Tenant_Id = ?",
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/user/usuarios", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});

//Formulario registro de usuarios
router.get("/addus", login.isAuthenticated, (req, res) => {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          "SELECT * FROM pais_estadoprovincia order by Departament asc",
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/user/regUsuario", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});

//Eliminar usuarios de la organizacion
router.get("/dUserCLI/:Id", adlogin.isAuthenticated, (req, res) => {
  const Id = req.params.Id;
  conexion.query(
    "DELETE FROM usuarios WHERE Id = ?",
    [Id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/us");
      }
    }
  );
});

// Listar documentos Administrador y Editor
router.get("/norA", adlogin.isAuthenticated, function (req, res) {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          `SELECT DISTINCT d.Id as IdD, d.Nombre as NombDoc, d.Abreviacion as dAbrev, d.Version, d.Autor, d.Industria,  d.Estado, d.LinkDoc,
      t.Id as IdT, t.Nombre_org as NomOrg
      FROM facturacion_documentos as f 
      inner join historial_facturacion as fd on f.IdFactura = fd.Id
      inner join tenant as t on f.IdTenant = t.Id
      inner join documentos as d on f.IdDocumentos = d.Id
      where d.Pago = "SI" and d.Estado = "Activo" and fd.Estado = "Activo" and t.Estado = "Activo" and t.Id = ? order by d.Nombre asc`,
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/user/ListDoc", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});

// Asignar documentos Administrador y Editor
router.get("/asnor", adlogin.isAuthenticated, function (req, res) {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          `SELECT DISTINCT d.Id as IdD, d.Nombre as NombDoc, d.Abreviacion as dAbrev, d.Version, d.Autor, d.Industria,  d.Estado, d.LinkDoc,
      t.Id as IdT, t.Nombre_org as NomOrg
      FROM facturacion_documentos as f 
      inner join historial_facturacion as fd on f.IdFactura = fd.Id
      inner join tenant as t on f.IdTenant = t.Id
      inner join documentos as d on f.IdDocumentos = d.Id
      where d.Pago = "SI" and d.Estado = "Activo" and fd.Estado = "Activo" and t.Estado = "Activo" and t.Id = ? order by d.Nombre asc`,
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              conexion.query(
                `SELECT * FROM usuarios where Tenant_Id = ? and Perfil = "Lector"`,
                c,
                (error, results2) => {
                  if (error) {
                    throw error;
                  } else {
                    conexion.query(
                      `SELECT DISTINCT  d.Industria
              FROM facturacion_documentos as f 
              inner join historial_facturacion as fd on f.IdFactura = fd.Id
              inner join tenant as t on f.IdTenant = t.Id
              inner join documentos as d on f.IdDocumentos = d.Id
              where d.Pago = "SI" and d.Estado = "Activo" and fd.Estado = "Activo" and t.Estado = "Activo" and t.Id = ? order by d.Industria asc;`,
                      c,
                      (error, results3) => {
                        if (error) {
                          throw error;
                        } else {
                          conexion.query(
                            `SELECT DISTINCT  d.Autor
                  FROM facturacion_documentos as f 
                  inner join historial_facturacion as fd on f.IdFactura = fd.Id
                  inner join tenant as t on f.IdTenant = t.Id
                  inner join documentos as d on f.IdDocumentos = d.Id
                  where d.Pago = "SI" and d.Estado = "Activo" and fd.Estado = "Activo" and t.Estado = "Activo" and t.Id = ? order by d.Autor asc;`,
                            c,
                            (error, results4) => {
                              if (error) {
                                throw error;
                              } else {
                                res.render("ESP/user/asignarDocumentos", {
                                  usuario: results,
                                  documentos: results1,
                                  usuarios: results2,
                                  industria: results3,
                                  autor: results4,
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
            }
          }
        );
      }
    }
  );
});

// Listar documentos Lector
router.get("/norL", adlogin.isAuthenticated, function (req, res) {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          `SELECT DISTINCT d.Id as IdD, d.Nombre as NombDoc, d.Abreviacion as dAbrev, d.Version, d.Autor, d.Industria,  d.Estado, d.LinkDoc,
      t.Id as IdT, t.Nombre_org as NomOrg
      FROM facturacion_documentos as f 
      inner join historial_facturacion as fd on f.IdFactura = fd.Id
      inner join tenant as t on f.IdTenant = t.Id
      inner join documentos as d on f.IdDocumentos = d.Id
      where d.Pago = "SI" and d.Estado = "Activo" and fd.Estado = "Activo" and t.Estado = "Activo" and t.Id = ? order by d.Nombre asc`,
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/user/lectorDoc", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});

//Lista de Facturacion
router.get("/Pc", adlogin.isAuthenticated, (req, res) => {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          `select Id,Tenant_Id, NumFactura, date_format(Fecha_inicio, "%Y-%m-%d") as Fecha_inicio, date_format(Fecha_fin, "%Y-%m-%d") as Fecha_fin,
      Estado, CostoUSD, CostoCOP from historial_facturacion where Tenant_Id = ? order by Fecha_inicio asc`,
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              conexion.query(
                "SELECT * FROM tenant WHERE Id = ?",
                c,
                (error, results2) => {
                  if (error) {
                    throw error;
                  } else {
                    res.render("ESP/user/listPlanes", {
                      usuario: results,
                      fact: results1,
                      ten: results2,
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

// Formulario edicion datos usuario logueado
router.get("/perfC", login.isAuthenticated, (req, res) => {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          "SELECT * FROM usuarios where Tenant_Id = ?",
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              conexion.query(
                "SELECT * FROM pais_estadoprovincia order by Departament asc",
                c,
                (error, results2) => {
                  if (error) {
                    throw error;
                  } else {
                    res.render("ESP/user/editCuenta", {
                      usuario: results,
                      results: results1,
                      pep: results2,
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

// Formulario edicion datos tenant usuario logueado Administrador
router.get("/edtCli", login.isAuthenticated, (req, res) => {
  let c;
  conexion.query(
    `select * from usuarios as u
  inner join controlcon as c
  where c.Token = ? and c.IdC = u.Id`,
    req.cookies.jwt,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        for (var count = 0; count < results.length; count++) {
          c = results[count].Tenant_Id;
        }
        conexion.query(
          "SELECT * FROM tenant where Id = ?",
          c,
          (error, results1) => {
            if (error) {
              throw error;
            } else {
              res.render("ESP/user/editTenant", {
                usuario: results,
                results: results1,
              });
            }
          }
        );
      }
    }
  );
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Router para registrar los datos
router.use("/api/perUser", perUser);
router.use("/api/newClient", newClient);
router.use("/api/Us", usuariosOrg);
//Agregar usuarios cliente
router.use("/api/usuarios", agregarCLi);
//Actualizar datos de usuario cliente
router.use("/actualizarUc", actualizarUc);
//Actualizar datos de usuario desde un cliente
router.use("/actualizarCU", actualizarCU);
//Actualizar datos de usuario logueado
router.use("/actualizarPC", actualizarPC);
//Actualizar contraseña usuario cliente
router.use("/actualizarUcP", actualizarUcP);
//Actualizar contraseña usuario desde un cliente
router.use("/actualizarCcP", actualizarCcP);
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
//actualizar datos de tenant por el cliente
router.post("/estTenCli", actualizarTC);
//reemplazar archivos
router.post("/uploadD", uploader.single("pdfFile"), actualizarD);
//Cargar imagen documento
router.post("/uploadI", uploader.single("pdfFile"), actualizarI);
//actualizar tenant
router.post("/uploadTen", actualizarT);
//Crear factura
router.post("/addFact", agregarF);
//actualizar factura
router.post("/uploadFact", actualizarF);
//asignar documentos a factura por documento
router.post("/regDocFact", asignarF);
//asignar documentos a factura por industria
router.post("/regDocFactI", asignarFI);
//asignar documentos a factura por organismo
router.post("/regDocFactO", asignarFO);
//asignar documentos a Usuario por documento
router.post("/regDocUS", asignarDocUC);
//asignar documentos a Usuario por Industria
router.post("/regIndUS", asignarIndUC);
//asignar documentos a Usuario por organismo
router.post("/regAutUS", asignarAutUC);
//Agregar Industria
router.use("/addInd", agregarI);
//Actualizar Industria
router.use("/upInd", updateI);
//Agregar Pais provincia
router.use("/addPa", agregarP);
//Actualizar pais provincia
router.use("/upPa", updateP);

module.exports = router;
