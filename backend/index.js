'use strict'

let mongoose = require ('mongoose');

let app = require ('./app');
const port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api-rest-blog' , { useNewUrlParser:true, useUnifiedTopology: true }



)
.then(()=>{
    console.log('la conexion a la base de datos se ha realizado con exito!');

    // CREAR SERVIDOR Y ESCUCHAR PETICIONES HTTP

    app.listen(port, ()=>{
        console.log('el servidor esta conrriendo en  http://localhost:'+port);
    })
})