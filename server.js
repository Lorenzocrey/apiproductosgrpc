const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
require('dotenv').config();

const productoController = require('./controllers/producto.controller.js');

const PROTO_PATH = path.join(__dirname, 'protos', 'producto.proto');
const PORT = process.env.PORT || 50051;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const productoProto = grpc.loadPackageDefinition(packageDefinition).producto;

function iniciarServidor() {
    const server = new grpc.Server();

    server.addService(productoProto.ProductoService.service, {
        CrearProducto: productoController.crearProducto,
        CrearProductos: productoController.crearProductos,
        ObtenerProductos: productoController.obtenerProductos,
        ObtenerProductoPorId: productoController.obtenerProductoPorId,
        ActualizarProducto: productoController.actualizarProducto,
        EliminarProducto: productoController.eliminarProducto
    });

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Conectado exitosamente a MongoDB');

            server.bindAsync(
                `0.0.0.0:${PORT}`,
                grpc.ServerCredentials.createInsecure(),
                (error, puertoAsignado) => {
                    if (error) {
                        console.error('Error al iniciar el servidor gRPC:', error.message);
                        return;
                    }
                    console.log(`Servidor gRPC corriendo en 0.0.0.0:${puertoAsignado}`);
                }
            );
        })
        .catch((error) => {
            console.error('Error al conectar a MongoDB:', error.message);
        });
}

iniciarServidor();
