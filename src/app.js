const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const LoginRoutes = require('./server/routes/login');
const { connect } = require('http2');
const connection = require('express-myconnection');

require('dotenv').config();

const app = express();

//Parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

//Parse aplications/JSON
app.use(bodyParser.json());

//Static files
app.use(express.static('public'));

//Templating Engine
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//Connect to BD
pool.getConnection((err, connection) => {
    if(err) throw err; //no conectado
    console.log('Connected as ID ' + connection.threadId);
});

const routes = require('./server/routes/handlers');
app.use('/', routes);

app.set('port', 4000);
app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});



app.set('views', __dirname + '/views');

app.use('/', LoginRoutes);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));