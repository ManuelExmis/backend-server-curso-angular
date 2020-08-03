// requieres
var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var bodyParser = require('body-parser');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

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


// serve index
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'));
//app.use('/uploads', serveIndex(__dirname + '/uploads'));


app.set('raiz', __dirname);

app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
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