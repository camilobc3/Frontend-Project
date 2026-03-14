import EstacionPolicia from "../modelos/EstacionPolicia.js";
class EstacionPoliciaService {

    //cargarEstacionesPolicia();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarEstacionesPolicia() {
        const lista = StorageEstacionPolicia.load();
        console.log("Estaciones de policía cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarEstacionPolicia(indice) {
        const lista = StorageEstacionPolicia.load();
        const estacion = lista[indice];
        console.log("Estación de policía encontrada:", estacion);
        return estacion || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearEstacionPolicia(costo, radio, beneficio) {
        const lista = StorageEstacionPolicia.load();
        const nuevaEstacion = new EstacionPolicia(costo, radio, beneficio);
        lista.push(nuevaEstacion);
        StorageEstacionPolicia.save(lista);
        console.log("Estación de policía creada:", nuevaEstacion);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarEstacionPolicia(indice, costo, radio, beneficio) {
        const lista = StorageEstacionPolicia.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, radio, beneficio };
        StorageEstacionPolicia.save(lista);
        console.log("Estación de policía actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarEstacionPolicia(indice) {
        const lista = StorageEstacionPolicia.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StorageEstacionPolicia.save(lista);
        console.log("Estación de policía eliminada:", eliminada[0]);
        return true;
    }
};

export default EstacionPoliciaService;