const mysql = require("mysql2");
const config = require("../config");

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
      console.log("DB conectada!");
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

function agregar(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "INSERT INTO " + table + " SET ? ON DUPLICATE KEY UPDATE ?",
      [data, data],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
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

function query(table, consult) {
  return new Promise((resolve, reject) => {
    conexion.query(
      "SELECT * FROM " + table + " WHERE username = ?",
      consult,
      (error, result) => {
        return error ? reject(error) : resolve(result[0]);
      }
    );
  });
}

module.exports = {
  getAll,
  find,
  agregar,
  del,
  query,
  conmsql,
};
