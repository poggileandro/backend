const { cartModel } = require("../models/cart.model");


class cartDaoMongo{
    constructor(){
        this.model= cartModel
    }

    getCarts = async () => await this.model.find();
    getCart = async cartId  => {return await this.model.findById({ _id: cartId }).populate('products.product')};
    getCart2 = async cartId => {
        return await this.model
            .findOne({ _id: cartId })
            .populate('products.product'); // Poblar el campo 'product'
    };
    createCart = async (productos , newCart) => await this.model.create(productos , newCart);
    deleteCart = async cartToDelete => await this.model.deleteOne(cartToDelete);
    updateCart = async (id,cartToUpdate) => await this.model.updateOne(id, cartToUpdate);
    addProductToCart = async (id ,cartToUpdate) => await this.model.findByIdAndUpdate(id, cartToUpdate);
    emptyCart = async (cartId) => {
        try {
          const cart = await this.model.findById(cartId);
          cart.products = [];
          await cart.save();
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      };
    
}

module.exports= {
    cartDaoMongo
}