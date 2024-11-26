const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { cartsManagerMongo } = require('../Dao/carts.Manager.mongo');
const { productDaoMongo } = require('../Dao/products.Dao.mongo');
const router = Router();

const cartService = new cartsManagerMongo();
const productsService = new productDaoMongo();


//todos los carritos
router.get('/', async(req, res) => {
    try{
        const carts = await cartService.getCarts();
        res.send({status:'success' , payload: {carts}})
    }
    catch(e){
   console.log(e)
    }
});
//carrito en especifico con cid
router.get('/:cid', async(req, res) => {
    const {cid} = req.params;
    try {
         const carritoAMostrar  = await cartService.getCart(cid) 
         res.send({status:'success', payload: carritoAMostrar })
        
    } catch (error) {
        console.log(error)
    }
});

router.post('/', async (req, res) => {
  try{
    const result = await cartService.createCart()
    res.send({status:'success' , payload:{result}})
  }catch(e){
     console.log(e)
  }
});
//agregar un producto al carrito recibiendo por param el ID y por body la cantidad
router.post('/:cid/productos/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const {cantidad}  = req.body
    try {
        //obtengo el carrito
        let cart =  await cartService.getCart(cid);
        // obtengo el producto
        let producto =  await productsService.getProduct(pid);
        //verifico si el producto ya esta en el carrito
        let productoEnCart = cart.products.find(p => JSON.stringify(p.product) === JSON.stringify(pid));
        //si ya existe sumo 1 a la cantidad
        if (productoEnCart) {
            //Si el producto ya está en el carrito, aumentar la cantidad
            productoEnCart.quantity+=cantidad
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.products.push({ product:pid, quantity: cantidad });
        }
        // Guardar el carrito actualizado
        await cartService.addProductToCart({ _id: cid }, cart );
        res.status(200).send({ status: 'success', message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});
//agegar una cantiad pisando la anterior desde put
router.put('/:cid/productos/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).send({ status: 'error', message: 'La cantidad debe ser un número positivo' });
    }

    try {
        // Obtener el carrito
        let cart = await cartService.getCart(cid);
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Verificar si el producto está en el carrito
        let productoEnCart = cart.products.find(p => JSON.stringify(p.product) === JSON.stringify(pid));

        if (productoEnCart) {
            // Actualizar la cantidad del producto
            productoEnCart.quantity = quantity;
        } else {
            // Si el producto no está en el carrito, devolver un error
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        // Guardar el carrito actualizado
        await cartService.updateCart({ _id: cid }, cart);

        res.status(200).send({ status: 'success', message: 'Cantidad actualizada', cart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});
//recibe un JSON y lo añade al acarrito
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    // Verificar que se esté enviando un arreglo de productos
    if (!products || !Array.isArray(products)) {
        return res.status(400).send({ status: 'error', message: 'El cuerpo de la solicitud debe contener un arreglo de productos' });
    }

    try {
        // Obtener el carrito
        let cart = await cartService.getCart(cid);
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Reemplazar los productos en el carrito con los productos recibidos
        cart.products = products;

        // Guardar el carrito actualizado
        await cartService.updateCart({ _id: cid }, cart);

        res.status(200).send({ status: 'success', message: 'Carrito actualizado', cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});
//elimina todos los prodcutos de un carrito en especifico mandando una id
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        let cart = await cartService.getCart(cid);
        
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }
        cart.products = [];

        // Guardar el carrito actualizado
        await cartService.updateCart({ _id: cid }, cart);
        res.status(200).send({ status: 'success', message: 'Carrito vaciado con éxito', cart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});

//borrar de un carrito un producto especifico

router.delete('/:cid/productos/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        // Obtener el carrito por ID
        let cart = await cartService.getCart(cid);
        
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Filtrar el producto del carrito por ID
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        // Eliminar el producto del carrito
        cart.products.splice(productIndex, 1);

        // Guardar el carrito actualizado
        await cartService.updateCart({_id : cid}, cart);

        res.status(200).send({ status: 'success', message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;