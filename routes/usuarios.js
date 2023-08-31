const {Router} = require('express')
const { usuario } = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {enviar_clientes, enviar_empresa } = require('../controller/nodemailer')

const rutaUsuario  = Router()

// ---------------------------------------OBTENER TODOS LOS USUARIOS--------------------------------------

rutaUsuario.get('/', async (req, res) => {
    try{
        let data = await usuario.findAll()
        res.status(200).json(data)
    }
    catch(err){
        res.status(400).send('no')
    }
})

//--------------------------------------------CREAR USUARIO---------------------------------------------------------

rutaUsuario.post('/signup', async (req, res) => {

    const {admin, nombre, apellido, foto, email, contraseña, dni, codigo_postal, telefono, direccion_provincia, direccion_localidad, direccion_calles, direccion_barrio, registrado} = req.body

    const usuario_ingresante = await usuario.findOne({ where: { email }})
    try{
        let hash;
        if(contraseña) hash = await bcrypt.hash(contraseña, 10)

        if(usuario_ingresante == null || usuario_ingresante == undefined){
            let creacion = await usuario.create({
                nombre: nombre,
                apellido: apellido,
                email: email,
                contraseña: contraseña ? hash : null,
                dni: dni,
                telefono,
                direccion_provincia,
                direccion_localidad,
                direccion_barrio,
                direccion_calles,
                codigo_postal,
                foto,
                admin
             })
             res.status(200).send(creacion)
        }else{
            res.status(400).send('error! el usuario ya existe, inicia sesion con el mismo o crea una cuenta diferente')
        }
    }catch(err){
         res.status(400).send(err.message)
    }

 })

 //------------------------------------------LOGEAR USUARIO--------------------------------------------------

 rutaUsuario.post('/signin', async (req, res) => {
    
    const {email, contraseña} = req.body
    //---------buscar email en BDs----------------------
    const usuario_ingresante = await usuario.findOne({ where: { email: email }})
    if(usuario_ingresante == null) {
        res.status(400).send("el email ingresado no existe, revise nuevamente o cree un usuario")
        return 
    }
    //--------comparar contraseñas----------------------
    const comparar = await bcrypt.compare(contraseña, usuario_ingresante.contraseña)
    if(comparar == false){ 
        res.status(401).send('la contraseña que has escrito no es correcta, vuelve a intentarlo')
        return
    }
    //--------creacion del token-------------------------------------------
    const info = {
        id : usuario_ingresante.id,
        name: usuario_ingresante.nombre
    }
    const token = jwt.sign(info, process.env.SECRET_TOKEN, {expiresIn: "15d"})
    res.status(200).json({...usuario_ingresante.dataValues, token})

})

//--------------------------CONTROLLER QUE VERIFICA EL TOKEN--------------------------------

const verifyToken = (req, res, next) => {
    const authheader = req.headers['authorization']

    const token = authheader && authheader.split(' ')[1];
    console.log(authheader)

    if(token == null) return res.status(401).send('token requerido')

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {

        if(err) return res.status(403).send('token invalido')

        console.log(user)
        req.user = user
        next();
    })

}

// -------------------------------COMPLETAR INFORMACION DEL USUARIO-------------------------------------------

rutaUsuario.put('/:id', async (req, res) => {
    let idusuario = req.params.id
    const {nombre, apellido, email, contraseña, dni, codigo_postal, telefono, direccion_provincia, direccion_localidad, direccion_calles, direccion_barrio, registrado} = req.body
    try{
        const cambiarInfo = await usuario.update( {nombre, apellido, email, contraseña, dni, codigo_postal, telefono, direccion_provincia, direccion_localidad, direccion_calles, direccion_barrio, registrado} , { where: { id: idusuario } })
        res.status(200).send(cambiarInfo)
    }catch(err){
        res.status(400).send('los datos ingresados no son correctos')
    }
})

// -----------------------------OBTENER PERFIL DE USUARIO AL LOGUEAR------------------------------

rutaUsuario.get('/perfil/:token',  async (req, res) => { 

    const tokenUs = req.params.token

    jwt.verify(tokenUs, process.env.SECRET_TOKEN, async (err, user) => {

        if(err) return res.status(403).send('token invalido')
        else{ 
            let usuarioACt = await usuario.findByPk(user.id)
            return res.status(200).send(usuarioACt)
        }
    })

})

/////////////////////////////CONSULTAR ADMIN////////////////////////////////

rutaUsuario.get('/esAdmin/:id', async (req, res) => {
    const id = req.params.id
    try{
        let encuentra = await usuario.findByPk(id)
        encuentra.admin === true
        ? res.status(200).send(true)
        : res.status(200).send(false)
        
    }catch(err){
        res.status(400).send(null)
    }
})

///////////////////////////////////ENVIAR EMAIL/////////////////////////////////////////////////////////

rutaUsuario.post('/envio-mail', async (req, res) => {
    const {asunto, mensaje, email, destino} = req.body

    try{
        if(destino === 'empresa'){
            enviar_empresa(asunto, mensaje, email)
        }else{
            enviar_clientes(asunto, mensaje, email)
        }
        res.status(200).send('mensaje enviado con exito')
    }catch(err){
        res.status(400).send('error')
    }

})


//////////////////////////////CONSULTAR REGISTRO/////////////////////////////////////////////

rutaUsuario.get('/buscar/:dni', async (req, res) => {
    const {dni} = req.params
    try{
        let busquedaUser = await usuario.findOne({where: { dni: dni}}) 
        res.status(200).send(busquedaUser)
    }catch(err){
        res.status(400).send(err)
    }
})
module.exports = rutaUsuario