'use strict'

// CARGAR MODULO DE NODE PARA CREAR  SERVIDOR
let express = require ('express');
let bodyParser = require ('body-parser');
const router = require('./routes/article');

// EJECUTAR EXPRESS (http)

let app = express();

//CARGAR FICHEROS RUTAS
let articles_routes = require('./routes/article');

//CARGAR MIDDELWARE
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//AÑADIR PREFIJOS A RUTAS
app.use('/api', articles_routes);

//EXPORTAR MODULOS
module.exports = app;