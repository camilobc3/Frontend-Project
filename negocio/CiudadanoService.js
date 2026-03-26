import StorageCiudad from "../acceso_datos/StorageCiudad.js";
import {
    Casa,
    Apartamento,
    CentroComercial,
    Tienda
} from "../modelos/index.js";
// ✅ Se eliminó: import CiudadService from "./CiudadService.js" — causaba el ciclo

class CiudadanoService {

    // ✅ Se eliminó el constructor con new CiudadService) — causaba el ciclo

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarCiudadanos() {
        const lista = StorageCiudadano.load();
        console.log("Ciudadanos cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarCiudadano(id) {
        const lista = StorageCiudadano.load();
        const ciudadano = lista.find(c => c.id === id);
        console.log("Ciudadano encontrado:", ciudadano);
        return ciudadano || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearCiudadano(id, nivelFelicidad) {
        const lista = StorageCiudadano.load();
        const existe = lista.some(c => c.id === id);
        if (existe) {
            console.warn(`Ya existe un ciudadano con id ${id}`);
            return false;
        }
        const nuevoCiudadano = new Ciudadano(id, nivelFelicidad);
        lista.push(nuevoCiudadano);
        StorageCiudadano.save(lista);
        console.log("Ciudadano creado:", nuevoCiudadano);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarCiudadano(id, nivelFelicidad) {
        const lista = StorageCiudadano.load();
        const indice = lista.findIndex(c => c.id === id);
        if (indice === -1) {
            console.warn(`No se encontró ciudadano con id ${id}`);
            return false;
        }
        lista[indice] = { ...lista[indice], nivelFelicidad };
        StorageCiudadano.save(lista);
        console.log("Ciudadano actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarCiudadano(id) {
        const lista = StorageCiudadano.load();
        const nuevaLista = lista.filter(c => c.id !== id);
        if (nuevaLista.length === lista.length) {
            console.warn(`No se encontró ciudadano con id ${id}`);
            return false;
        }
        StorageCiudadano.save(nuevaLista);
        console.log(`Ciudadano con id ${id} eliminado`);
        return true;
    }

    // ─── CONTRATOS ───────────────────────────────────────────────────────────
    verificarContratoVivienda(ciudadano) {
        return ciudadano.misContratos.some(
            contrato => contrato.miEdificio instanceof Casa || contrato.miEdificio instanceof Apartamento
        );
    }

    verificarContratoComercial(ciudadano) {
        return ciudadano.misContratos.some(
            contrato => contrato.miEdificio instanceof CentroComercial || contrato.miEdificio instanceof Tienda
        );
    }

    // ─── FELICIDAD ───────────────────────────────────────────────────────────

    // ✅ Ya no depende de CiudadService — recibe la ciudad directamente como parámetro
    calcularFelicidad(ciudadano) {
        const positivos = this.calcularFactoresPositivos(ciudadano);
        const negativos = this.calcularFactoresNegativos(ciudadano);
        return positivos + negativos;
    }

    calcularFactoresPositivos(ciudadano) {
        let puntos = 0;
        const ciudad = ciudadano.miCiudad; // ✅ Se accede a la ciudad desde el ciudadano

        // Edificios de servicio en la ciudad
        const hospitales = ciudad.misEdificios.filter(e => e instanceof Hospital).length;
        const parques = ciudad.misEdificios.filter(e => e instanceof Parque).length;
        const policia = ciudad.misEdificios.filter(e => e instanceof EstacionPolicia).length;
        const bomberos = ciudad.misEdificios.filter(e => e instanceof EstacionBombero).length;

        puntos += hospitales * 10;
        puntos += parques * 5;
        puntos += policia * 10;
        puntos += bomberos * 10;

        // Calidad de vida del ciudadano
        if (this.verificarContratoVivienda(ciudadano)) puntos += 20;
        if (this.verificarContratoComercial(ciudadano)) puntos += 15;

        return puntos;
    }

    calcularFactoresNegativos(ciudadano) {
        let puntos = 0;

        if (!this.verificarContratoVivienda(ciudadano)) puntos -= 20;
        if (!this.verificarContratoComercial(ciudadano)) puntos -= 15; // ✅ estaba como factoresPositivos

        return puntos;
    }
}

export default CiudadanoService;