const authentication  = (req ,res ,next )=>{/*
    if(req.session.user.email  !== 'leo@gmail.com' || !req.session.user.role){
       return res.status(401).send('error al autenticar')
    }
    next();*/
}


module.exports = {authentication}