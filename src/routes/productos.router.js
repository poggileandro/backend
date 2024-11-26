const { Router } = require('express');
const { productController } = require('../controllers/products.controller');
const router = Router();
// Instancia del controlador de productos
const productCtrl = new productController();

// Obtener todos los productos
router.get('/', productCtrl.getProducts);

// Obtener un producto por ID
router.get('/:pid', productCtrl.getProduct);

// Cargar un nuevo producto
router.post('/', productCtrl.createProduct);

// Editar un producto
router.put('/:pid', productCtrl.updateProduct);

// Eliminar un producto
router.delete('/:pid', productCtrl.deleteProduct);

module.exports = router;