const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");
const perUs = require('../perfilUsuario/rutas');

const Table = "tenant";

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

    var fecha = require("moment");
    var hoy = fecha().format("YYYY-MM-DD");

    const tenant = {
      Nombre: body.Nombre_org,
      Nom_Contacto: body.Nombre +" "+ body.Apellido,
      Dominio: body.Dominio,
      Tel_contacto: body.Num_Fijo,
      Email: body.Email,
      Email_facturacion: body.Email_facturacion,
      Estado: "Activo",
      NumUsrRegistrados: 1,
      Fecha_creacion: `${hoy}`
    };

    const ten = await db.agregar("tenant",tenant);
    const perU = await perUs.findP("admin");

    const usuario= {
      Nombre: body.Nombre,
      Apellido: body.Apellido,
      Email: body.Email,
      Num_Fijo: body.Num_Fijo,
      Num_Celular: body.Num_Celular,
      Estado: "Activo",
      Estado_ing: "Active",
      password: await bcrypt.hash(body.password, 8),
      Publicidad: body.Publicidad,
      Tenant_Id: ten.Id,
      Estado_provincia_Id: body.Estado_provincia_Id,
      Perfil_Usuario_Id: perU.Id
    };
    return await db.agregar(Table, usuario);
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    findP,
    agregar,
    del
  };
};
