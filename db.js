const {Sequelize} = require('sequelize')
const usuarios = require('./models/usuarios')
const compras = require('./models/compras')
const pedidos = require('./models/pedido') 
const productos = require('./models/productos')
require('dotenv').config()

let usuarioDB = process.env.DB_USER
let contraseña = process.env.DB_PASSWORD
let host = process.env.DB_HOST
let tipo_db = process.env.DB_TIPO
let nombre_db = process.env.DB_NOMBRE
// postgresql  ://   postgres   :  KnNWaWBNFbjWqk7U8poB   @  containers-us-west-157.railway.app:7545  /  railway
const database = new Sequelize(`postgres://${usuarioDB}:${contraseña}@${host}/${nombre_db}`, {logging: false} )

usuarios(database)
compras(database)
pedidos(database)
productos(database)

const {producto, usuario, pedido, compra} = database.models

producto.hasMany(pedido,{
    foreignKey:'productoId'
  })
  pedido.belongsTo(producto);
  
  compra.belongsToMany(pedido, {through: 'compra-pedidos'});
  pedido.belongsToMany(compra, {through: 'compra-pedidos'});
  
  usuario.hasMany(compra,{
    foreignKey:'usuarioId'
  })
  compra.belongsTo(usuario);

module.exports = {database, producto, usuario, pedido, compra}