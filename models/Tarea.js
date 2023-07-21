import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        trype: String,
        trim: true,
        required: true
    },
    descripcion: {
        trype: String,
        trim: true,
        required: true
    },
    fechaInicio: {
        trype: Date,
        required: true,
        default: Date.now()
    },
    fechaEntrega: {
        trype: Date,
        required: true,
        default: Date.now()
    },
    estado: {
        type: String,
        required: true,
        enum: ["Finalizado", "Progreso", "Retrado"]
    },
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        }
    ],
    linkRecursos: {
        trype: String,
        trim: true,
    }
},
{
    timestamps: true
});

const Tarea = mongoose.model('Tarea', tareaSchema);
export default Tarea

