const socket = io();

document.getElementById('productoForm').addEventListener('submit',(event) => {
    event.preventDefault();
   
    const inputs = document.querySelectorAll('#productoForm input');

    const producto = {};

    inputs.forEach(input => {
        producto[input.name] = input.value;
    });
    socket.emit('nuevoProducto', producto);
    event.target.reset();
});

// Escuchar el evento 'productosActualizados' para actualizar la lista
socket.on('productosActualizados', (productos) => {
    const productList = document.querySelector('#lista');
    productList.innerHTML = '';

        productos.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `Nombre: ${product.nombre} - Precio: ${product.precio} - Descripción: ${product.descripcion} - Stock: ${product.stock} - Categoría: ${product.categoria} - Código: ${product.codigo}`;
            productList.appendChild(listItem);
        });
    }
);


