import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

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
        const usuarioAlmacenado = await usuario.save()
        res.json(usuarioAlmacenado)
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
}

export {
    registrar,
    autenticar,
    confirmar
};