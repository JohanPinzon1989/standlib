const Table = "pais_estadoprovincia";

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

  // Agregar Pais region
  async function agregarP(req, res) {
    const { body } = req;
    const pais = {
      Pais: body.Pais,
      PaisEng: body.PaisEng,
      Departament: body.Departament,
      CiudadProvincia: body.CiudadProvincia,
      Longitud: body.Longitud,
      Latitud: body.Latitud,
    }
    const p = await db.insertar(Table, pais);
    res.redirect("/listPaReg")
  }
  
// Actualizar Pais region
  async function updateP(req, res) {
    const { body } = req;
    const pais = {
      Id: body.Id,
      Pais: body.Pais,
      PaisEng: body.PaisEng,
      Departament: body.Departament,
      CiudadProvincia: body.CiudadProvincia,
      Longitud: body.Longitud,
      Latitud: body.Latitud,
    }
    const p = await db.actualizar(Table, pais);
    res.redirect("/listPaReg")
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregarP,
    updateP,
    del,
  };
};
