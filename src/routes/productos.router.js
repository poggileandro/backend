const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const router = Router();

//creo la clase de productos

class Producto {
    constructor(id, nombre, precio, descripcion,stock,category,estado,codigo) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.stock = stock;
        this.category = category;
        this.estado = true;
        this.codigo = codigo;    
    }
}
//el array que voy a guardar los productos y que voy a mostrar
let productos = [];

// Leer productos del archivo JSON 
const readProductosFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../productos.json'), 'utf8');
        productos = JSON.parse(data);
    } catch (err) {
        productos = [];
    }
};

// Escribir productos al archivo JSON
const writeProductosToFile = () => {
    fs.writeFileSync(path.join(__dirname, '../productos.json'), JSON.stringify(productos, null, 4));
};
//leo el archivo al iniciar 
readProductosFromFile();

//obtener todos los productos 
router.get('/', (req, res) => {
    res.send({ data: productos });
});



//obtener un producto por id
router.get('/:uid', (req, res) => {
    const {uid} = req.params;
    let productoAMostrar ;

    productoAMostrar = productos.find((producto)=>producto.id === parseInt(uid ));

    if (!productoAMostrar) {
        return res.status(404).send({ status: 'error', error: 'No existe ese ID' });
    }
    res.send({ data: productoAMostrar });
});




//cargar 1 producto nuevo
router.post('/', (req, res) => {
    const { body } = req;

    if (!body.nombre || !body.precio || !body.descripcion || !body.stock || !body.category || !body.codigo) {
        return res.status(400).send({ status: 'error', error: 'faltan datos' });
    }
    const nuevoProducto = new Producto(
        productos.length + 1,
        body.nombre,
        body.precio,
        body.descripcion,
        body.stock,
        body.category,
        body.estado,
        body.codigo
        );
    productos.push(nuevoProducto);
    writeProductosToFile();
    res.status(200).send({ data: productos });
});

//editar de a un producto
router.put('/:uid', (req, res) => {
    const { uid } = req.params;
    const { body } = req;

    const productoIndex = productos.findIndex(producto => producto.id === parseInt(uid));
    
    if (productoIndex === -1) {
        return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
    }

    const productoActualizado = { ...productos[productoIndex], ...body };
    productos[productoIndex] = productoActualizado;
    writeProductosToFile();

    res.status(200).send({ data: productoActualizado });
});


//eliminar un producto
router.delete('/:uid', (req, res) => {
    const { uid } = req.params;
    productos = productos.filter(producto => producto.id !== parseInt(uid));
    writeProductosToFile();
    res.send({ data: productos });
});

module.exports = {
    router, // Exporta el router
    readProductosFromFile, // Exporta la función sin ejecutarla
    writeProductosToFile,
    productos // Exporta la función sin ejecutarla
};