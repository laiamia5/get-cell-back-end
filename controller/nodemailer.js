const nodemailer = require('nodemailer')

enviar_empresa = async (asunto, mensaje, email) => {

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'getcell.original@gmail.com',
            pass: 'ftnlcuhgkbaxkopk'
        }
    }

    const mensajeArmado = {
        from: email,
        to: 'getcell.original@gmail.com',
        subject: asunto ,
        text: mensaje
    }

    const transport = nodemailer.createTransport(config)

    const info = await transport.sendMail(mensajeArmado)

    console.log(info)
}

enviar_clientes = async (asunto, mensaje, clientaEmail) => {

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'getcell.original@gmail.com',
            pass: 'ftnlcuhgkbaxkopk'
        }
    }

    const mensajeArmado = {
        from: 'getcell.original@gmail.com',
        to: clientaEmail,
        subject: asunto,
        html: `
       
            <div style="background-color: #FFF3FC">
                <div>golaaaaaa<div>
                <hr/>
                <strong>strongggggg </strong>
                <p>parrafoooooooooo con letras blancas se supone</p>
            </div>
        `
    }

    const transport = nodemailer.createTransport(config)

    const info = await transport.sendMail(mensajeArmado)

    console.log(info)
}


module.exports = {enviar_clientes, enviar_empresa }