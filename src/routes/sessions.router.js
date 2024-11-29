const {Router} = require('express')
const { authentication } = require('../middleware/auth.middleware')
const {userController} = require('../controllers/users.controller.js')
const { createHash, isValidPassword } = require('../utils/bcrypt.js')
const passport = require('passport')
const {passportCall} = require('../utils/passportcall.js')
const {authorization} = require('../middleware/authorization.middleware.js')

const {authTokenMiddleware , generateToken}=require('../utils/jsonwebtoken.js')

const router = Router()
const {
   getUser,
   getUsuario,
   createUsers,
   updateUser,
} = new userController();

//REGISTER-------------------------------

router.post('/register',async (req,res)=>{
   const {first_name,last_name,email,password} = req.body
    if(!email || !password){
       return res.status(400).send({status: 'error' , error:' email y pasword son obligatorios'})
            }
        
         const userFound = await getUsuario({email})
        if(userFound){
             return res.status(401).send({status: 'error' , error:' usuario ya existe'})
              }
         const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password)
             }
             
            const result = await createUsers(newUser);
            res.redirect('/login')
            })


     //LOGIN-----------------------           
                
    router.post('/login', async(req,res)=>{
     const {email,password}  =  req.body
                    
    const userFound = await getUser({email});
                    
    if(!userFound ){
              return res.send({status :'error' , error: 'no existe ese usuario'})
        }
           //     if(userFound.email !== email || userFound.password !== password){
              // return res.send({status :'error' , error: 'no coinciden los datos o no existe ese usuario'})
                 // }
                            
        if(userFound.email !== email || !isValidPassword(password,userFound.password)){
            return res.send({status :'error' , error: 'no coinciden los datos '})
                  }
                                
                //    req.session.user = {
                //     email,
                //     role: userFound.role === 'admin',
                //              }

                const token = generateToken({id:userFound._id , role:userFound.role, first_name:userFound.first_name }) //aca se pasan los datos que quiero mostrar 
                
                 res.cookie('token',token,{
                    maxAge:1000*60*60*24,
                    httpOnly:true

                 }).send({
                    status:'success', 
                    data:userFound.first_name,
                    //data:userFound , //nunca mandar el userFound porque contiene la password
                    token})
                        })

    //CURRENT --------------------------------
    router.get('/current', passportCall('jwt'),authorization('admin'),(req,res)=>{
        res.send({message:'datos sensibles', data:req.user})
    })

    //CAMBIAR CONTRASEÑA ----------------------                    
                                    
   router.post('/cambiarcontra', async (req, res) => {
             const { email, password } = req.body;
                                        
          const userFound = await getUser({ email });
                                        
             if (!userFound) {
                           return res.status(404).send({ status: 'error', error: 'No existe ese Email' });
                        }
                  const newpass = createHash(password);
                             //console.log(newpass)
                                            
                         const result = await updateUser(userFound,{password:newpass});
                                            
                                            
                      res.redirect('/login')
                                            
             });
                                            
       //DESLOGUEAR ---------------------                                     
    router.get('/logout',(req,res)=>{
    req.session.destroy(error =>{
            if(error) return res.send({status:'error',error})
        } )
                                            res.send('logout')
                                            })
                                            
                                            
                                            router.get('/current',authentication, (req,res)=>{
                                                res.send('datos sensibles')
                                            }) 
                                            
      module.exports = router