const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, 'protos', 'producto.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const productoProto = grpc.loadPackageDefinition(packageDefinition).producto;

const client = new productoProto.ProductoService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

function crear() {
    return new Promise((resolve, reject) => {
        client.CrearProducto({
            nombre: 'Teclado mecánico',
            descripcion: 'Switches rojos',
            precio: 250000
        }, (error, respuesta) => {
            if (error) return reject(error);
            console.log('CREATE ->', respuesta);
            resolve(respuesta.data.id);
        });
    });
}

function listar() {
    return new Promise((resolve, reject) => {
        client.ObtenerProductos({}, (error, respuesta) => {
            if (error) return reject(error);
            console.log('READ (todos) ->', respuesta);
            resolve();
        });
    });
}

function obtenerPorId(id) {
    return new Promise((resolve, reject) => {
        client.ObtenerProductoPorId({ id }, (error, respuesta) => {
            if (error) return reject(error);
            console.log('READ (por id) ->', respuesta);
            resolve();
        });
    });
}

function actualizar(id) {
    return new Promise((resolve, reject) => {
        client.ActualizarProducto({ id, precio: 230000 }, (error, respuesta) => {
            if (error) return reject(error);
            console.log('UPDATE ->', respuesta);
            resolve();
        });
    });
}

function eliminar(id) {
    return new Promise((resolve, reject) => {
        client.EliminarProducto({ id }, (error, respuesta) => {
            if (error) return reject(error);
            console.log('DELETE ->', respuesta);
            resolve();
        });
    });
}

async function ejecutarCrudCompleto() {
    const id = await crear();
    await listar();
    await obtenerPorId(id);
    await actualizar(id);
    await obtenerPorId(id);
    await eliminar(id);
    await obtenerPorId(id); // debe regresar success: false
}

ejecutarCrudCompleto()
    .then(() => console.log('CRUD completo ejecutado con éxito'))
    .catch((error) => console.error('Error ejecutando el CRUD:', error));
