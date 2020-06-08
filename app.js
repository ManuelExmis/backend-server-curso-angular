// requieres
var express = require('express');
var mongoose = require('mongoose');



// inicializar variables
var app = express();


// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos online');
})


app.get('/', (req, res, next) => {
    return res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});



// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en el puerto 3000 online');
});