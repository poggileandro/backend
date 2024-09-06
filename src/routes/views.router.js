const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { productManagerMongo } = require('../manager/products.Manager.mongo');
const { cartsManagerMongo } = require('../manager/carts.Manager.mongo');
const router = Router();

router.get('/realtimeproducts',(req,res)=>{
    res.render('realTimeProducts.handlebars',{ 
        title:'Productos tiempo real'
    })
})


router.get('/productos', async (req, res) => {
    const productoService = new productManagerMongo();
    const { limit, pageNum, sort= '' , search = ''} = req.query;

    try {
        // Llamar a getProducts incluyendo sort, limit , pageNum y search
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productoService.getProducts({
            limit: parseInt(limit),
            page: parseInt(pageNum),
            sort: sort,
            search : search
        });

        res.render('productos.handlebars', {
            productos: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit,
            sort, 
            search :''
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
        if (!docs) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.render('carts.handlebars', {
            cart: docs // Envía el carrito completo, que incluye los productos poblados
        });

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});
module.exports = router;
//exportar el router


