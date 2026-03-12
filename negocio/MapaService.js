import Mapa from "../modelos/Mapa.js";
class MapaService {

    //cargarMapas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarMapas() {
        const lista = StorageMapa.load();
        console.log("Mapas cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarMapa(indice) {
        const lista = StorageMapa.load();
        const mapa = lista[indice];
        console.log("Mapa encontrado:", mapa);
        return mapa || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearMapa(tamaño) {
        const lista = StorageMapa.load();
        const nuevoMapa = new Mapa(tamaño);
        lista.push(nuevoMapa);
        StorageMapa.save(lista);
        console.log("Mapa creado:", nuevoMapa);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarMapa(indice, tamaño) {
        const lista = StorageMapa.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], tamaño };
        StorageMapa.save(lista);
        console.log("Mapa actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarMapa(indice) {
        const lista = StorageMapa.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminado = lista.splice(indice, 1);
        StorageMapa.save(lista);
        console.log("Mapa eliminado:", eliminado[0]);
        return true;
    }
};

export default MapaService;