const {Router} = require('express')
const {pedido, producto} = require('../db')
const rutaPedido = Router()


rutaPedido.get('/', async (req, res) => {
    try{
        let espera = await pedido.findAll({include: {model: producto}})
        res.status(200).send(espera)
    }catch(err){
        res.status(400).send('salio mal')
    }
})

rutaPedido.post('/', async (req, res) => {

    const {cantidad, productoId} = req.body
    try{
        let algo = await pedido.create({
            cantidad,
        })
        await algo.setProducto(productoId)
        res.status(200).send(algo)
    }catch(err){
        res.send(err)
    }
})

module.exports = rutaPedido