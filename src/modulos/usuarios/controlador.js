const bcrypt = require("bcrypt");
const auth = require("../../auth");

const Table = "usuarios";

module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../DB/database");
  }

  async function login(username, password) {
    const data = await db.query(Table, { username: username });
    return bcrypt.compare(password, data.password).then((resultado) => {
      if (resultado === true) {
        return auth.asignarToken({ ...data });
      } else {
        throw new Error("informacion invalida");
      }
    });
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
      N_identificacion: body.N_identificacion,
      Nombre: body.Nombre,
      Apellido: body.Apellido,
      Email: body.Email,
      Num_Fijo: body.Num_Fijo,
      Num_Celular: body.Num_Celular,
      Estado: body.Estado,
      Estado_ing: body.Estado_ing,
      username: body.username,
      password: await bcrypt.hash(body.password, 8),
      //Publicidad: body.Publicidad,
      //Tipo_Identificacion_Id: body.Tipo_Identificacion_Id,
      //Tenant_Id: body.Tenant_Id,
      //Estado_provincia_Id: body.Estado_provincia_Id,
      //Perfil_Usuario_Id: body.Perfil_Usuario_Id
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
    login,
  };
};
