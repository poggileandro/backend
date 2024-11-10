const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { productManagerMongo } = require('../Dao/products.Manager.mongo');
const { cartsManagerMongo } = require('../Dao/carts.Manager.mongo');
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
    const productoService = new productManagerMongo();

    // Asegúrate de que req.query siempre esté definido
    const { limit, pageNum, sort = '', search = '' } = req.query || {};

    // Usa valores predeterminados para limit y pageNum si no están presentes
    const limitValue = limit != null ? parseInt(limit, 10) : 10; // Usa 10 si limit es null o undefined
    const pageNumValue = pageNum != null ? parseInt(pageNum, 10) : 1; // Usa 1 si pageNum es null o undefined

    try {
        // Llamar a getProducts incluyendo sort, limit, pageNum y search
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productoService.getProducts({
            limit: limitValue,
            page: pageNumValue,
            sort: sort,
            search: search
        });

        res.render('productos.handlebars', {
            productos: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit: limitValue,
            sort,
            search
        });

    } catch (error) {
        console.log(error);
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


