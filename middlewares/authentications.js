var jwt = require('jsonwebtoken');
var SEED = require('./../config/config').SEED;

module.exports.varificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrencto',
                error: err
            });
        }

        req.usuario = decoded.usuario;

        // console.log('USUARIO TOKE: ', req.usuarioToken);

        next();
    });
};