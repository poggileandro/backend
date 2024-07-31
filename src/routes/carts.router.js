const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const router = Router();

let carritos = [];
let productos = [];

// Leer carritos del archivo JSON al iniciar
const readCarritosFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../carritos.json'), 'utf8');
        carritos = JSON.parse(data);
    } catch (err) {
        carritos = [];
    }
};

// Escribir carritos al archivo JSON
const writeCarritosToFile = () => {
    fs.writeFileSync(path.join(__dirname, '../carritos.json'), JSON.stringify(carritos, null, 4));
};

// Leer productos del archivo JSON al iniciar
const readProductosFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../productos.json'), 'utf8');
        productos = JSON.parse(data);
    } catch (err) {
        productos = [];
    }
};

readCarritosFromFile();
readProductosFromFile();

router.get('/', (req, res) => {
    res.send({ data: carritos });
});

router.get('/:cid', (req, res) => {
    const {cid} = req.params;
    let carritoAMostrar ;

    carritoAMostrar = carritos.find((cart)=>cart.id === parseInt(cid ));

    if (!carritoAMostrar) {
        return res.status(404).send({ status: 'error', error: 'No existe ese ID' });
    }
    res.send({ data: carritoAMostrar});
});

router.post('/', (req, res) => {
    const nuevoCarrito = {
        id: carritos.length + 1,
        productos: []
    };
    carritos.push(nuevoCarrito);
    writeCarritosToFile();

    res.status(201).send({ data: nuevoCarrito });
});

router.post('/:cid/productos/:uid', (req, res) => {
    const { cid, uid } = req.params;
    const carrito = carritos.find(c => c.id === parseInt(cid));
    const producto = productos.find(p => p.id === parseInt(uid));

    if (!carrito) {
        return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
    }

    if (!producto) {
        return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
    }

    const productoEnCarrito = carrito.productos.find(prod => prod.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.productos.push({
            id: producto.id,
            cantidad:1
        });
    }
    writeCarritosToFile();
    res.status(200).send({ data: carrito });
});

router.put('/:cid', (req, res) => {
    const { cid } = req.params;
    const { productos } = req.body;

    const carritoIndex = carritos.findIndex(carrito => carrito.id === parseInt(cid));

    if (carritoIndex === -1) {
        return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
    }

    carritos[carritoIndex].productos = productos;
    writeCarritosToFile();

    res.status(200).send({ data: carritos[carritoIndex] });
});

router.delete('/:cid', (req, res) => {
    const { cid } = req.params;

    carritos = carritos.filter(c => c.id !== parseInt(cid));
    writeCarritosToFile();

    res.status(200).send({ data: carritos });
});

module.exports = router;