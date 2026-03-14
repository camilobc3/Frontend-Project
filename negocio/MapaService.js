import {
    Mapa, Casa, Apartamento, Camino,
    CentroComercial, Tienda, Fabrica, Granja,
    EstacionPolicia, EstacionBombero, Hospital,
    PlantaElectrica, PlantaAgua, Parque
} from "../modelos/index.js";
import StorageMapa from "../acceso_datos/StorageMapa.js";
class MapaService {

    // ─── FLUJO 1: cargar mapa desde archivo del usuario ───────────────────────
    /**
     * Recibe el File del input[type=file], delega la lectura a StorageMapa,
     * valida la estructura y devuelve un Mapa con objetos instanciados.
     *
     * @param {File} archivo
     * @returns {Promise<Mapa>}
     */
    async cargarDesdeArchivo(archivo) {
        const json = await StorageMapa.cargarDesdeArchivo(archivo);
        this._validarEstructura(json);
        return this.parsearDesdeJSON(json);
    }

    // ─── FLUJO 2: parsear mapa desde JSON (viene del localStorage de Ciudad) ──
    /**
     * Recibe el objeto { tablero: string[][] } ya leído desde localStorage
     * y devuelve un Mapa con el tablero 2D poblado de objetos instanciados.
     *
     * @param {{ tablero: string[][] }} jsonMapa
     * @returns {Mapa}
     */
    parsearDesdeJSON(jsonMapa) {
        this._validarEstructura(jsonMapa);

        const mapa = new Mapa(jsonMapa.tablero.length);
        const tablero2D = [];

        jsonMapa.tablero.forEach((fila, y) => {
            const filaObjetos = [];
            fila.forEach((celda, x) => {
                const objeto = this._construirObjeto(celda, x, y);
                filaObjetos.push(objeto);
                if (objeto !== null) {
                    objeto.x = x;
                    objeto.y = y;
                    mapa.agregarEdificio(objeto);
                }
            });
            tablero2D.push(filaObjetos);
        });

        mapa.setTablero(tablero2D);
        return mapa;
    }

    // ─── HELPERS DE TERRENO ──────────────────────────────────────────────────
    celdaVacia(fila, columna, tablero) {
        return tablero[fila][columna] === 'g';
    }

    hayViaAdyacente(fila, columna, tablero) {
        const dirs = [[-1,0],[0,1],[1,0],[0,-1]];
        return dirs.some(([df, dc]) => tablero[fila + df]?.[columna + dc] === 'r');
    }

    // ─── VALIDACIÓN ──────────────────────────────────────────────────────────
    _validarEstructura(json) {
        if (!json || typeof json !== 'object') {
            throw new Error("El contenido no es un objeto JSON válido.");
        }
        if (!Array.isArray(json.tablero)) {
            throw new Error('Falta la clave "tablero" o no es un array.');
        }
        if (json.tablero.length === 0) {
            throw new Error('El tablero está vacío.');
        }

        const validas = new Set([
            'g','r','R1','R2','C1','C2','I1','I2','S1','S2','S3','U1','U2','P1'
        ]);

        json.tablero.forEach((fila, y) => {
            if (!Array.isArray(fila)) {
                throw new Error(`La fila ${y} no es un array.`);
            }
            fila.forEach((celda, x) => {
                if (!validas.has(celda)) {
                    throw new Error(
                        `Celda inválida en fila ${y}, columna ${x}: "${celda}". ` +
                        `Valores permitidos: ${[...validas].join(', ')}`
                    );
                }
            });
        });
    }

    // ─── FACTORY DE OBJETOS ──────────────────────────────────────────────────
    _construirObjeto(celda, x, y) {
        let costo = 0;
        switch (celda) {
            case "g":  return null;
            case "r":  return new Camino(costo,0);
            case "R1": return new Casa(costo,4);
            case "R2": return new Apartamento(costo,10);
            case "C1": return new CentroComercial(costo,20);
            case "C2": return new Tienda(costo,6);
            case "I1": return new Fabrica(costo,15);
            case "I2": return new Granja(costo,8);
            case "S1": return new EstacionPolicia(costo,10);
            case "S2": return new EstacionBombero(costo,10);
            case "S3": return new Hospital(costo,10);
            case "U1": return new PlantaElectrica(costo);
            case "U2": return new PlantaAgua(costo);
            case "P1": return new Parque(costo);
            default:
                console.warn(`Celda desconocida en (${x},${y}): "${celda}"`);
                return null;
        }
    }
}

export default MapaService;