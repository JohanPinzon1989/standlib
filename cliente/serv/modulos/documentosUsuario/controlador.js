const { contains } = require("jquery");

const Table = "usuario_documentos";

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

  function agregar(body) {
    return db.agregar(Table, body);
  }

  async function asignarDocUC(req, res) {
    const { body } = req;
    let doc;
    let us = body.Usuarios
    let b = body.Documento.length
       for (var count = 0; count < b; count++) {
          doc = body.Documento[count]; 
          const documetoUs = {
            IdUsuario: us,
            IdDocumentos: doc,
          }
          //Valida si el doscumento ya fue asignado
          const asig = await db.findADU("usuario_documentos", documetoUs);
          let docUs;
          for (var count1 = 0; count1 < asig.length; count1++) {
            docUs = await asig[count1].Id;;
          }
          if (docUs > 0) {
            console.log("ya fue asignado");
          } else {
            //Enviar datos a Base de Datos
            const result = await db.agregar("usuario_documentos", documetoUs);
          }
          
        }  
        res.redirect("/asnor");
  }

  function del(body) {
    return db.del(Table, body.Id);
  }
  return {
    getAll,
    find,
    agregar,
    del,
    asignarDocUC,
  };
};
