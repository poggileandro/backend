const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { userController } = require('../controllers/users.controller');
const router = Router();

const {
    getUser,
    getUsers,
    createUsers,
    updateUser,
    deleteUser
    } = new userController()

//obtener todos los usuarios
router.get('/', getUsers );
//obtener un usuario por id
router.get('/:uid',getUser );
//cargar 1 usuario nuevo
router.post('/',createUsers);
//editar de a un Usuarios
router.put('/:uid',updateUser );
//eliminar un User
router.delete('/:uid',deleteUser);

//exportar el router
module.exports = router;
