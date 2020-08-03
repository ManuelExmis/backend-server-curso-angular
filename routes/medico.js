var express = require('express');
var app = express();
var Medico = require('./../models/medico');
var mdAuthentication = require('./../middlewares/authentications');

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando medicos',
                        err: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    return res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos: medicos
                    });
                });
            });
});

app.post('/', mdAuthentication.varificaToken, (req, res) => {
    var body = req.body;
    let idUsuario = req.usuario._id;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: idUsuario,
        hospital: body.hospital
    });


    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear medico',
                err: err
            });
        }

        return res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });
    });
});

app.put('/:id', mdAuthentication.varificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar medico',
                err: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                err: { mensaje: 'no existe un medico con ese id' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar el medico',
                    err: err
                });
            }

            return res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                usuarioToken: req.usuarioToken
            });
        });
    });
});

app.delete('/:id', mdAuthentication.varificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al borrar medico',
                err: err
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoBorrado,
            usuarioToken: req.usuarioToken
        });
    });
});

module.exports = app;