const express       = require('express');
const path          = require('path');
const {router:productRouter,readProductosFromFile,writeProductosToFile,productos} = require('./routes/productos.router.js');
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
const { connectDB } = require('./config/index.js');
const cookieParser  = require('cookie-parser')
const session       = require('express-session')
//session file
const FileStore     = require('session-file-store')
const mongoStore    = require('connect-mongo')
//passport
const passport      = require('passport')
const {initializePassport} = require('./config/passport.config.js')

const app = express();
const PORT = process.env.PORT || 8080;

// Proceso JSON del cliente
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// Configuración de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
//palabra secreta cookie parser 
app.use(cookieParser('palabrasecreta'))



// config de session en memoria
//para archivos

//const fileStore = new FileStore(session)

//app.use(session({
   // store: new fileStore({
      //   path:'./session',
       //  ttl:10,
       //  retire:0
  //  }),
   // secret: 'secretcoder',
   // resave:true,
   // saveUninitialized:  true
//}))


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
readProductosFromFile();
// Configuración de Socket.IO
const io = new Server(app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
}));

io.on('connection', (socket) => {
    console.log("Cliente conectado");

    // Enviar la lista de productos al nuevo cliente
    socket.emit('productosActualizados', productos);
    // Manejar el evento 'nuevoProducto'
    socket.on('nuevoProducto', (data) => {
        console.log('Nuevo producto recibido:', data);
        productos.push(data);
        writeProductosToFile(productos);
        io.emit('productosActualizados', productos);
    });
});

