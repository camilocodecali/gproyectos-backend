import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now()
    },
    fechaEntrega: {
        type: Date,
        required: true,
        default: Date.now()
    },
    estado: {
        type: String,
        required: true,
        enum: ["Finalizado", "Progreso", "Retrasado"]
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        }
    ],
    linkRecursos: {
        type: String,
        trim: true,
    }
},
{
    timestamps: true
});

const Tarea = mongoose.model('Tarea', tareaSchema);
export default Tarea

