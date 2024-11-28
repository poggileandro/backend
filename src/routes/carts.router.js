const { Router } = require('express');

const { CartController } = require('../controllers/cart.controller');
const router = Router();

const cartCtrl  = new CartController();

router.get('/', cartCtrl.getCarts);

router.get('/:id', cartCtrl.getCart);

router.post('/', cartCtrl.createCart);

router.post('/:id', cartCtrl.addProductToCart);

router.put('/:id', cartCtrl.updateCart);

router.get('/:id/purchase', cartCtrl.comprarCart);

router.delete('/:id', cartCtrl.deleteProductFromCart);

module.exports = router;