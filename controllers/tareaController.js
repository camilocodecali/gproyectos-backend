import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";

//Agregar tarea
const agregarTarea = async (req, res) => {
    const {proyecto} = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg: error.message});
    }

    if(existeProyecto.lider.toString() !== req.usuario._id.toString()){
        const error = new Error("No tiene los permisos para crear tarea")
        return res.status(404).json({msg: error.message});
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        //Almacenar ID en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id.toString());
        await existeProyecto.save()
        res.json(tareaAlmacenada)

    } catch (error) {
        console.log(error);
    }
};

//Obtener tarea
const obtenerTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("colaborador");
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({msg: error.message});
    }
    /*
    if(tarea.proyecto.lider.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida")
        return res.status(404).json({msg: error.message});
    }
*/
    res.json(tarea)
};

//Actualizar tarea
const actualizarTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({msg: error.message});
    }
    if(tarea.proyecto.lider.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida")
        return res.status(404).json({msg: error.message});
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.estado = req.body.estado || tarea.estado;
    tarea.colaborador = req.body.colaborador || tarea.colaborador;
    tarea.fechaInicio = req.body.fechaInicio || tarea.fechaInicio;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }

};

//Eliminar tarea
const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({msg: error.message});
    }
    if(tarea.proyecto.lider.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida")
        return res.status(404).json({msg: error.message});
    }
    try {
        const proyecto = await Proyecto.findById(tarea.proyecto);
        proyecto.tareas.pull(tarea._id)

        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

        res.json({msg:"La Tarea se Elimino"})
    } catch (error) {
        console.log(error);
    }
};

//Cambiar estado tarea
const cambiarEstado = async (req, res) => {};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}