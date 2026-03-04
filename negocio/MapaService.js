document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - MapaService");

    cargarMapas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarMapas() {
        const lista = StorageMapa.load();
        console.log("Mapas cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarMapa(indice) {
        const lista = StorageMapa.load();
        const mapa = lista[indice];
        console.log("Mapa encontrado:", mapa);
        return mapa || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearMapa(tamaño) {
        const lista = StorageMapa.load();
        const nuevoMapa = new Mapa(tamaño);
        lista.push(nuevoMapa);
        StorageMapa.save(lista);
        console.log("Mapa creado:", nuevoMapa);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarMapa(indice, tamaño) {
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
    function eliminarMapa(indice) {
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
});
