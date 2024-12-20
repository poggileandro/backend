const jwt = require('jsonwebtoken');
const { configObject } = require('../config');

const PRIVATE_KEY = configObject.private_key

const generateToken = (user)=>{return jwt.sign(user,PRIVATE_KEY,{expiresIn:'1d'})}

const authTokenMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization']

    console.log(authHeader);

    if(!authHeader)return res.status(401).send({status:'error', error:'no esta autorizado'})

    const token = authHeader.split(' ')[1]
    jwt.verify(token,PRIVATE_KEY,(error,usuarioExtraidoDelToken)=>{
        req.user = usuarioExtraidoDelToken
        next()
    })
    
    
}

module.exports = {
    generateToken,
    authTokenMiddleware,
    PRIVATE_KEY
}