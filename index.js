import  express  from "express";
import dotenv from "dotenv";
import cors from "cors"
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"


const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            //puede consultar la API
            callback(null, true);
        }else{
            //No esta permitido
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions));

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, ()=> {
    console.log(`Servidor Corriendo desde el puerto ${PORT}`);
});

// Socket.io
import { Server } from 'socket.io'

const io = new Server(servidor,{
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL,
    },
});

io.on('connection', (socket)=>{
    console.log('Conectado a socket.io');
    //Desfinir los eventos de socket io
    socket.on('abrir proyecto', (proyecto)=>{
        socket.join(proyecto);
    });

    socket.on ('nuevo proyecto', proyecto=>{
        socket.emit('proyecto agregado', proyecto)
    })

    socket.on('actualizar proyecto', proyecto => {
        socket.emit('proyecto actualizado', proyecto)
    })

    socket.on('eliminar proyecto', proyecto => {
        socket.emit('proyecto eliminado', proyecto)
    })
    
    socket.on('nueva tarea', tarea=>{
        const proyecto = tarea.proyecto;
        socket.emit('tarea agregada', tarea)
    })

    socket.on('eliminar tarea', tarea =>{
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('actualizar tarea', tarea =>{
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })


})