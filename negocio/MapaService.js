// MapaService.js
import {
    Mapa, Casa, Apartamento, Camino,
    CentroComercial, Tienda, Fabrica, Granja,
    EstacionPolicia, EstacionBombero, Hospital,
    PlantaElectrica, PlantaAgua, Parque
} from "/modelos/index.js";
//import StorageMapa from "/acceso_datos/StorageMapa.js";
class MapaService {
    mapa = Mapa.matriz; // Matriz del mapa
    tipoEdificio(tipo){
        let edificio;
        switch (tipo) {
            case 'R1':
                edificio = new Casa();
                break;
            case 'R2':
                edificio = new Apartamento();
                break;
            case 'C1':
                edificio = new Tienda();
                break;
            case 'C2':
                edificio = new CentroComercial();
                break;
            case 'I1':
                edificio = new Fabrica();
                break;
            case 'I2':
                edificio = new Granja();
                break;
            case 'S1':
                edificio = new Hospital();
                break;
            case 'S2':
                edificio = new EstacionBombero();
                break;
            case 'S3':
                edificio = new EstacionPolicia();
                break;
            case 'P1':
                edificio = new Parque();
                break;
            case 'U1':
                edificio = new PlantaElectrica();
                break;
            case 'U2':
                edificio = new PlantaAgua();
                break;
            case 'R':
                edificio = new Camino();
                break;
            default:
                return null;
        }
        return edificio;
    }

    construirEdificio(ciudad, mapa, fila, columna, tipo){
        let edificio = this.tipoEdificio(tipo);

        if(edificio === null){
            return {ok: false, mensaje: "Tipo de edificio no válido"}
        }

        let validacion = this.puedeConstruir(mapa, edificio, fila, columna, ciudad);

        if(!validacion.ok){
            return validacion;
        }

        ciudad.dinero -= edificio.costo;
        mapa[fila][columna] = edificio;
        ciudad.misEdificios.push(edificio);

        return {ok: true, mensaje: `Edificio ${edificio.constructor.name} construido exitosamente`};
    }

    puedeConstruir(mapa, edificio, fila, columna, ciudad){
        if(!this.celdaVacia(mapa, fila, columna)){
            return {ok: false, mensaje: "Error, la celda está ocupada"}
        }
        if(ciudad.dinero < edificio.costo){
            return {ok: false, mensaje: "Error, no hay dinero suficiente"}
        }

        const requiereVia = (edificio instanceof Casa ||
                            edificio instanceof Apartamento ||
                            edificio instanceof Tienda ||
                            edificio instanceof CentroComercial ||
                            edificio instanceof Fabrica ||
                            edificio instanceof Granja ||
                            edificio instanceof Hospital ||
                            edificio instanceof EstacionBombero ||
                            edificio instanceof EstacionPolicia ||
                            edificio instanceof Parque ||
                            edificio instanceof PlantaElectrica ||
                            edificio instanceof PlantaAgua);
        
        if(requiereVia && !this.hayViaAdyacente(mapa, fila, columna)){
            return {ok: false, mensaje: "Error, no hay vía adyacente"}
        }

        return {ok: true}
    }

    celdaVacia(mapa, fila, columna){
        return mapa[fila][columna] === null;
    }

    hayViaAdyacente(mapa, fila, columna) {
        const direcciones = [
            [-1, 0], // arriba
            [1, 0],  // abajo
            [0, -1], // izquierda
            [0, 1]   // derecha
        ];

        for (let [df, dc] of direcciones) {
            const nuevaFila = fila + df;
            const nuevaColumna = columna + dc;

            if (nuevaFila >= 0 && nuevaFila < mapa.length && 
                nuevaColumna >= 0 && nuevaColumna < mapa[0].length) {
                
                if (mapa[nuevaFila][nuevaColumna] instanceof Camino) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default MapaService;