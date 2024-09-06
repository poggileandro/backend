const {Schema , model}  = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const productsCollection = 'products'

const productsSchema = new Schema({
    nombreProducto:{
        type: String,
        required:true
    },

    precioProducto: Number,

    descripcionProducto: String,

    stockProducto:{
        type:Number,
        required:true
    },
    categoriaProducto: String,
    codigoProducto:{
        type:String,
        required:true
    }
});

productsSchema.plugin(mongoosePaginate);
const productsModel = model(productsCollection , productsSchema)

module.exports = {
    productsModel
}