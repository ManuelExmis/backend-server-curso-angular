var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
const medico = require('../models/medico');

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    let fn = '';

    if (tabla === 'hospital') {
        fn = buscarHospitales;
    } else if (tabla === 'medico') {
        fn = buscarMedicos;
    } else {
        fn = buscarUsuarios;
    }

    fn(regex)
        .then(resultados => {
            res.status(200).json({
                ok: true,
                [table]: resultados
            });
        }).catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'error cargando hospitales',
                err: err
            });
        });
});

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ]).then(resultados => {
        res.status(200).json({
            ok: true,
            hospitales: resultados[0],
            medicos: resultados[1],
            usuarios: resultados[2]
        });
    }).catch(err => {
        res.status(500).json({
            ok: false,
            mensaje: 'error cargando hospitales',
            err: err
        });
    });
});

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('hospital')
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;