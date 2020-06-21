// requieres
var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var bodyParser = require('body-parser');
var loginRoutes = require('./routes/login');

// inicializar variables
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/HospitalDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, },
    (err, res) => {
        if (err) throw err;

        console.log('Base de datos online');
    })


app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// app.get('/', (req, res, next) => {
//     return res.status(200).json({
//         ok: true,
//         mensaje: 'Peticion realizada correctamente'
//     });
// });



// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en el puerto 3000 online');
});