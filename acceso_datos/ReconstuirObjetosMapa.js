import {
    Casa, Apartamento, Tienda, CentroComercial,
    Fabrica, Granja, Hospital, EstacionBombero,
    EstacionPolicia, Parque, PlantaElectrica,
    PlantaAgua, Camino, Ciudadano
} from "../modelos/index.js";

const CLASES = {
    "R":  Camino,
    "R1": Casa,
    "R2": Apartamento,
    "C1": Tienda,
    "C2": CentroComercial,
    "I1": Fabrica,  
    "I2": Granja,
    "S1": Hospital,
    "S2": EstacionBombero,
    "S3": EstacionPolicia,
    "P1": Parque,
    "U1": PlantaElectrica,
    "U2": PlantaAgua
};

// ✅ Agregar export a las dos funciones
export function rehidratarEdificio(obj) {
    if (!obj || !obj.tipo) return obj;
    const Clase = CLASES[obj.tipo];
    if (!Clase) return obj;
    const instancia = new Clase();
    Object.assign(instancia, obj);
    return instancia;
}

export function rehidratarMatriz(matriz) {
    return matriz.map(fila =>
        fila.map(celda => celda ? rehidratarEdificio(celda) : null)
    );
}

export function rehidratarEdificios(edificios) {
    return edificios.map(e => rehidratarEdificio(e));
}

export function rehidratarCiudadanos(ciudadanosData) {
    // Si no es un array o está vacío, devolver array vacío
    if (!Array.isArray(ciudadanosData)) return [];
    
    return ciudadanosData.map(data => {
        try {
            // Buscar la felicidad: puede estar en 'nivelFelicidad' o 'felicidad'
            const felicidad = data.nivelFelicidad ?? data.felicidad ?? 0;
            // Crear instancia con los datos básicos
            const ciudadano = new Ciudadano(data.id, felicidad);
            // Copiar otras propiedades si existen (sin sobrescribir métodos)
            if (data.misContratos) ciudadano.misContratos = data.misContratos;
            if (data.tieneEmpleo !== undefined) ciudadano.tieneEmpleo = data.tieneEmpleo;
            // Puedes agregar más propiedades si las necesitas
            return ciudadano;
        } catch (error) {
            console.error("Error al rehidratar ciudadano:", data, error);
            // Si falla, devolvemos el objeto original (como objeto plano)
            return data;
        }
    });
}