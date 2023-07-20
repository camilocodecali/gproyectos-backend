import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
    },
    cargo: {
        type: String,
        required: true,
        enum: ["Lider", "Colaborador", "Admin"]
    },
    fechaIngreso: {
        type: Date,
        required: true,
        default: Date.now()
    },
    identificacion: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
    }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;