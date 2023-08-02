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

function getAll(table) {
  return new Promise((resolve, reject) => {
    conexion.query("SELECT * FROM " + table, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function find(table, id) {
  return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM ${table} WHERE Id=${id}`, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}
function findTU(table, id) {
  return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM ${table} WHERE IdC = ${id}`, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

//Valida asignacion de documento Factura
function findAD(table, body) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT * FROM ${table} WHERE IdTenant=${body.IdTenant} AND IdDocumentos=${body.IdDocumentos} AND IdFactura=${body.IdFactura}`,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

//Valida asignacion de documento Usuario
function findADU(table, body) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT * FROM ${table} WHERE IdUsuario=${body.IdUsuario} AND IdDocumentos=${body.IdDocumentos}`,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function findUsOrg(table, email) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT * FROM ${table} WHERE ?`,
      email,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}
function findUsCli(table, email) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT * FROM ${table} WHERE Email=?`,
      email,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function insertar(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query("INSERT INTO " + table + " SET ?", data, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}
function actualizar(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "UPDATE " + table + " SET ? WHERE Id = ?",
      [data, data.Id],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}
function actualizarTU(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "UPDATE " + table + " SET ? WHERE IdC = ?",
      [data, data.IdC],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}
function actualizard(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "UPDATE " + table + " SET ? WHERE Id = ?",
      [data, data.Id],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function agregar(table, data) {
  if (!data.Id) {
    return insertar(table, data);
  } else {
    return actualizar(table, data);
  }
}

function del(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "DELETE FROM " + table + " WHERE Id = ?",
      data,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}
function delt(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "DELETE FROM " + table + " WHERE Token = ?",
      data,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function query(table, consult) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "SELECT * FROM " + table + " WHERE Email = ?",
      consult,
      (error, result) => {
        return error ? reject(error) : resolve(result[0]);
      }
    );
  });
}

module.exports = {
  getAll,
  agregar,
  del,
  query,
  conmsql,
  find,
  findUsOrg,
  actualizar,
  actualizard,
  findAD,
  insertar,
  delt,
  findTU,
  actualizarTU,
  findUsCli,
  findADU
};
