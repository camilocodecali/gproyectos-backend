import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {

    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    
      //Información del email
      const info = await transport.sendMail({
        from: '"CProyect - Administrador de Proyectos" <cuentas@cproyect.com>',
        to: email,
        subject: "CProyect - Confirma tu cuenta",
        text: "Comprueba tu cuenta en CProyect",
        html: `<p>Hola: ${nombre} Confirma tu cuenta en Uptask</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 
        
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        </p>
        <p>Si tu no creaste esta cuenta, puedes ingnorar el mensaje.</p>
        
        `,
      })
}

export const emailOlvidePassword = async (datos) => {

  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    //Información del email
    const info = await transport.sendMail({
      from: '"CProyect - Administrador de Proyectos" <cuentas@cproyect.com>',
      to: email,
      subject: "CProyect - Nueva Contraseña",
      text: "Comprueba tu cuenta en CProyect",
      html: `<p>Hola: ${nombre} Nueva Contraseña CProyect</p>
      <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 
      
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Nueva Contraseña</a>
      </p>
      <p>Si tu no intentas recuperar contraseña, puedes ingnorar el mensaje.</p>
      
      `,
    })
}