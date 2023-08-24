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
        Pago: body.Pago,
      };
      const result = await db.agregar(Table, documento);
      res.redirect("/lDoc");
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
        Pago: body.Pago,
      };
      const result = await db.agregar(Table, documento);
      res.redirect("/lDoc");
    }
  }

  async function actualizar(req, res) {
    const { body } = req;
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const documento = {
      Id: body.Id,
      Nombre: body.Nombre,
      Abreviacion: body.Abreviacion,
      Version: body.Version,
      Descripcion: body.Descripcion,
      Descripcion_ing: body.Descripcion_ing,
      Fecha_carga: `${hoy}`,
      Estado: body.Estado,
      Autor: body.Autor,
      Pago: body.Pago,
    };
    const result = await db.actualizar(Table, documento);
    res.redirect("/lDoc");
  }
  async function actualizarD(req, res) {
    const { body, file } = req;
    console.log(file);
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const documento = {
      Id: body.Id,
      linkDoc: `file/uploaders/${file.filename}`,
    };
    const result = await db.actualizar(Table, documento);
    res.redirect("/lDoc");
  }
  async function actualizarI(req, res) {
    const { body, file } = req;
    console.log(file);
    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");
    const documento = {
      Id: body.Id,
      LinkImagen: `file/img/${file.filename}`,
    };
    const result = await db.actualizar(Table, documento);
    res.redirect("/lDoc");
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    add,
    del,
    actualizar,
    actualizarD,
    actualizarI,
  };
};
