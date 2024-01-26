import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";


//Obtener usuarios Colaboradores
const obtenerColaboradores = async (req, res) => {
    const colaboradores = await Usuario.find().where('cargo').equals('Colaborador').select('-password -telefono -fechaIngreso -identificacion -confirmado -createdAt -updatedAt');
    res.json(colaboradores)
    
}

const obtenerUsuariosApp = async (req, res) =>{
    const usuariosApp = await Usuario.find({ $or: [{ cargo: 'Colaborador' }, { cargo: 'Lider' }] })
    .select('-password -fechaIngreso -confirmado -createdAt -updatedAt');
    res.json(usuariosApp)   
}

const obtenerLideres = async (req, res) => {
    const lideres = await Usuario.find().where('cargo').equals('Lider').select('-password -telefono -fechaIngreso -identificacion -confirmado -createdAt -updatedAt');
    res.json(lideres)
}

const obtenerClientes = async (req, res) => {
    const clientes = await Usuario.find().where('cargo').equals('Cliente').select('-password  -fechaIngreso  -confirmado -createdAt -updatedAt');
    res.json(clientes)
}

//Registrar Usuarios
const registrar = async  (req, res) => {

    //Evitar registros Duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId();
        await usuario.save()
        //Enviar email para confirmación
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: 'Usuario Creado Correctamente, revisa tu Email para confirmarlo'})
        
    } catch (error) {
        console.log(error);
    }

};

//Confirmar Cuenta
const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({token})

    if(!usuarioConfirmar){
        const error = new Error('Token no válido');
        return res.status(403).json({msg: error.message})
    }
    
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = " ";
        await usuarioConfirmar.save()
        res.json({msg: "Usuario Confirmado Correctamente"})
    } catch (error) {
        console.log(error);
    }
};

//Autenticar Usuario
const autenticar = async (req, res) => {
    const { email, password } = req.body

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message})
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('El usuario no esta confirmado');
        return res.status(400).json({msg: error.message})
    }

    //Comprobar si el password es correcto
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("El Password es Incorrecto");
        return res.status(403).json({msg:error.message});
    }
}

//Olvida contraseña correo
const olvidePassword = async (req, res) => {
    const { email } = req.body;
    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(403).json({msg: error.message})
    }
    try {
        usuario.token = generarId();
        await usuario.save();

        //Enviar email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error);
    }
}

// Comprobar Token para cambiar contraseña
const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Usuario.findOne({token})
    if(tokenValido){
        res.json({msg:"Token valido y el usuario existe"})
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message})
    }
}

//Nueva contraseña
const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password }= req.body
    const usuario = await Usuario.findOne({token})

    if(usuario){
        usuario.password = password;
        usuario.token= "";
        try {
            await usuario.save();
            res.json({msg:"Password Modificado Correctamente"})
        } catch (error) {
            console.log(error);
        }
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message})
    }
}

//Obtener prefil de sesion
const perfil = async (req, res) => {
    const { usuario } = req;
    res.json(usuario)
}


export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    obtenerColaboradores,
    obtenerLideres,
    obtenerClientes,
    obtenerUsuariosApp
};