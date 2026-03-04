document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CasaService");

    cargarCasas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarCasas() {
        const lista = StorageCasa.load();
        console.log("Casas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarCasa(indice) {
        const lista = StorageCasa.load();
        const casa = lista[indice];
        console.log("Casa encontrada:", casa);
        return casa || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearCasa(costo, capacidadVivienda) {
        const lista = StorageCasa.load();
        const nuevaCasa = new Casa(costo, capacidadVivienda);
        lista.push(nuevaCasa);
        StorageCasa.save(lista);
        console.log("Casa creada:", nuevaCasa);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarCasa(indice, costo, capacidadVivienda) {
        const lista = StorageCasa.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, capacidadVivienda };
        StorageCasa.save(lista);
        console.log("Casa actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarCasa(indice) {
        const lista = StorageCasa.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StorageCasa.save(lista);
        console.log("Casa eliminada:", eliminada[0]);
        return true;
    }
});
