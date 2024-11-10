//DAO DATA ACCESS OBJECT

const { userModel } = require("../models/users.model");

class usersDaoMongo{
    constructor(){
        this.model = userModel
    }
    get = async () => await this.model.find();
    getUser = async userId  => await this.model.findById(userId);
    getUsuario  = async email => await this.model.findOne(email);
    create = async newUser => await this.model.create(newUser);
    delete = async userToDelete => await this.model.deleteOne(userToDelete);
    update = async (id,userToUpdate) => await this.model.updateOne(id, userToUpdate);
}

module.exports = {
   usersDaoMongo
}