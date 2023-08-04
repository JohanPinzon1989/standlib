const Table = "industria";

module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../DB/database");
  }

  function getAll() {
    return db.getAll(Table);
  }

  function find(id) {
    return db.find(Table, id);
  }
//Actualizar industria
  async function updateI(req, res){
    const { body } = req;
    const industria={
      Id: body.Id,
      Industria:  body.Industria,
      Industria_ing: body.Industria_ing,
      Abreviacion: body.Abreviacion,
      Abreviacion_ing: body.Abreviacion_ing,
      Descripcion: body.Descripcion,
      Descripcion_ing: body.Descripcion_ing,
    }
    const ind = await db.agregar(Table, industria);
    res.redirect("/listInd");
  }
//Agregar industria
  async function agregarI(req, res){
    const { body } = req;
    const industria={
      Industria:  body.Industria,
      Industria_ing: body.Industria_ing,
      Abreviacion: body.Abreviacion,
      Abreviacion_ing: body.Abreviacion_ing,
      Descripcion: body.Descripcion,
      Descripcion_ing: body.Descripcion_ing,
    }
    const ind = await db.insertar(Table, industria);
    res.redirect("/listInd");
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregarI,
    updateI,
    del,
  };
};
