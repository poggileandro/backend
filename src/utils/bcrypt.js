const bcrypt  = require('bcrypt')

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//userPassword => base de datos -- bodyPassword => lo que viene del cliente
const isValidPassword = (bodyPassword ,userPassword)=> bcrypt.compareSync(bodyPassword , userPassword)


module.exports = {
    createHash,
    isValidPassword
}