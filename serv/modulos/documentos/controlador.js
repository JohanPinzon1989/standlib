const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");

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

  async function agregar(body) {
    const usuario = {
      Id: body.ID,
      Nombre: body.Nombre,
      Apellido: body.Apellido,
      Email: body.Email,
      Num_Fijo: body.Num_Fijo,
      Num_Celular: body.Num_Celular,
      Estado: body.Estado,
      password: await bcrypt.hash(body.password, 8),
      Publicidad: body.Publicidad,
      Tenant_Id: body.Tenant_Id,
      Estado_provincia_Id: body.Estado_provincia_Id,
      Perfil_Usuario_Id: body.Perfil_Usuario_Id,
    };
    return db.agregar(Table, usuario);
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregar,
    del,
  };
};
