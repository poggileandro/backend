const { userModel } = require("../models/users.model");



class usersManagerMongo{
    constructor(){
        this.model = userModel
    }
    getUsers = async () => await this.model.find();
    getUser = async userId  => await this.model.findById(userId);
    getUsuario  = async email => await this.model.findOne(email);
    createUser = async newUser => await this.model.create(newUser);
    deleteUser = async userToDelete => await this.model.deleteOne(userToDelete);
    updateUser = async (id,userToUpdate) => await this.model.updateOne(id, userToUpdate);
}

module.exports = {
   usersManagerMongo
}