const {Router} = require('express')
const mercadopago = require('mercadopago')
require('dotenv').config()
const { setearCompra } = require('./paginado.js')

const payRouter = Router()
let token = process.env.ACCES_TOKEN_MP

payRouter.post('/:idCompras', async (req, res) => {
    // const {nombre, precio, categoria, descripcion, marca, cantidad, colores, talles} = req.body
    let preferenceId;
    const {idCompras} = req.params

    mercadopago.configure({
        access_token: token
    })

    //declaro la preferencia
    let preference = {
        items: [],
        back_urls: {
			"success": `http://localhost:3001/pagar/succes/${idCompras}`,
			"failure": "http://localhost:3001/pagar/feedback",
			"pending": "http://localhost:3001/pagar/feedback"
		},
		auto_return: "approved",
    }

    //tengo que meter las props que faltan en algun lugar para dar mas info de producto
    await req.body.forEach((e) => {
        preference.items.push({
            title: e.producto.nombre,
            description: e.producto.descripcion ? e.producto.descripcion : "sin descripcion",
            currency_id: "$",
            quantity: e.cantidad,
            unit_price: e.producto.precio
        })
    })

    //creo la prefencia
    await mercadopago.preferences.create(preference)
    .then((r) =>  {
        console.log(r.body)
        preferenceId = r.body.id
        res.status(200).send(r.body.init_point)
    }) 
    .catch((err) => console.log(err))

})

payRouter.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

payRouter.get('/succes', function (req, res) {
    const {idCompras} = req.params
    setearCompra(idCompras)

    res.send(`
    <!DOCTYPE html>
            <html>            
              <head>
                <title>Mi página HTML</title>
              </head>
              <body style="background-color: black; display: flex; margin-top: 80px; flex-direction: column; align-items: center;">
                <div style="display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid black; border-radius: 20px; background-color: #ffffff; padding: 20px;"">
                  <a style="margin-bottom: 10px;" href="http://localhost:3000/"><svg class='succes_svg' width="50px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path style="fill:#232326" d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" data-name="Left"/></svg></a>
                    <h1 style="margin-bottom: 10px;" >Payment Successful</h1>
                    <img style="max-width: 100%; margin-bottom: 10px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_xXsXXnglKn4YmVFVx39Pd-0LgWqhiUVk5g&usqp=CAU" alt="" class='succes_img'>
                    <a style="margin-bottom: 10px;" class="succes_a">Keep Buying</a>
                    <p style="margin-bottom: 10px;" class="succes_p">COMPUTER STORE</p>
                    <ul style="margin-bottom: 10px; list-style-type: none;" class="succes_ul">          
                      <li class="succes_li">Payment ID: ${req.query.payment_id}</li>
                      <li class="succes_li">Status: ${req.query.status}</li>
                      <li class="succes_li">Merchant Order ID: ${req.query.merchant_order_id}</li>
                  </ul>
                </div>
              </body>
            </html>
    `);
});


module.exports = payRouter