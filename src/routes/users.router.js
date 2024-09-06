const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { usersManagerMongo } = require('../manager/users.Manager.mongo');
const router = Router();

const usersService  = new usersManagerMongo()


//obtener todos los usuarios
router.get('/', async (req, res) => {
    try{
        const users = await usersService.getUsers()
        res.send({status:'success', payload: {users} })
    }catch (error){
         console.log(error)
    }
});

//obtener un usuario por id
router.get('/:uid', async (req, res) => {
    const {uid} = req.params;
    try{
        const ususarioAMostrar = await usersService.getUser(uid)
        res.send({status:'success', payload: ususarioAMostrar})
    }
    catch(error){
        console.log(error)
    }   
});


//cargar 1 usuario nuevo
router.post('/', async(req, res) => {
    try{
        const { body } = req
        //Se pueden poner mas validaciones
        //verificamos que no sean null ni undefined
        if (!body.first_name || !body.email) {
            return res.status(400).send({ status: 'error', error: 'faltan datos' });
        }
        const result = await usersService.createUser(body);
        res.status(200).send({ data: result });
    }catch(error){
      console.log(error)
    }
});

//editar de a un Usuarios
router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    try{
    let UsersToReplace  = req.body
    if (!UsersToReplace.first_name || !UsersToReplace.email) {
        return res.status(400).send({ status: 'error', error: 'faltan datos' });
    }
    const result = await usersService.updateUser({_id:uid} , UsersToReplace);
    res.status(200).send({status:'success', message:"usuario actualizado"});
    }catch(error){
        console.log(error)
    }
});


//eliminar un User
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;
    try{
        const result = await usersService.deleteUser({_id:uid})
        res.send({ status: 'success', message:'usuario borrado' });
    }
    catch(error){
      console.log(error)
    }
});

module.exports = router;
//exportar el router