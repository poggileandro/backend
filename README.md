# MONGODB 
mongodb+srv://poggileandro:<db_password>@cluster0.kd8m1.mongodb.net/

Proyecto de Gestión de Carritos y Productos
Este proyecto es una aplicación para gestionar productos y carritos de compras usando Express y MongoDB. Permite ver productos en tiempo real, añadir productos al carrito y ver los detalles del carrito con productos incluidos.

Para instalar y ejecutar el proyecto localmente, sigue estos pasos:

Clona el repositorio:
bash
Copiar código
git clone https://github.com/tu-usuario/tu-repositorio.git
Navega a la carpeta del proyecto:

bash
Copiar código
cd tu-repositorio
Instala las dependencias:

bash
Copiar código
npm install
Configura el entorno:

Asegúrate de tener MongoDB en funcionamiento y de haber configurado las variables de entorno necesarias. Puedes crear un archivo .env en la raíz del proyecto con las siguientes variables:

plaintext
Copiar código
MONGODB_URI=tu_uri_de_mongodb
PORT=8080
Ejecuta la aplicación:

bash
Copiar código
npm start
La aplicación debería estar corriendo en http://localhost:8080.

Uso
Visualizar Productos: Ve a /productos para ver la lista de productos disponibles.
Carrito en Tiempo Real: Ve a /realtimeproducts para ver productos en tiempo real.
Ver Carrito: Accede a un carrito específico con la URL /cart/:cid, donde :cid es el ID del carrito.
Estructura del Proyecto
src/
manager/ - Contiene los manejadores para productos y carritos.
models/ - Contiene los esquemas de Mongoose para productos y carritos.
routes/ - Contiene las rutas para manejar las solicitudes HTTP.
views/ - Contiene las plantillas Handlebars para renderizar vistas.
server.js - Punto de entrada de la aplicación.