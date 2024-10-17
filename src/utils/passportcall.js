const passport = require('passport')

const passportCall = Strategy =>{
    return async (req,res,next)=>{
 passport.authenticate(Strategy , function(err,user,info) {
    if(err)return next(err)
    if(!user)return res.status(401).send({error: info.message ? info.message: info.tostring()})
    req.user = user
    next()        
 })(req,res,next)

    }
}

module.exports = {
    passportCall
}