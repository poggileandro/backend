const { connect } = require("mongoose");
const dotenv  = require('dotenv');
const { program } = require("../../commander");
const { MongoSingleton } = require("../utils/mongoSingleton");




const {mode} =program.opts();

dotenv.config({
    path: mode ==='development'?'./.env.development':'./.env.production'
});




exports.configObject = {
    port: process.env.PORT || 8080,
    private_key: process.env.PRIVATE_KEY
}

module.exports.connectDB = async () => {
   // console.log("base de datos conectada")
   // return await connect(process.env.MONGO_URL)
   return MongoSingleton.getInstance()
} 