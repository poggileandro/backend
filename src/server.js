const express = require('express');
const path = require('path');
const productRouter = require('./routes/productos.router.js');
const cartRouter = require('./routes/carts.router.js');
const userRouter = require('./routes/users.router.js');
const viewsRouter = require('./routes/views.router.js');
const logger   = require('morgan');
const {Uploader} = require('./utils/multer.js');
const handlebars = require('express-handlebars');
const {Server}  = require('socket.io');
const fs = require('fs');





const app = express();
const PORT = process.env.PORT ||  8080;

// Proceso JSON del cliente
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use( express.static(path.join(__dirname,'public')));

//configuracion de plantillas
app.engine('handlebars',handlebars.engine());
//configurar carpeta donde debe tomar las plantillas
app.set('views',__dirname + '/views');
//configurar la extension de las plantillas 
app.set('view engine' , 'handlebars');


// Rutas
app.use('/api/productos', productRouter);
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);
app.use('/api/views', viewsRouter);


//el array que voy a guardar los productos y que voy a mostrar
let productos = [];

// Leer productos del archivo JSON 
const readProductosFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, './productos.json'), 'utf8');
        productos = JSON.parse(data);
    } catch (err) {
        productos = [];
    }
};
const writeProductosToFile = () => {
    fs.writeFileSync(path.join(__dirname, './productos.json'), JSON.stringify(productos, null, 4));
};
const httpServer  = app.listen(PORT, ()=>{
    console.log('escuchando en el puerto', PORT);
})
const io = new Server(httpServer);
readProductosFromFile();
io.on('connection', (socket) => {
    console.log("Cliente conectado");
    // Enviar la lista de productos al nuevo cliente
    socket.emit('productosActualizados', productos);
    // Manejar el evento 'nuevoProducto'
    socket.on('nuevoProducto', (data) => {
        console.log('Nuevo producto recibido:', data);
        productos.push(data);
        writeProductosToFile();
        io.emit('productosActualizados', productos);
    });
});


//app.listen(PORT, () => {
//    console.log('Escuchando en el puerto', PORT);
//});