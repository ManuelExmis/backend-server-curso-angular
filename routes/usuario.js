var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('./../config/config').SEED;
var mdAuthentication = require('./../middlewares/authentications');
const usuario = require('../models/usuario');

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando usuario',
                    err: err
                });
            }

            return res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});



app.post('/', mdAuthentication.varificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear usuario',
                err: err
            });
        }

        return res.status(201).json({
            ok: true,
            body: usuarioGuardado,
            usuarioToke: req.usuarioToken
        });
    });
});

app.put('/:id', mdAuthentication.varificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                err: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                err: { message: 'no existe un usuario con ese Id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar el usuario',
                    err: err
                });
            }

            return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuarioToken
            });
        });
    });
});

app.delete('/:id', mdAuthentication.varificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                err: err
            });
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
            usuarioToken: req.usuarioToken
        });
    });
});

module.exports = app;