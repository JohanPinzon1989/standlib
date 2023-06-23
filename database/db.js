const mysql = require("mysql");

const conexion = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
  insecureAuth: true,
});

conexion.connect((error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log("Conectado a BD");
});

module.exports = conexion;
