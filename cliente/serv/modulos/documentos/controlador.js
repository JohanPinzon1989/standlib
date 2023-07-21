const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");
const { render } = require("ejs");

const Table = "documentos";

module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../../DB/database");
  }

  function getAll() {
    return db.getAll(Table);
  }

  function find(id) {
    return db.find(Table, id);
  }

  async function add(req, res) {
    const { body, file } = req;
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const ind = await db.find("industria", body.Industria);
    let induE;
    let induI;
    for (var count = 0; count < ind.length; count++) {
      induE = ind[count].Industria;
      induI = ind[count].Industria_ing;
    }
    console.log(body.Id);
    if (body.Id == null) {
      const documento = {
        id: null,
        Nombre: body.Nombre,
        Abreviacion: body.Abreviacion,
        Version: body.Version,
        Descripcion: body.Descripcion,
        Descripcion_ing: body.Descripcion_ing,
        Fecha_carga: `${hoy}`,
        Estado: "Activo",
        linkDoc: `file/uploaders/${file.filename}`,
        LinkImagen: null,
        Autor: body.Autor,
        Industria: induE,
        Industria_ing: induI,
        Pago: body.Pago,
      };
      console.log(documento);
      const result = await db.agregar(Table, documento);
      res.render("ESP/admin/index");
    } else {
      const documento = {
        id: body.Id,
        Nombre: body.Nombre,
        Abreviacion: body.Abreviacion,
        Version: body.Version,
        Descripcion: body.Descripcion,
        Descripcion_ing: body.Descripcion_ing,
        Fecha_carga: `${hoy}`,
        Estado: body.Estado,
        linkDoc: `file/uploaders/${file.filename}`,
        LinkImagen: null,
        Autor: body.Autor,
        Industria: induE,
        Industria_ing: induI,
        Pago: body.Pago,
      };
      console.log(documento);
      const result = await db.agregar(Table, documento);
      res.render("ESP/admin/index");
    }
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    add,
    del,
  };
};
