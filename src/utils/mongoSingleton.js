const { connect } = require("mongoose")

class MongoSingleton{
static  #instance
constructor(){
    connect('mongodb+srv://poggileandro:moises123@cluster0.kd8m1.mongodb.net/Entrega')
}


static getInstance(){
    if(this.#instance){
        console.log('base de datos YA conectada')
        return this.#instance
    }
    this.#instance = new MongoSingleton
    console.log('base de datos conectada')
    return this.#instance
}


}

module.exports={
    MongoSingleton
}