const { userService } = require("../service")
class userController{
    constructor(){
    this.userService =  userService
    }

    //Traer todos los usuarios
    getUsers =  async (req, res) => {
        try{
            const users = await this.userService.getUsers();
            res.send({status:'success', payload: {users} })
        }catch (error){
             console.log(error)
        }
    }
    
    //Traer 1 usuario
    getUser = async (req, res) => {
        const {uid} = req.params;
        try{
            const ususarioAMostrar = await this.userService.getUser(uid)
            res.send({status:'success', payload: ususarioAMostrar})
        }
        catch(error){
            console.log(error)
        }   
    }

    //Crear 1 Usuario
    createUsers =  async(req, res) => {
        try{
            const { body } = req
            //Se pueden poner mas validaciones
            //verificamos que no sean null ni undefined
            if (!body.first_name || !body.email) {
                return res.status(400).send({ status: 'error', error: 'faltan datos' });
            }
            const result = await this.userService.createUser(body);
            res.status(200).send({ data: result });
        }catch(error){
          console.log(error)
        }
    }

    //Actualizar 1 usuario
    updateUser = async (req, res) => {
        const { uid } = req.params;
        try{
        let UsersToReplace  = req.body
        if (!UsersToReplace.first_name || !UsersToReplace.email) {
            return res.status(400).send({ status: 'error', error: 'faltan datos' });
        }
        const result = await userService.updateUser({_id:uid} , UsersToReplace);
        res.status(200).send({status:'success', message:"usuario actualizado"});
        }catch(error){
            console.log(error)
        }
    }

     //Borrar 1 usuario
    deleteUser =  async (req, res) => {
        const { uid } = req.params;
        try{
            const result = await userService.deleteUser({_id:uid})
            res.send({ status: 'success', message:'usuario borrado' });
        }
        catch(error){
          console.log(error)
        }
    }


}

module.exports={
    userController
}