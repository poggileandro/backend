const {productService} = require('../service')

class productController {
  constructor() {
    this.productService = productService;
  }

  // Obtener todos los productos
  getProducts = async (req, res) => {
    try {
      const products = await this.productService.getProducts();
      res.send({ status: "success", payload: { products } });
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener un producto por ID
  getProduct = async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await this.productService.getProduct(productId);
      res.send({ status: "success", payload: product });
    } catch (error) {
      console.log(error);
    }
  };
 //paginado

 getProductsPaginated = async ( options  = {}) => {
    try {
        // Validación básica
        const { limit, page, sort, search } = options;
    
        if (!limit || !page) {
          throw new Error("Faltan valores obligatorios: limit y/o page");
        }
    
        console.log("Opciones recibidas por getProductsPaginated:", options);
    
        // Llama al servicio con los argumentos esperados
        const products = await productService.getProductsPaginated({
          limit,
          page,
          sort,
          search
        });
    
        return products; // Devuelve los datos correctamente
      } catch (error) {
        console.error("Error en getProductsPaginated:", error.message);
        throw error; // Propaga el error
      }
  };


  // Crear un nuevo producto
  createProduct = async (req, res) => {
    try {
      const { body } = req;
      if (!body.nombreProducto || !body.precioProducto) {
        return res.status(400).send({ status: "error", error: "Faltan datos" });
      }
      const result = await this.productService.createProduct(body);
      res.status(201).send({ data: result });
    } catch (error) {
      console.log(error);
    }
  };

  // Actualizar un producto
  updateProduct = async (req, res) => {
    const { productId } = req.params;
    try {
      const productToUpdate = req.body;
      if (!productToUpdate.nombreProducto || !productToUpdate.precioProducto) {
        return res.status(400).send({ status: "error", error: "Faltan datos" });
      }
      const result = await this.productService.updateProduct(productId, productToUpdate);
      res.status(200).send({ status: "success", message: "Producto actualizado" });
    } catch (error) {
      console.log(error);
    }
  };

  // Eliminar un producto
  deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
      const result = await this.productService.deleteProduct(productId);
      res.status(200).send({ status: "success", message: "Producto eliminado" });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = {
  productController,
};