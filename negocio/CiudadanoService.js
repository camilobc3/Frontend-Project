import StorageCiudad from "../acceso_datos/StorageCiudad.js";
// CiudadanoService.js — imports al inicio

import {
    Casa,
    Apartamento,
    CentroComercial,
    Tienda,
    Fabrica,
    Granja,
    Hospital,        
    Parque,          
    EstacionPolicia, 
    EstacionBombero  
} from "../modelos/index.js";


class CiudadanoService {

    // ─── CONTRATOS ───────────────────────────────────────────────────────────
    verificarContratoVivienda(ciudadano, ciudad) {
        return ciudadano.misContratos.some(contrato => {
            const edificio = ciudad.misEdificios.find(e => e.id === contrato.miEdificio);
            return edificio instanceof Casa || edificio instanceof Apartamento;
        });
    }

    verificarContratoComercial(ciudadano, ciudad) {
        return ciudadano.misContratos.some(contrato => {
            const edificio = ciudad.misEdificios.find(e => e.id === contrato.miEdificio);
            return edificio instanceof CentroComercial || edificio instanceof Tienda
                || edificio instanceof Fabrica || edificio instanceof Granja;
        });
    }

    // ─── FELICIDAD ───────────────────────────────────────────────────────────


    calcularFelicidad(ciudadano, ciudad) {
        const positivos = this.calcularFactoresPositivos(ciudadano, ciudad);
        const negativos = this.calcularFactoresNegativos(ciudadano, ciudad);
        return positivos + negativos;
    }

    calcularFactoresPositivos(ciudadano, ciudad) {
        let puntos = 0;

        if (ciudad) {
            const hospitales = ciudad.misEdificios.filter(e => e instanceof Hospital).length;
            const parques = ciudad.misEdificios.filter(e => e instanceof Parque).length;
            const policia = ciudad.misEdificios.filter(e => e instanceof EstacionPolicia).length;
            const bomberos = ciudad.misEdificios.filter(e => e instanceof EstacionBombero).length;

            puntos += hospitales * 10;
            puntos += parques * 5;
            puntos += policia * 10;
            puntos += bomberos * 10;
        }

        if (this.verificarContratoVivienda(ciudadano, ciudad)) puntos += 20;
        if (this.verificarContratoComercial(ciudadano, ciudad)) puntos += 15;

        return puntos;
    }
    
    calcularFactoresNegativos(ciudadano, ciudad) {
        let puntos = 0;

        if (!this.verificarContratoVivienda(ciudadano, ciudad)) puntos -= 20;
        if (!this.verificarContratoComercial(ciudadano, ciudad)) puntos -= 15;

        return puntos;
    }
}

export default CiudadanoService;