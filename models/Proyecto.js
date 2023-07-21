import mongoose, { mongo } from "mongoose"

const proyectoSchema = mongoose.Schema({
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

    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },

    lider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },

    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tarea',
        }
    ],
    estado: {
        type: String,
        required: true,
        enum: ["Finalizado", "Progreso", "Retrado"]
    },
    carpetaProyecto: {
        trype: String,
        trim: true
    }
},
{
    timestamps: true
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);
export default Proyecto;