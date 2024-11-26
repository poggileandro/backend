const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const {productController} = require('../controllers/products.controller');

const {getProductsPaginated} = new productController();

const { cartsManagerMongo } = require('../Dao/carts.Dao.mongo');
const router = Router();

router.get('/realtimeproducts',(req,res)=>{
    res.render('realTimeProducts.handlebars',{ 
        title:'Productos tiempo real'
    })
})

router.get('/register', (req,res)=>{
    res.render('register.handlebars')
})

router.get('/login', (req,res)=>{
    res.render('login.handlebars')
})
router.get('/cambiarcontra', (req,res)=>{
    res.render('cambiarContra.handlebars')
})


router.get('/productos', async (req, res) => {
    try {
        const { limit = 10, pageNum = 1, sort = '', search = '' } = req.query;
    
        const options = {
          limit: parseInt(limit, 10),
          page: parseInt(pageNum, 10),
          sort,
          search
        };
    
        const productos = await getProductsPaginated(options);
    
        res.render('productos.handlebars', {
          productos: productos.docs,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          page: productos.page,
          totalPages: productos.totalPages,
          limit: parseInt(limit, 10),
          sort,
          search
        });
      } catch (error) {
        console.error("Error en la ruta /productos:", error.message);
        res.status(500).send("Error interno del servidor");
      }
  });



router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    const cartService = new cartsManagerMongo();

    try {
        let docs = await cartService.getCart2(cid);
        let plainDocs = docs.toObject ? docs.toObject() : docs;

        

        if (!docs) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.render('carts.handlebars', {
            cart: plainDocs // Envía el carrito completo, que incluye los productos poblados
            
        });
        console.log(docs)

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});
module.exports = router;
//exportar el router


