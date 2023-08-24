import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js";

//Obtener Proyectos
const obtenerProyectos = async (req,res) => {
    const proyectos = await Proyecto.find().populate({path: 'lider'})
    .populate("cliente", "nombre email");
    
    


    res.json(proyectos)
}

//Obtener Proyectos por usuario
const obtenerProyectosUsuario = async (req,res) => {
    const proyectos = await Proyecto.find().where('lider').equals(req.usuario).select('-tareas').populate({path: 'lider'})
    .populate("cliente", "nombre email");

    res.json(proyectos)
}

//Nuevo proyecto
const nuevoProyecto = async (req,res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.lider = req.usuario._id
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

//Obtener Proyecto
const obtenerProyecto = async (req,res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id).populate({path: 'tareas', populate:{path:'colaborador', select:'nombre'}})
    .populate("cliente", "nombre email").populate('lider');

    
    if(!proyecto){
        const error = new Error("No encontrado")
        return res.status(404).json({msg: error.message});
    }





    res.json(proyecto);

}

//Editar proyecto
const editarProyecto = async (req,res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id)
    if(!proyecto){
        const error = new Error("No encontrado")
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.lider.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida")
        return res.status(401).json({msg: error.message});
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaInicio = req.body.fechaInicio || proyecto.fechaInicio;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.estado = req.body.estado || proyecto.estado;
    proyecto.carpetaProyecto = req.body.carpetaProyecto || proyecto.carpetaProyecto;
    proyecto.lider = req.body.lider || proyecto.lider;
    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

//Eliminar proyecto
const eliminarProyecto = async (req,res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id)
    if(!proyecto){
        const error = new Error("No encontrado")
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.lider.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida")
        return res.status(401).json({msg: error.message});
    }

    try {
        await proyecto.deleteOne();
        res.json({msg:"Proyecto Eliminado"})
    } catch (error) {
        console.log(error);
    }
}

//Buscar Lideres
const buscarLideres = async (req,res) => {

}

//Agregar Lider
const agregarLider = async (req,res) => {

}

//Eliminar Lider
const eliminarLider = async (req,res) => {

}

//Obtener tareas
const obtenerTareas = async (req,res) => {
    const {id} = req.params;
    const existeProyecto = await Proyecto.findById(id);

    if(!existeProyecto){
        const error = new Error("No encontrado")
        return res.status(404).json({msg: error.message});
    }
    //Tiene que ser lider o colaborador del proyecto o tareas
    const tareas = await Tarea.find().where('proyecto').equals(id);
    res.json(tareas)
}

export {
    obtenerProyectos,
    obtenerProyectosUsuario,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarLideres,
    agregarLider,
    eliminarLider,
    obtenerTareas
}