const { productsModel } = require("../models/products.model");

class productManagerMongo{
    constructor(){
        this.model = productsModel;
    }

    
      // Obtener productos con paginación
      getProducts = async ({ limit, page, sort , search }) => {
        // Configurar las opciones de paginación
        const options = {
            limit: limit != null ? parseInt(limit, 10) : 10, // Usa 10 si limit es null o undefined
            page: page != null ? parseInt(page, 10) : 1, // Usa 1 si page es null o undefined
            lean: true
        };

        // Configurar la opción de ordenamiento si se pasa el parámetro sort
        const sortOptions = {};
        if (sort === 'asc') {
            sortOptions.precioProducto = 1; // Ordenar por precio ascendente
        } else if (sort === 'desc') {
            sortOptions.precioProducto = -1; // Ordenar por precio descendente
        }
        const searchOptions = {};
        if (search) {
            // Puedes ajustar los filtros según tus necesidades
            searchOptions.$or = [
                { nombreProducto: { $regex: search, $options: 'i' } }, // Búsqueda insensible a mayúsculas/minúsculas
                { descripcionProducto: { $regex: search, $options: 'i' } }
            ];
        }
        // Solo incluir la opción de sort si sortOptions tiene alguna clave
        return await this.model.paginate(searchOptions, { ...options, sort: Object.keys(sortOptions).length ? sortOptions : undefined });
    };
    getProduct = async productId  => await this.model.findById(productId);
    createProduct = async newProduct => await this.model.create(newProduct);
    deleteProduct = async productToDelete => await this.model.deleteOne(productToDelete);
    updateProduct = async (id,productToUpdate) => await this.model.updateOne(id, productToUpdate);

}
module.exports ={
    productManagerMongo
}