const {Schema , model}  = require('mongoose')

const ticketSchema = new Schema({
    code: {
      type: String,
      required: true,
      unique: true
    },
    purchase_datetime: {
      type: Date,
      required: true,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    purchaser: {
      type: String,
      required: true
    }
  });
  
  ticketSchema.plugin(mongoosePaginate);

  const ticketModel = model('tickets', ticketSchema);
  
  module.exports = {
    ticketModel
  }