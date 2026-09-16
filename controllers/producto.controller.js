const Producto = require('../models/producto.model.js');
const { toProtoProducto } = require('../utils/producto.mapper.js');
const { normalizeId } = require('../utils/id.helper.js');

// Implementación de cada RPC definido en producto.proto.
// La firma de gRPC es (call, callback) y el callback es (error, respuesta).

const crearProducto = async (call, callback) => {
    try {
        const { id, nombre, descripcion, precio } = call.request;
        const datosProducto = { nombre, descripcion, precio };

        const idNormalizado = normalizeId(id);
        if (idNormalizado) datosProducto._id = idNormalizado;

        const nuevoProducto = new Producto(datosProducto);
        const productoGuardado = await nuevoProducto.save();

        callback(null, {
            success: true,
            message: 'Producto creado con éxito',
            data: toProtoProducto(productoGuardado)
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: `Error al crear el producto: ${error.message}`,
            data: null
        });
    }
};

const crearProductos = async (call, callback) => {
    try {
        const { productos } = call.request;

        const productosPreparados = productos.map(prod => {
            const { id, nombre, descripcion, precio } = prod;
            const nuevoItem = { nombre, descripcion, precio };
            const idNormalizado = normalizeId(id);
            if (idNormalizado) nuevoItem._id = idNormalizado;
            return nuevoItem;
        });

        const productosGuardados = await Producto.insertMany(productosPreparados);

        callback(null, {
            success: true,
            message: `${productosGuardados.length} productos creados con éxito`,
            data: productosGuardados.map(toProtoProducto)
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: `Error al crear los productos: ${error.message}`,
            data: []
        });
    }
};

const obtenerProductos = async (call, callback) => {
    try {
        const productos = await Producto.find();

        callback(null, {
            success: true,
            count: productos.length,
            data: productos.map(toProtoProducto)
        });
    } catch (error) {
        callback(null, {
            success: false,
            count: 0,
            data: []
        });
    }
};

const obtenerProductoPorId = async (call, callback) => {
    try {
        const { id } = call.request;
        const idNormalizado = normalizeId(id);

        if (!idNormalizado) {
            return callback(null, {
                success: false,
                message: 'Debes proporcionar un id',
                data: null
            });
        }

        const producto = await Producto.findById(idNormalizado);

        if (!producto) {
            return callback(null, {
                success: false,
                message: 'Producto no encontrado',
                data: null
            });
        }

        callback(null, {
            success: true,
            message: '',
            data: toProtoProducto(producto)
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: `Error al buscar el producto: ${error.message}`,
            data: null
        });
    }
};

const actualizarProducto = async (call, callback) => {
    try {
        const { id, nombre, descripcion, precio } = call.request;

        const idNormalizado = normalizeId(id);
        if (!idNormalizado) {
            return callback(null, {
                success: false,
                message: 'Debes proporcionar un id',
                data: null
            });
        }

        // Con "optional" en proto3, el cliente indica qué campos envió
        // mediante _campo (wrapper que expone which oneof fue seteado).
        const cambios = {};
        if (call.request._nombre === 'nombre') cambios.nombre = nombre;
        if (call.request._descripcion === 'descripcion') cambios.descripcion = descripcion;
        if (call.request._precio === 'precio') cambios.precio = precio;

        const productoActualizado = await Producto.findByIdAndUpdate(
            idNormalizado,
            cambios,
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return callback(null, {
                success: false,
                message: 'Producto no encontrado para actualizar',
                data: null
            });
        }

        callback(null, {
            success: true,
            message: 'Producto actualizado con éxito',
            data: toProtoProducto(productoActualizado)
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: `Error al actualizar el producto: ${error.message}`,
            data: null
        });
    }
};

const eliminarProducto = async (call, callback) => {
    try {
        const { id } = call.request;
        const idNormalizado = normalizeId(id);

        if (!idNormalizado) {
            return callback(null, {
                success: false,
                message: 'Debes proporcionar un id'
            });
        }

        const productoEliminado = await Producto.findByIdAndDelete(idNormalizado);

        if (!productoEliminado) {
            return callback(null, {
                success: false,
                message: 'Producto no encontrado para eliminar'
            });
        }

        callback(null, {
            success: true,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: `ID inválido o error al eliminar: ${error.message}`
        });
    }
};

module.exports = {
    crearProducto,
    crearProductos,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
