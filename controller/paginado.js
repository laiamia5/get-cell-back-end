////////////////////////////////////PAGINADO/////////////////////////////////////////////////////

const paginar = async (array) => {
    let productos = array
    let position = 0
    let result = []
        for (let i = 0; i < Math.ceil(productos.length / 8); i++) {
            if (!i) result.push(productos.slice(0,8))
            
            else result.push(productos.slice(position, position + 8))
            position += 8
        }
    return result
} 


module.exports = {paginar}