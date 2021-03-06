var mongoose = require('mongoose');
var uniqueValidators = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var RolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: RolesValidos },
    google: { type: Boolean, required: true, default: false }
});

usuarioSchema.plugin(uniqueValidators, { message: '{PATH} debe se único' });

module.exports = mongoose.model('Usuario', usuarioSchema);