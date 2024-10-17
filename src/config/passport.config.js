const passport = require('passport')
const passportlocal = require('passport-local')
const jwt           = require('passport-jwt')
const {PRIVATE_KEY}            = require('../utils/jsonwebtoken.js')

const {usersManagerMongo}  = require('../manager/users.Manager.mongo.js')
const {createHash , isValidPassword} = require('../utils/bcrypt.js')

const localStrategy  = passportlocal.Strategy
const JWTStrategy    = jwt.Strategy
const ExtractJWT       = jwt.ExtractJwt


const userService  = new usersManagerMongo()

const initializePassport = () =>{

    const cookieExtractor = (req)=>{
     let token = null
     
     
     if(req && req.cookies){
        token = req.cookies['token']
     }
     console.log(token);
     return token
    }

   passport.use('jwt' , new JWTStrategy({
     jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
     secretOrKey:PRIVATE_KEY

   },async(jwt_payload , done)=>{
    try {
        return done(null,jwt_payload)
        
    } catch (error) {
        return done(error)
        
    }
   }))



/*


    //middleware con estrategias a usar 
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField:'email'//es el nombre que yo le puse en el formulario 
    },async (req, username, password, done)=>{
        const {first_name , last_name} = req.body
        try {
            let userFound = await userService.getUser({email:username})

            if(userFound)return done(null,false)

            let newUser = {
                first_name,
                last_name,
                email:username,
                password:createHash(password)
            }
            let result = await userService.newUser(newUser)

            return done(null,result);
            

        } catch (error) {
           return  done('Error al crear el usuario'+error)
            
        }
    }));




    passport.use('login', new localStrategy({
       usernameField :'email'
    }, async (username, password , done )=>{
        try {
            const user =  await userService.getUsuario({email:username}); // no olvidar el AWAIT si es ASYNC antes del userService
            if(!user)return done(null, false);

            if(!isValidPassword(password, user.password))return done(null,false);

            return done(null,user);

            
        } catch (error) {
            return done(error)
            
        }
    }));

    passport.serializeUser((user,done)=>{done(null,user.id)});

    passport.deserializeUser(async(id , done)=>{
        let user = await userService.getUser({_id:id});
        done(null,user);
    });
    */

}

module.exports = {
    initializePassport
}


