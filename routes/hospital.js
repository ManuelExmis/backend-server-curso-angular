var express = require('express');
var app = express();
var Hospital = require('./../models/hospital');
var mdAuthentication = require('./../middlewares/authentications');

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando hospitales',
                        err: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    return res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales: hospitales
                    });
                });
            });
});

app.post('/', mdAuthentication.varificaToken, (req, res) => {
    var body = req.body;
    var idUsuario = req.usuario._id;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: idUsuario
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear hospital',
                err: err
            });
        }

        return res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario
        });
    });
});

app.put('/:id', mdAuthentication.varificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar hospital',
                err: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                err: { mensaje: 'no existe un hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        // hospital.img = body.img;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar el hospital',
                    err: err
                });
            }

            return res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: req.usuario
            });
        });
    });
});

app.delete('/:id', mdAuthentication.varificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al borrar hospital',
                err: err
            });
        }

        return res.status(200).json({
            ok: true,
            hospital: hospitalBorrado,
            usuarioToken: req.usuario
        });
    });
});

module.exports = app;