const { cartService, productService } = require('../service');
const {ObjectId} = require('mongoose')

class CartController {
  constructor() {
    this.cartService = cartService;
    this.productService = productService
  }


  // Obtener todos los carritos
   getCarts = async (req, res) => {
    try {
      const carts = await this.cartService.getCarts();
      res.send({ status: 'success', payload: carts });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al obtener los carritos' });
    }
  }

  // Obtener un carrito por ID
  getCart  =  async (req, res) => {
    const  cid  = req;
    try {
      const cart = await this.cartService.getCart(cid);
      if (cart) {
        return  cart;
      }
      //res.send({ status: 'success', payload: cart });
    } catch (error) {
      console.error(error);
      //res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
    }
  }

  // Crear un carrito
  createCart =  async (req, res) => {
    const { body } = req;
    try {
      const newCart = await this.cartService.createCart(body);
      res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al crear el carrito' });
    }
  }

  // Agregar un producto al carrito
  addProductToCart = async (req, res) => {
    const { id } = req.params;
    const { pid, quantity } = req.body;
  
    try {
      const cart = await this.cartService.getCart(id);
      const product =  await this.productService.getProduct(pid)
      cart.products.push({product: product._id ,quantity : quantity});
      const newCart = await this.cartService.addProductToCart(id, cart);
      res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al agregar prod a el carrito' });
    }
  };
  // Actualizar un carrito completo
  updateCart  =  async (req, res) => {
    const { id } = req.params;
    const cartToUpdate = req.body;
    try {
      const cartUpdated = await this.cartService.updateCart(id, cartToUpdate);
      res.send({ status: 'success', message: 'Carrito actualizado', payload: cartUpdated });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al actualizar el carrito' });
    }
  }

  // Eliminar un carrito
   deleteCart  =  async (req, res) => {
    const { id } = req.params;
    try {
      await this.cartService.deleteCart(id);
      res.send({ status: 'success', message: 'Carrito eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al eliminar el carrito' });
    }
  }

  //comprar carrito
  comprarCart = async (req, res) => {
    const { id } = req.params;
    try {
      const cart = await this.cartService.getCart(id);
      const productos = cart.products;
    
      for (const producto of productos) {
        console.log(producto.id)
        const productoDB = await this.productService.getProduct(producto.product);
        if (!productoDB) {
          throw new Error(`Producto no encontrado`);
        }

        if (productoDB.stockProducto <= 0) {
          throw new Error(`No hay stock suficiente del producto ${productoDB.nombre}`);
        }
        // Restar la cantidad vendida del stock
        productoDB.stockProducto -= producto.quantity;
        console.log("producto db",productoDB)
        await this.productService.updateProduct(producto.product,productoDB);
        await this.cartService.emptyCart(id);
      }
      
      res.status(200).send({ status: 'success', message: 'Carrito comprado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al Comprar el carrito' });
    }
  };

  // Eliminar un producto de un carrito
  deleteProductFromCart = async (req, res) => {
    const { id } = req.params;
    const { pid } = req.body;
    try {
      const cart = await this.cartService.getCart(id);
      const productIndex = cart.products.findIndex((product) => product.product === pid);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity--;
        if (cart.products[productIndex].quantity === 0) {
          cart.products.splice(productIndex, 1);
        }
      }
      const newCart = await this.cartService.addProductToCart(id, cart);
      res.send({ status: 'success', message: 'Producto eliminado del carrito', payload: newCart });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al eliminar producto del carrito' });
    }
  };
}

module.exports = { CartController };