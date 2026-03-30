// MapaService.js
import MapaRepository from "/acceso_datos/MapaRepository.js";
import {
    Apartamento, Camino,
    Casa,
    CentroComercial,
    EstacionBombero,
    EstacionPolicia,
    Fabrica, Granja,
    Hospital,
    Mapa,
    Parque,
    PlantaAgua,
    PlantaElectrica,
    Tienda
} from "/modelos/index.js";

import {
    CiudadService
} from "./index.js";

class MapaService {
    mapa = Mapa.matriz; // Matriz del mapa

    asignacionIdEdificio(ciudad){
        if (!ciudad || !ciudad.misEdificios) return 1;
        
        let i = 0;
        while (true) {
            i++;
            // Verificar que ningún edificio existente tenga este ID
            if (!ciudad.misEdificios.some(edificio => edificio.id === i)) {
                return i;
            }
        }
    }

    tipoEdificio(tipo){
        console.log("Creando edificio de tipo:", tipo);
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
                console.error("Tipo no reconocido:", tipo);
                return null;
        }
        console.log("Edificio creado - Costo:", edificio.costo, "Tipo:", typeof edificio.costo);
        return edificio;
    }

    construirEdificio(ciudad, mapa, fila, columna, tipo){
        let ciudadService = new CiudadService();
        let edificio = this.tipoEdificio(tipo);
    
        if(edificio === null){
            return {ok: false, mensaje: "Tipo de edificio no válido"}
        }
    
        edificio.id = this.asignacionIdEdificio(ciudad);
    
        let validacion = this.puedeConstruir(mapa, edificio, fila, columna, ciudad);
    
        if(!validacion.ok){
            return validacion;
        }
    
        if(edificio instanceof Camino || edificio instanceof Parque){
            ciudad.dinero = (Number(ciudad.dinero) || 0) - edificio.costo;
        }
        else{
            ciudad.dinero = (Number(ciudad.dinero) || 0) - edificio.costo;
            ciudad.electricidad = (Number(ciudad.electricidad) || 0) - (edificio.consumoElectricidad?.() || 0);
            ciudad.agua = (Number(ciudad.agua) || 0) - (edificio.consumoAgua?.() || 0);
        }
        
        mapa[fila][columna] = edificio;
        ciudad.misEdificios.push(edificio);
    
        return {ok: true, mensaje: `Edificio ${edificio.constructor.name} construido exitosamente`};
    }

    demolerEdificio(ciudad, mapa, fila, columna) {
        if (!Array.isArray(mapa) || !Array.isArray(mapa[fila])) {
            return { ok: false, mensaje: "Posicion invalida en el mapa" };
        }

        const edificio = mapa[fila][columna];

        if (!edificio) {
            return { ok: false, mensaje: "No hay edificio para demoler en esta celda" };
        }

        const dineroRecuperado = Math.floor((Number(edificio.costo) || 0) * 0.5);

        this.eliminarContratosAsociados(ciudad, edificio);

        mapa[fila][columna] = null;
        ciudad.misEdificios = this.reconstruirListaEdificiosDesdeMapa(mapa);
        ciudad.dinero += dineroRecuperado;

        return {
            ok: true,
            mensaje: `Edificio demolido. Se recuperaron ${dineroRecuperado}`,
            dineroRecuperado
        };
    }

    eliminarContratosAsociados(ciudad, edificio) {
        if (!Array.isArray(ciudad?.misCiudadanos)) return;

        const contratosEdificio = Array.isArray(edificio?.misContratos)
            ? edificio.misContratos
            : [];

        if (contratosEdificio.length === 0) return;

        const idsContratos = new Set(
            contratosEdificio
                .map(contrato => contrato?.id)
                .filter(id => id !== undefined && id !== null)
        );

        ciudad.misCiudadanos.forEach(ciudadano => {
            if (!Array.isArray(ciudadano?.misContratos)) return;
            ciudadano.misContratos = ciudadano.misContratos.filter(contrato => !idsContratos.has(contrato?.id));
        });

        edificio.misContratos = [];
    }

    reconstruirListaEdificiosDesdeMapa(mapa) {
        const edificios = [];
        mapa.forEach(fila => {
            fila.forEach(celda => {
                if (celda !== null) {
                    edificios.push(celda);
                }
            });
        });
        return edificios;
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

    esCamino(celda) {
        if (celda instanceof Camino) return true;
        if (!celda || typeof celda !== "object") return false;
        const tipo = (celda.__tipo || celda.tipo || celda.constructor?.name || "").toString().toLowerCase();
        return tipo === "camino";
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
                
                if (this.esCamino(mapa[nuevaFila][nuevaColumna])) {
                    return true;
                }
            }
        }

        return false;
    }

    // negocio/MapaService.js

    parsearArchivoMapa(contenidoTexto) {
        const lineas = contenidoTexto.trim().split("\n");
        
        // Validar encabezado
        const encabezado = lineas[0].trim();
        if (!encabezado.match(/^\d+x\d+$/)) {
            throw new Error("Formato inválido: la primera línea debe ser NxN (ej: 20x20)");
        }

        const [filas, columnas] = encabezado.split("x").map(Number);
        const lineasMapa = lineas.slice(1);

        if (lineasMapa.length !== filas) {
            throw new Error(`El mapa debe tener ${filas} filas, pero tiene ${lineasMapa.length}`);
        }

        const matriz = [];

        for (let i = 0; i < lineasMapa.length; i++) {
            const celdas = lineasMapa[i].trim().split(",");

            if (celdas.length !== columnas) {
                throw new Error(`La fila ${i + 1} debe tener ${columnas} columnas, pero tiene ${celdas.length}`);
            }

            const fila = celdas.map(celda => this.parsearCelda(celda.trim()));
            matriz.push(fila);
        }

        return { filas, columnas, matriz };
    }

    parsearCelda(codigo) {
        const mapa = {
            "g": null,
            "R":  new Camino(),
            "R1": new Casa(),
            "R2": new Apartamento(),
            "C1": new Tienda(),
            "C2": new CentroComercial(),
            "I1": new Fabrica(),
            "I2": new Granja(),
            "S1": new Hospital(),
            "S2": new EstacionBombero(),
            "S3": new EstacionPolicia(),
            "P1": new Parque(),
            "U1": new PlantaElectrica(),
            "U2": new PlantaAgua()
        };

        if (!(codigo in mapa)) {
            throw new Error(`Código desconocido: "${codigo}"`);
        }

        return mapa[codigo];
    }
    
    async cargarMapaDesdeArchivo() {
        return await MapaRepository.cargarDesdeArchivo();
    }

    asignarMapaACiudad(ciudad, matriz) {
        ciudad.miMapa.matriz = matriz;
        return ciudad;
    }
}

export default MapaService;