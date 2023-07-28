const {Router} = require('express')
const {subscribe} = require('../db')

const rutaSubscribe = Router()

// rutaSubscribe.post('/subscribirse', (req, res) => {
    
//  try{

//  }catch(err){

//  }
// })



rutaSubscribe.get('/subscribirse', async (req, res) => {
    try{
       let to = await subscribe.findAll()
       res.status(200).send(to)
    }catch(err){
        res.status(400).send('jh')
    }
})

module.exports = rutaSubscribe