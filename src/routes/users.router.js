const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const router = Router();

//creo la clase de productos

class users {
    constructor(id, nombre, apellido) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;    
    }
}
//el array que voy a guardar los productos y que voy a mostrar
let usuarios = [];

// Leer productos del archivo JSON 
const readUsuariosFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../usuarios.json'), 'utf8');
        usuarios = JSON.parse(data);
    } catch (err) {
        usuarios= [];
    }
};

// Escribir productos al archivo JSON
const writeUsuariosToFile = () => {
    fs.writeFileSync(path.join(__dirname, '../usuarios.json'), JSON.stringify(usuarios, null, 4));
};
//leo el archivo al iniciar 
readUsuariosFromFile();

//obtener todos los usuarios
router.get('/', (req, res) => {
    res.send({ data: usuarios });
});


//obtener un usuario por id
router.get('/:uid', (req, res) => {
    const {uid} = req.params;
    let ususarioAMostrar ;

    ususarioAMostrar = usuarios.find((user)=>user.id === parseInt(uid ));

    if (!ususarioAMostrar) {
        return res.status(404).send({ status: 'error', error: 'No existe ese ID' });
    }
    res.send({ data: ususarioAMostrar });
});


//cargar 1 usuario nuevo
router.post('/', (req, res) => {
    const { body } = req;

    if (!body.nombre || !body.apellido) {
        return res.status(400).send({ status: 'error', error: 'faltan datos' });
    }
    const nuevoUsuario = new users(
        usuarios.length + 1,
        body.nombre,
        body.apellido
        );
    usuarios.push(nuevoUsuario);
    writeUsuariosToFile();
    res.status(200).send({ data: usuarios });
});

//editar de a un Usuarios
router.put('/:uid', (req, res) => {
    const { uid } = req.params;
    const { body } = req;

    const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(uid));
    
    if (usuarioIndex === -1) {
        return res.status(404).send({ status: 'error', error: 'usuario no encontrado' });
    }

    const usuarioActualizado = { ...usuarios[usuarioIndex], ...body };
    usuarios[usuarioIndex] = usuarioActualizado;
    writeUsuariosToFile();

    res.status(200).send({ data: usuarioActualizado });
});


//eliminar un producto
router.delete('/:uid', (req, res) => {
    const { uid } = req.params;
    usuarios = usuarios.filter(usuario => usuario.id !== parseInt(uid));
    writeUsuariosToFile();
    res.send({ data: usuarios });
});

module.exports = router;
//exportar el router