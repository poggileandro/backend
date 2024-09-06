const { connect } = require("mongoose");


module.exports.connectDB = async () => {
    console.log("base de datos conectada")
    return await connect('mongodb+srv://poggileandro:moises123@cluster0.kd8m1.mongodb.net/Entrega')
} 