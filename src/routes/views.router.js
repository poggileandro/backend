const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const router = Router();


router.get('/realtimeproducts',(req,res)=>{
    res.render('realTimeProducts.handlebars',{ 
        title:'Productos tiempo real'
    })
})

module.exports = router;
//exportar el router


