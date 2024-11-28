const { ticketModel } = require("../models/ticket.model");

class ticketDaoMongo {
  constructor() {
    this.model = ticketModel;
  }

  getTickets = async () => await this.model.find();
  getTicket = async (ticketId) => await this.model.findById(ticketId);
  createTicket = async (newTicket) => await this.model.create(newTicket);
  deleteTicket = async (ticketToDelete) => await this.model.deleteOne(ticketToDelete);
  updateTicket = async (id, ticketToUpdate) => await this.model.updateOne(id, ticketToUpdate);
}

module.exports = {
  ticketDaoMongo
}