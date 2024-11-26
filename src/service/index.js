const { productDaoMongo } = require('../Dao/products.Dao.mongo')
const { usersDaoMongo } = require('../Dao/users.Dao.mongo')
const UserRepository = require('../repositories/users.repository')

const userService = new UserRepository(new usersDaoMongo())
const productService = new productDaoMongo()
//const productService = new productDaoMongo

module.exports = {
    userService,
    productService
}