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

//AÑADIR PREFIJOS A RUTAS
app.use('/api', articles_routes);

//EXPORTAR MODULOS
module.exports = app;