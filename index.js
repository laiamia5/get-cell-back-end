const cors = require('cors')
const express = require('express')
const rutaProducto = require('./routes/productos')
const rutaCompras = require('./routes/compras')
const rutaPedido = require('./routes/pedidos')
const rutaUsuario = require('./routes/usuarios')
const passportG = require('./controller/passport-google')
const rutaSubscribe = require('./routes/subscribe')
require('dotenv').config()
const app = express()
const {database} = require('./db')
const rutaCupon = require('./routes/cupones')
const payRouter = require('./controller/mercadopago')

//middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

//aca hirian las rutas 
app.use('/cupones', rutaCupon)
app.use('/productos', rutaProducto)
app.use('/compras', rutaCompras)
app.use('/realizar-pedido', rutaPedido )
app.use('/usuarios', rutaUsuario)
app.use('/subscribe', rutaSubscribe)
app.use('/pagar', payRouter)
app.use('/', passportG)

database
.sync({alter: true})
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`se escucha todfo en el puerto ${process.env.PORT}`); 
    });
});