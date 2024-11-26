const { cartModel } = require("../models/cart.model");


class cartDaoMongo{
    constructor(){
        this.model= cartModel
    }

    getCarts = async () => await this.model.find();
    getCart = async cartId  => await this.model.findById(cartId);
    getCart2 = async cartId => {
        return await this.model
            .findOne({ _id: cartId })
            .populate('products.product'); // Poblar el campo 'product'
    };
    createCart = async (productos , newCart) => await this.model.create(productos , newCart);
    deleteCart = async cartToDelete => await this.model.deleteOne(cartToDelete);
    updateCart = async (id,cartToUpdate) => await this.model.updateOne(id, cartToUpdate);
    addProductToCart = async (id ,cartToUpdate) => await this.model.findByIdAndUpdate(id, cartToUpdate)
}

module.exports= {
    cartDaoMongo
}