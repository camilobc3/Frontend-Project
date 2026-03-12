import Camino from "../modelos/Camino.js";
class CaminoService {

    //cargarCaminos();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarCaminos() {
        const lista = StorageCamino.load();
        console.log("Caminos cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarCamino(indice) {
        const lista = StorageCamino.load();
        const camino = lista[indice];
        console.log("Camino encontrado:", camino);
        return camino || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearCamino(costo, beneficio) {
        const lista = StorageCamino.load();
        const nuevoCamino = new Camino(costo, beneficio);
        lista.push(nuevoCamino);
        StorageCamino.save(lista);
        console.log("Camino creado:", nuevoCamino);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarCamino(indice, costo, beneficio) {
        const lista = StorageCamino.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, beneficio };
        StorageCamino.save(lista);
        console.log("Camino actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarCamino(indice) {
        const lista = StorageCamino.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminado = lista.splice(indice, 1);
        StorageCamino.save(lista);
        console.log("Camino eliminado:", eliminado[0]);
        return true;
    }
};

export default CaminoService;