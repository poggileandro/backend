const { Router } = require('express');
//const { mocksController } = require('../controllers/mocks.controller.js');
const router = Router();
const { generateUsers } = require('../utils/faker.js');
const { userController } = require('../controllers/users.controller.js');

const {createMany} = new userController

// Instancia del controlador de productos
//const mockCtrl = new mockController();



// Obtener todos los productos
router.get('/', async (req, res)=>{
const Users =  [];
for (let i = 0; i < 50 ; i++) {
   Users.push(generateUsers()); 
}
res.send({message:'success', payload: Users})
});

// Obtener un producto por ID


// Cargar un nuevo producto
router.post('/generateData', async (req, res) => {
    try {
        const users = [];
        for (let i = 0; i < 50; i++) {
            users.push(generateUsers());
        }

        // Guardar los usuarios generados en la base de datos
        const result = await createMany({ body: users });
        res.status(201).send({ message: 'success', data: result });
    } catch (error) {
        console.error('Error al generar los datos:', error);
        res.status(500).send({ message: 'error', error: 'Error interno del servidor' });
    }
});

module.exports = router;