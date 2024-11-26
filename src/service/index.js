const { productDaoMongo } = require('../Dao/products.Dao.mongo.js')
const { usersDaoMongo } = require('../Dao/users.Dao.mongo.js')
const {cartDaoMongo} = require('../Dao/carts.Dao.mongo.js')

const UserRepository = require('../repositories/users.repository')


const userService = new UserRepository(new usersDaoMongo())
const productService = new productDaoMongo()
const cartService = new cartDaoMongo()


module.exports = {
    userService,
    productService,
    cartService
}