// Convierte un documento de Mongoose al formato del mensaje "Producto" del .proto
function toProtoProducto(doc) {
    if (!doc) return null;

    return {
        id: doc._id.toString(),
        nombre: doc.nombre,
        descripcion: doc.descripcion,
        precio: doc.precio,
        createdAt: doc.createdAt ? doc.createdAt.toISOString() : '',
        updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : ''
    };
}

module.exports = { toProtoProducto };
