const { Schema , model} = require("mongoose")



const cartsCollection  = 'carts'


const cartsSchema = new Schema({
    // userID:
    products: {
                type: [{
                        product: {
                                type: Schema.Types.ObjectId,
                                ref: 'products',
                                 },
                                quantity: {
                                    type: Number
            }
        }]
    }
})

cartsSchema.pre('find', function() {
    this.populate('products.product')
});
cartsSchema.pre('findOne', function() {
    this.populate('products.product');
});
const cartModel = model(cartsCollection,cartsSchema);
module.exports = {
    cartModel
}