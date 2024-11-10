const {Command}  = require('commander')

const program = new Command()

program
    .option('--mode <mode>','especificar el entorno de ejecucion de nuestro servidor','development ')
   
    program.parse()

module.exports = {
    program
}

    //node Commander.js -d -p 3000

