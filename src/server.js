const express       = require('express');
const path          = require('path');
const productRouter = require('./routes/productos.router.js');
const cartRouter    = require('./routes/carts.router.js');
const userRouter    = require('./routes/users.router.js');
const viewsRouter   = require('./routes/views.router.js');
const pruebasRouter = require('./routes/pruebas.router.js');
const sessionsRouter = require('./routes/sessions.router.js')
const logger        = require('morgan');
const { Uploader }  = require('./utils/multer.js');
const handlebars    = require('express-handlebars');
const { Server }    = require('socket.io');
const fs            = require('fs');
const { connectDB, configObject } = require('./config/index.js');
const cookieParser  = require('cookie-parser')
const session       = require('express-session')
//session file
const FileStore     = require('session-file-store')
const mongoStore    = require('connect-mongo')
//passport
const passport      = require('passport')
const {initializePassport} = require('./config/passport.config.js')
const cors  = require('cors')
const {productService} = require('./service/index.js')


const app = express();
const PORT = configObject.port

// Proceso JSON del cliente
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors())

// Configuración de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
//palabra secreta cookie parser 
app.use(cookieParser('palabrasecreta'))



// session + dbMongo
app.use(session({
   store: mongoStore.create({
    mongoUrl: 'mongodb+srv://poggileandro:moises123@cluster0.kd8m1.mongodb.net/Entrega',
    ttl:10000
}),
    secret: 'secretcoder',
    resave:true,
   saveUninitialized:  true
}))

//inicializar passport despues del session

initializePassport()
app.use(passport.initialize());
//app.use(passport.session());


//base de datos Mongo

connectDB();

// Rutas
app.use('/api/productos', productRouter);
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);
app.use('/api/pruebas',pruebasRouter);
app.use('/api/sessions' , sessionsRouter)
app.use('/', viewsRouter);

// Leer productos del archivo JSON 

// Configuración de Socket.IO
const io = new Server(app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
}));

const productSocket  = (io)=>{
    io.on('connection', async socket =>{
        console.log('nuevo cliente conectado')

        const products = await productService.getProducts();
        socket.emit('lista',products);

        socket.on('addProduct', async data =>{
            console.log('data que llega:',data)
        await productService.createProduct(data) 
        console.log("Datos recibidos del cliente:", data);           
        })
    })

}

productSocket(io);

/*
io.on('connection', (socket) => {
    console.log("Cliente conectado");
    // Enviar la lista de productos al nuevo cliente
    productService.getProducts()
    .then((productos) => {
        console.log(productos)
        socket.emit('lista', productos);
    })
    .catch((error) => {
        console.error("Error al obtener productos al conectar:", error);
    });

    /*
    socket.on('nuevoProducto', async (data) => {
        try {
            console.log('Nuevo producto recibido:', data);
            // Validar el producto antes de crearlo
            if (!data.nombre || !data.precio) {
                socket.emit('error', { message: "Datos incompletos para crear el producto." });
                return;
            }
            // Crear el producto usando el servicio
            const nuevoProducto = await productService.createProduct(data);

            // Obtener la lista actualizada de productos y enviarla a todos los clientes
            const productosActualizados = await productService.getProducts();
            console.log('hola',productosActualizados)
           
            io.emit('productosActualizados', productosActualizados);
        } catch (error) {
            console.error("Error al manejar 'nuevoProducto':", error);
            socket.emit('error', { message: "Error al crear el producto." });
        }
    });   
});*/


