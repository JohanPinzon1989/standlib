const mysql = require("mysql2");
const config = require("../../config");

const dbconfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  insecureAuth: true,
};

let conexion;

function conmsql() {
  conexion = mysql.createConnection(dbconfig);

  conexion.connect((err) => {
    if (err) {
      console.log("[db err]", err);
      setTimeout(conmsql, 200);
    } else {
      //console.log("DB conectada!");
    }
  });
  conexion.on("error", (err) => {
    console.log("[db err]", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      conmsql();
    } else {
      throw err;
    }
  });
}

conmsql();

//Buscar perfil usuario
function findP(table, Id) {
  return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM ${table} WHERE Perfil = ? `, Id, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

//Buscar tenant
function findT(table, Id) {
  return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM ${table} WHERE Nombre_org = ? `, Id, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

module.exports = {
  findP,
  findT,
  conmsql,
};
