const Router = require('express')
const {producto} = require('../db')
const rutaProducto = Router()
const { Op } = require('sequelize');
const {paginar} = require('../controller/paginado')

// =====================================CREAR PRODUCTO==================================
rutaProducto.post('/', (req, res) => {
    const {nombre, precio, precioAnterior, categoria, descripcion , marca, stock, img} = req.body
    try{
        producto.create({
            nombre,
            precioAnterior,
            precio,
            marca, stock,
            img,
            descripcion,
            categoria
        })
        res.status(200).send('creado')
    }catch(err){
        res.status(400).send(err.message)
    }
})

// ======================================OBTENER PRODCUTOS ==================================================

rutaProducto.get('/', async (req, res) => {
    try{
       let todosLosProdcutos = await producto.findAll()
       res.status(200).json(todosLosProdcutos)
    }catch(err){
        res.status(400).send(err.message)
    }
})

// ==========================================BUSCAR PRODUCTO POR CON paginado====================================

rutaProducto.get('/buscar', async (req, res) => {
    const {nombre, categoria} = req.query
    try{
        let encontramos;
        if(nombre && categoria){
            encontramos = await producto.findAll({where: {
                nombre: {[Op.iLike]: `%${nombre}%`} ,
                categoria:  {[Op.iLike]: `%${categoria}%`}
            }})
        }else if(nombre && !categoria){
            encontramos = await producto.findAll({where: {
                nombre: {[Op.iLike]: `%${nombre}%`} ,
            }})
        }else if(!nombre && categoria){
            encontramos = await producto.findAll({where: {
                categoria:  {[Op.iLike]: `%${categoria}%`}
            }})
        }else{
            encontramos = await producto.findAll()
        }
        let paginado = await paginar(encontramos)
        res.status(200).send(paginado)
    }catch(err){
        res.status(400).send(err)
    }
})

// ==================================ACTUALIZAR PRODCUTOS====================================================

rutaProducto.put('/actualizar/:id', async (req, res) => {
    const {nombre, precio, precioAnterior, categoria, descripcion , marca, stock, img} = req.body
    try{
        let prodActualizado = await producto.update({nombre, precio, precioAnterior, categoria, descripcion , marca, stock, img}, {where: {id: id}})
        res.status(200).json(prodActualizado)
    }catch(err){
        res.status(400).send('no se ha logrado actualizar el producto')
    }
})

// ========================================== OBTENER UN PRODUCTO =====================================================

rutaProducto.get('/:id', async (req, res) => {
    const {id} = req.params
    try{
        let data = await producto.findOne({where: {id}})
        res.status(200).json(data)
    }
    catch(err){
        res.status(400).send(err)
    }
})

// ========================================== ELIMINAR UN PRODUCTO =====================================================

rutaProducto.delete('/:id', async (req, res) => {
    const {id} = req.params
    producto.destroy({
        where:{
            id: id
        }
    })
    try{
        res.status(200).send('borrado exitoso')
    }catch(err){
        res.status(400).send(err)
    }
})




module.exports = rutaProducto