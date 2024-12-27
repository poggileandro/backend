class UserRepository {

    constructor(dao){
        this.dao = dao
    }
    getUsers  = async () => await this.dao.get()
    getUser   = async filter => await this.dao.getUser(filter)
    getUsuario  = async email => await this.dao.getUsuario(email);
    createUser = async newUser => await this.dao.create(newUser) 
    deleteUser = async userToDelete => await this.dao.deleteOne(userToDelete);
    updateUser = async (id,userToUpdate) => await this.dao.updateOne(id, userToUpdate);
    insertMany = async (newUsers) => await this.dao.insertMany(newUsers);
}

// este clase maneja el dao y dto

module.exports = 
    UserRepository
