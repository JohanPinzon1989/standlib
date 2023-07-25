const bcrypt = require("bcrypt");
const auth = require("../../auth");
const jwt = require("jsonwebtoken");
const { use } = require("./rutas");
const perUs = require("../../DB/queryEsp");
const { render } = require("ejs");
const { application } = require("express");

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
      Id: null,
      Nombre_org: body.Nombre_org,
      Nom_Contacto: body.Nombre + " " + body.Apellido,
      Dominio: body.Dominio,
      Tel_contacto: body.Num_Fijo,
      Email: body.Email,
      Email_facturacion: body.Email_facturacion,
      Estado: "Activo",
      Fecha_creacion: `${hoy}`,
    };

    const ften = await db.findUsOrg("tenant", tenant.Email);
    const fus = await db.findUsOrg("usuarios", tenant.Email);
    let Id;
    for (var count = 0; count < ften.length; count++) {
      Id = ften[count].Id;
    }
    let d = { Id: 1 };
    let u = { Id: 2 };
    if (Id > 0) {
      console.log(Id);
      console.log(d);
      return d;
    } else {
      for (var count = 0; count < fus.length; count++) {
        Id = fus[count].Id;
      }
      console.log(Id);
      if (Id > 0) {
        console.log(u);
        return await db.findUsOrg("usuarios", tenant.Email);
      } else {
        const ten = await db.agregar("tenant", tenant);
        console.log(ten.insertId);

        const usuario = {
          Id: null,
          Nombre: body.Nombre,
          Apellido: body.Apellido,
          Email: body.Email,
          Num_Fijo: body.Num_Fijo,
          Num_Celular: body.Num_Celular,
          Estado: "Activo",
          Estado_ing: "Active",
          password: await bcrypt.hash(body.password, 8),
          Perfil: "Administrador",
          Publicidad: body.Publicidad,
          Tenant_Id: ten.insertId,
          Estado_provincia: body.EstPrv,
        };
        return await db.agregar("usuarios", usuario);
      }
    }
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
