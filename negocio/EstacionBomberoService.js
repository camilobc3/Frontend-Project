document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - EstacionBomberoService");

    cargarEstacionesBombero();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarEstacionesBombero() {
        const lista = StorageEstacionBombero.load();
        console.log("Estaciones de bombero cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarEstacionBombero(indice) {
        const lista = StorageEstacionBombero.load();
        const estacion = lista[indice];
        console.log("Estación de bombero encontrada:", estacion);
        return estacion || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearEstacionBombero(costo, radio, beneficio) {
        const lista = StorageEstacionBombero.load();
        const nuevaEstacion = new EstacionBombero(costo, radio, beneficio);
        lista.push(nuevaEstacion);
        StorageEstacionBombero.save(lista);
        console.log("Estación de bombero creada:", nuevaEstacion);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarEstacionBombero(indice, costo, radio, beneficio) {
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
    function eliminarEstacionBombero(indice) {
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
});
