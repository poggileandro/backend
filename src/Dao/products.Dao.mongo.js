const { productsModel } = require("../models/products.model");

class productDaoMongo {
  constructor() {
    this.model = productsModel;
  }

  // Obtener todos los productos
  getProducts = async (query = {}) => {
    return await this.model.find(query);
  };

  // Obtener un producto por ID
  getProduct = async (productId) => {
    return await this.model.findById(productId);
  };

  // Crear un nuevo producto
  createProduct = async (newProduct) => {
    return await this.model.create(newProduct);
  };

  // Actualizar un producto
  updateProduct = async (productId, productToUpdate) => {
    return await this.model.findByIdAndUpdate(productId, productToUpdate, { new: true });
  };

  // Eliminar un producto
  deleteProduct = async (productId) => {
    return await this.model.findByIdAndDelete(productId);
  };

  // Obtener productos con paginación
  getProductsPaginated = async ({ limit, page, sort, search }) => {
    const options = {
      limit: limit != null ? parseInt(limit, 10) : 10,
      page: page != null ? parseInt(page, 10) : 1,
      lean: true
    };

    const sortOptions = {};
    if (sort === 'asc') {
      sortOptions.precioProducto = 1;
    } else if (sort === 'desc') {
      sortOptions.precioProducto = -1;
    }

    const searchOptions = {};
    if (search) {
      searchOptions.$or = [
        { nombreProducto: { $regex: search, $options: 'i' } },
        { descripcionProducto: { $regex: search, $options: 'i' } }
      ];
    }

    return await this.model.paginate(searchOptions, { ...options, sort: Object.keys(sortOptions).length ? sortOptions : undefined });
  };
}

module.exports = {
  productDaoMongo
};