import {
    Casa, Apartamento, Tienda, CentroComercial,
    Fabrica, Granja, Hospital, EstacionBombero,
    EstacionPolicia, Parque, PlantaElectrica,
    PlantaAgua, Camino
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

// Funciones privadas del repositorio
function rehidratarEdificio(obj) {
    if (!obj || !obj.tipo) return obj;
    const Clase = CLASES[obj.tipo];
    if (!Clase) return obj;
    const instancia = new Clase();
    Object.assign(instancia, obj);
    return instancia;
}

function rehidratarMatriz(matriz) {
    return matriz.map(fila =>
        fila.map(celda => celda ? rehidratarEdificio(celda) : null)
    );
}

const StorageCiudad = {
    key: "ciudades_v1",

    load() {
        const lista = JSON.parse(localStorage.getItem(this.key) || "[]");
        // ✅ Rehidrata antes de entregar los datos
        return lista.map(ciudad => {
            if (ciudad.miMapa?.matriz) {
                ciudad.miMapa.matriz = rehidratarMatriz(ciudad.miMapa.matriz);
            }
            return ciudad;
        });
    },

    save(lista) {
        localStorage.setItem(this.key, JSON.stringify(lista));
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};

export default StorageCiudad;