import express from "express";
const router = express.Router();
import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil, obtenerColaboradores, obtenerLideres,
    obtenerClientes, obtenerUsuariosApp, obtenerCliente, editarCliente, eliminarCliente } from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

//Rutas Publicas - Autenticación, Registro y Confirmación de Usuarios
router.get('/colaboradores', obtenerColaboradores)
router.get('/lideres', obtenerLideres)
router.get('/clientes', checkAuth, obtenerClientes)
router.route('/clientes/:id')
        .get(checkAuth, obtenerCliente)
        .put(checkAuth, editarCliente)
        .delete(checkAuth, eliminarCliente)
router.get('/', checkAuth, obtenerUsuariosApp)
router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

// Rutas Privadas - Obtener Perfil

router.get('/perfil', checkAuth, perfil)


export default router