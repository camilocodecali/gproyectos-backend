import mongoose from "mongoose"

const proyectoSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ["Web", "Diseño", "Redes Sociales"],
    },
    fechaInicio: {
        type: Date,
        default: Date.now()
    },
    fechaEntrega: {
        type: Date,
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
    estado: {
        type: String,
        required: true,
        enum: ["Finalizado", "Progreso", "Retrasado"],
    },
    tareas: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Tarea'
        }
    ],
    carpetaProyecto: {
        type: String,
        required: true,
        trim: true,
    }
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);
export default Proyecto;