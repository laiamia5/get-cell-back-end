const cors = require('cors')
const express = require('express')
const rutaProducto = require('./routes/productos')
const rutaCompras = require('./routes/compras')
const rutaPedido = require('./routes/pedidos')
const rutaUsuario = require('./routes/usuarios')
const passportG = require('./controller/passport-google')
require('dotenv').config()
const app = express()
const {database} = require('./db')

//middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

//aca hirian las rutas 
app.use('/productos', rutaProducto)
app.use('/compras', rutaCompras)
app.use('/realizar-pedido', rutaPedido )
app.use('/usuarios', rutaUsuario)
app.use('/', passportG)

database
.sync({alter: true})
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`se escucha todfo en el puerto ${process.env.PORT}`); 
    });
});