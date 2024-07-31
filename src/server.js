const express = require('express');
const path = require('path');
const productRouter = require('./routes/productos.router.js');
const cartRouter = require('./routes/carts.router.js');
const userRouter = require('./routes/users.router.js');

const PORT = 8080;

const app = express();

// Proceso JSON del cliente
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/static', express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/productos', productRouter);
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
    console.log('Escuchando en el puerto', PORT);
});