import express from 'express'
import {
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
} from "../controllers/proyectoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
    .route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto);

router.get('/asignados',checkAuth, obtenerProyectosUsuario);

router
    .route('/:id')
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto);

router.get('/tareas/:id', checkAuth, obtenerTareas);

router.post('/lideres', checkAuth, buscarLideres);
router.post('/lideres/:id', checkAuth, agregarLider);
router.post('/eliminar-lider/:id', checkAuth, eliminarLider)


export default router;