class EstacionBomberoService {

    //cargarEstacionesBombero();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarEstacionesBombero() {
        const lista = StorageEstacionBombero.load();
        console.log("Estaciones de bombero cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarEstacionBombero(indice) {
        const lista = StorageEstacionBombero.load();
        const estacion = lista[indice];
        console.log("Estación de bombero encontrada:", estacion);
        return estacion || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearEstacionBombero(costo, radio, beneficio) {
        const lista = StorageEstacionBombero.load();
        const nuevaEstacion = new EstacionBombero(costo, radio, beneficio);
        lista.push(nuevaEstacion);
        StorageEstacionBombero.save(lista);
        console.log("Estación de bombero creada:", nuevaEstacion);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarEstacionBombero(indice, costo, radio, beneficio) {
        const lista = StorageEstacionBombero.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, radio, beneficio };
        StorageEstacionBombero.save(lista);
        console.log("Estación de bombero actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarEstacionBombero(indice) {
        const lista = StorageEstacionBombero.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StorageEstacionBombero.save(lista);
        console.log("Estación de bombero eliminada:", eliminada[0]);
        return true;
    }
};

export default EstacionBomberoService;