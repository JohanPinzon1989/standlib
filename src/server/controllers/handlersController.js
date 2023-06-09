const connection = require('express-myconnection');
const mysql = require('mysql');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err; //no conectado
        console.log('Connected as ID ' + connection.threadId);
            //Usar la coneccion
            connection.query('SELECT * FROM Usuarios', (err, rows) =>{
                connection.release();
                if(!err) {
                    res.render('home', { rows,
                        title: "STANDLIB", });
                }else {
                    console.log(err);
                }
                console.log('El dato para la tabla: \n', rows);
            });
    });
}

//Buscar usuario mediante campo de busqueda
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err; //no conectado
        console.log('Connected as ID ' + connection.threadId);
        let searchTerm = req.body.buscar;
        console.log(searchTerm);
            //Usar la coneccion
            connection.query('SELECT * FROM Usuarios WHERE username LIKE ? OR Nombre LIKE ? OR Apellido LIKE ?',
             ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) =>{
                connection.release();
                if(!err) {
                    res.render('home', { rows,
                        title: "STANDLIB", });
                }else {
                    console.log(err);
                }
                //console.log('El dato para la tabla: \n', rows);
            });
    });
}