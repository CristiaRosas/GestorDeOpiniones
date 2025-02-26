import {Schema, model} from "mongoose";

const UserSchema = Schema({
    name : {
        type: String,
        required: [true, 'Se requiere nombre de usuario'],
        maxLength: [25, 'No se pueden superar los 25 caracteres.']
    },

    surname : {
        type: String,
        required: [true, 'Apellido requerido'],
        maxLength: [25, 'No se pueden superar los 25 caracteres.']
    },

    username : {
        type: String,
        unique: true
    },

    email: {
        type: String,
        required: [true, 'Se requiere correo electrónico'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Se requiere contraseña'],
        minLength: 8
    },

    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },

    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);