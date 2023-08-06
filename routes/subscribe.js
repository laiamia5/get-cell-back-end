const {Router} = require('express')
const {subscribe} = require('../db')

const rutaSubscribe = Router()

rutaSubscribe.post('/', async (req, res) => {
    const {email, nombre} = req.body
    try{
        let user = await subscribe.create({
            email,
            nombre
        })
        res.status(200).send(`${nombre} se subscribio con exito`)
    }catch(err){
        res.status(400).send(err.message)
    }
})

rutaSubscribe.get('/', async (req, res) => {
    try{
       let to = await subscribe.findAll()
       res.status(200).send(to)
    }catch(err){
        res.status(400).send('jh')
    }
})

module.exports = rutaSubscribe