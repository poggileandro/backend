const { cartService } = require('../service');

class CartController {
  constructor() {
    this.cartService = cartService;
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
    const { id } = req.params;
    try {
      const cart = await this.cartService.getCart(id);
      if (!cart) {
        return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
      }
      res.send({ status: 'success', payload: cart });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
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
      cart.products.push({ product: pid, quantity });
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