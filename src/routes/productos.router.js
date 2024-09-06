const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { productManagerMongo } = require('../manager/products.Manager.mongo');

const router = Router();
const productService = new productManagerMongo();

//creo la clase de productos
class Producto {
    constructor(id, nombre, precio, descripcion,stock,category,estado,codigo) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.stock = stock;
        this.category = category;
        this.estado = true;
        this.codigo = codigo;    
    }
}
//el array que voy a guardar los productos y que voy a mostrar
let productos = [];
// Leer productos del archivo JSON 
const readProductosFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../productos.json'), 'utf8');
        productos = JSON.parse(data);
    } catch (err) {
        productos = [];
    }
};

// Escribir productos al archivo JSON
const writeProductosToFile = (productos) => {
    fs.writeFileSync(path.join(__dirname, '../productos.json'), JSON.stringify(productos, null, 4));
};
//leo el archivo al iniciar 
readProductosFromFile();

//obtener todos los productos 
router.get('/', async (req, res) => {
    try{
        const products =await productService.getProducts();
        res.send({status:'success', payload: {products}})
    }catch(error){
        console.log(error)
    }
});



//obtener un producto por id
router.get('/:pid', async(req, res) => {
    const {pid} = req.params;
    try{
        const productoAMostrar = await productService.getProduct(pid)
        res.send({status:'success', payload: productoAMostrar })
    }
    catch(error){
      console.log(error)
    }
});

//cargar 1 producto nuevo
router.post('/', async(req, res) => {
    try{
        const { body } = req;
        if (!body.nombreProducto || !body.stockProducto ||!body.codigoProducto) {
            return res.status(400).send({ status: 'error', error: 'faltan datos' });
        }
        const result  = await productService.createProduct(body)
        res.status(200).send({ data: result });
    }
    catch(e){
     console.log(e);
    } 
});

//editar de a un producto
router.put('/:pid', async (req, res) => {
  const {pid} = req.params
  try{
    let productoAEditar = req.body
    if (!productoAEditar.nombreProducto || !productoAEditar.stockProducto ||!productoAEditar.codigoProducto) {
        return res.status(400).send({ status: 'error', error: 'faltan datos' });
    }
    const result = await productService.updateProduct({_id:pid} , productoAEditar);
     res.status(200).send({status:'success', message:'producto actualizado'})
  }catch(e){
    console.log(e)
}  
});


//eliminar un producto
router.delete('/:pid', async(req, res) => {
 const {pid}  = req.params
 try{
    const result = await productService.deleteProduct({_id:pid})
    res.send({status:'success', message:'producto eliminado'})
 }
 catch(e){
console.log(e)
 }
});

module.exports = {
    router, // Exporta el router
    readProductosFromFile, // Exporta la función sin ejecutarla
    writeProductosToFile,
    productos // Exporta la función sin ejecutarla
};