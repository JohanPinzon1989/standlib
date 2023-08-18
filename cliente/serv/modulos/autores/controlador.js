const documentos = require("../documentos");

const Table = "autores";

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
  //Actualizar Autor
  async function updateAT(req, res) {
    const { body } = req;
    const autor = {
      Id: body.Id,
      Autor: body.Autor,
      Descripcion: body.Descripcion,
      Estado: body.Estado,
    };
    
    const fndA = await db.find(Table, autor.Id);
    for (var count = 0; count < fndA.length; count++) {
      const aut = {
        Id: fndA[count].Id,
        Autor: fndA[count].Autor,
      };
      const fnd = await db.findAutor("documentos", aut);

      for (var count1 = 0; count1 < fnd.length; count1++) {
        const documento = {
          Id: fnd[count1].Id,
          Autor: autor.Autor,
        };
        const act = await db.actualizar("documentos", documento);
      }
    }
    const ind = await db.actualizar(Table, autor);
    res.redirect("/listAuth");
  }

  //Agregar Autor
  async function agregarAt(req, res) {
    const { body } = req;
    const autor = {
      Autor: body.Autor,
      Descripcion: body.Descripcion,
      Estado: body.Estado,
    };

    const fnd = await db.findAutor(Table, autor);

    let a;
    for (var count = 0; count < fnd.length; count++) {
      a = fnd[count].Id;
    }

    if (a > 0) {
      console.log("El autor ya existe");
      res.redirect("/listAuth");
    } else {
      const ind = await db.insertar(Table, autor);
      res.redirect("/listAuth");
    }
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregarAt,
    updateAT,
    del,
  };
};
