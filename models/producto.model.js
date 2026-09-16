const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.Mixed,
        default: () => new mongoose.Types.ObjectId()
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    }
}, {
    timestamps: true,
    versionKey: false
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
