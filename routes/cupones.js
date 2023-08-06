const {Router} = require('express')
const {cupon} = require('../db')
const rutaCupon = Router()


rutaCupon.get('/', async (req, res) => {
    try{
       let to = await cupon.findAll()
       res.status(200).send(to)
    }catch(err){
        res.status(400).send(err.message)
    }
})

rutaCupon.post('/', (req, res) => {
    const {razon, numero, usado} = req.body
    try{
        cupon.create({
            razon,
            numero,
            usado
        })
        res.status(200).send('cupon creado')
    }catch(err){
        res.status(400).send(err.message)
    }
})

module.exports = rutaCupon