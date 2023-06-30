const dbE = require ('../../DB/queryEsp');

const Table = "perfil_usuario";


module.exports = function (dbInyect) {
  let db = dbInyect;

  if (!db) {
    db = require("../../DB/database");
  }

  function getAll() {
    return db.getAll(Table);
  }

  function findP(Id) {
    return dbE.findP(Table, Id);
  }

  function find(id) {
    return db.find(Table, id);
  }

  function agregar(body) {
    return db.agregar(Table, body);
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregar,
    del,
    findP
  };
};
