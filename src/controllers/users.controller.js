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
        try{
            const {email} = req;
            const ususarioAMostrar = await this.userService.getUser({email})
            return ususarioAMostrar
        }
        catch(error){
            console.log(error)
        }   
    }

 //Traer 1 usuario email
 getUsuario = async (req, res) => {
    try {
      const  {email}  = req;
      const usuarioAMostrar = await this.userService.getUsuario( {email} );
      return usuarioAMostrar
    } catch (error) {
      console.log(error);
    }
  };


    //Crear 1 Usuario
    createUsers =  async(req, res) => {
        try{
            const  body  = req
            if (!body.first_name || !body.email) {
                return res.status(400).send({ status: 'error', error: 'faltan datos' });
            }
            const result = await this.userService.createUser(body);
            return result 
        }catch(error){
          console.log(error)
        }
    }
    createMany = async (req, res) => {
        try {
            const body = req.body;
    
            // Validación para múltiples usuarios
            if (!Array.isArray(body)) {
                return { status: 'error', error: 'Se esperaba un arreglo de usuarios' };
            }
    
            const invalidUsers = body.filter(user => !user.name || !user.email);
            if (invalidUsers.length > 0) {
                return { status: 'error', error: 'Algunos usuarios tienen datos incompletos', invalidUsers };
            }
    
            const result = await this.userService.insertMany(body);
            return { status: 'success', data: result };
        } catch (error) {
            console.error(error);
            return { status: 'error', error: 'Error interno del servidor' };
        }
    };
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