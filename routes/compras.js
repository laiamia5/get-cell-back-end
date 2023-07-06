const {Router} = require('express')
const {compra, producto, pedido, usuario} = require('../db')

const rutaCompras = Router()

// ================================OBTENER COMPRAS ==================================

rutaCompras.get('/', async (req, res) => {
    try{
        let todas_las_compras = await compra.findAll({
            include: [
               { model: pedido,
                through:{
                    attributes: []
                },
                include: {model: producto}},
                {model: usuario}
            ],
            })
        res.status(200).json(todas_las_compras)
    }catch(err){
        res.status(400).send(err.message)
    }
})

//============================ REALIZAR COMPRA ========================================

rutaCompras.post('/', async (req, res) => {
    const {entrega, pago, medio_de_pago, monto_final, pedidos, usuarioId} = req.body

    try{
       let realizar_compra = await compra.create({
        entrega,
        pago,
        medio_de_pago,
        monto_final       
       })
       await realizar_compra.addPedido(pedidos) 
       await realizar_compra.setUsuario(usuarioId)

       let complit = await compra.findOne({
        where: { id: realizar_compra.id },
        include: [
            { model: pedido,
             through:{
                 attributes: []
             },
             include: {model: producto}},
             {model: usuario}
         ],
        })
        
       res.status(200).send(complit)
    }catch(err){
       res.status(400).send(err.message)
    }
})

// ======================BUSCAR COMPRA POR ID========================================

rutaCompras.get('/:id', async (req, res) => {

    const { id } = req.params

    try{
        const cmpra = await compra.findOne({where: { id }, include :[ {model: usuario}, {model: pedido}]})
       res.status(200).send(cmpra)

    }catch(err){
       res.status(400).send(err.message)
    }
})

//que muestre lña tabla de usurios 

module.exports = rutaCompras