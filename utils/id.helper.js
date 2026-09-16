const mongoose = require('mongoose');

// Regex estricta para el formato hex de 24 caracteres de un ObjectId de Mongo.
// (mongoose.Types.ObjectId.isValid también acepta strings de 12 caracteres,
// lo cual daría falsos positivos con ids personalizados como "abcdefg12345",
// así que aquí validamos el formato exacto que genera new ObjectId()).
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// Normaliza un id recibido del cliente para usarlo en una consulta o al
// guardar un documento:
//   - Si tiene formato de ObjectId (24 hex), lo castea a ObjectId real,
//     para que haga match con los ids autogenerados por Mongo.
//   - Si no, lo deja como string tal cual, para soportar ids personalizados
//     (ej. "PR-007"), que el schema Mixed guarda literalmente.
// Retorna null solo si el id viene vacío.
function normalizeId(id) {
    if (!id) return null;
    return OBJECT_ID_REGEX.test(id) ? new mongoose.Types.ObjectId(id) : id;
}

module.exports = { normalizeId };
