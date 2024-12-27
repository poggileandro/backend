const { Faker, en , es }  =  require('@faker-js/faker');
const {createHash} = require('./bcrypt')

const faker  = new Faker({
    locale : [es,en]
});

 const generateUsers = () =>{
   // const  numOfUsers = parseInt(faker.string.numeric(1))
    return{
        name: faker.person.firstName(),
        email:faker.internet.email(),
        password: createHash('coder123'),
        role: faker.helpers.arrayElement(['admin', 'user'])
    }
}



module.exports = {
    generateUsers
}