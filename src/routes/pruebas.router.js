const {Router} = require('express')

const router = Router();

//router.get('/setcookie',(req,res)=>{
  //  res.cookie('codercookie','esta es una cookie muy poderosa',{maxAge:10000}).send('setcookie')
//})

router.get('/setcookiesigned',(req,res)=>{
    res.cookie('codercookie','esta es una cookie muy poderosa',{maxAge:10000 , signed:true}).send('setcookie')
})

router.get('/getcookie' , (req,res)=>{
    res.send(req.signedCookies)
})

router.get('/deletecookie' , (req,res)=>{
    res.clearCookie('codercookie').send('cookie borrada')
})

//prueba session

router.get('/session' , (req,res)=>{
    if(req.session.counter){
   req.session.counter++
   res.send(`se ha visitado el sitio ${req.session.counter} veces`)
    }else{
        req.session.counter = 1
        res.send('bienvenidos')
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy(error =>{
        if(error) return res.send({status:'error',error})
    } )
res.send('logout')
})



module.exports = router