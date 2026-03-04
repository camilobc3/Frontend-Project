document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - ApartamentoService");

    cargarApartamentos();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarApartamentos() {
        const lista = StorageApartamento.load();
        console.log("Apartamentos cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarApartamento(indice) {
        const lista = StorageApartamento.load();
        const apartamento = lista[indice];
        console.log("Apartamento encontrado:", apartamento);
        return apartamento || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearApartamento(costo, capacidadVivienda) {
        const lista = StorageApartamento.load();
        const nuevoApartamento = new Apartamento(costo, capacidadVivienda);
        lista.push(nuevoApartamento);
        StorageApartamento.save(lista);
        console.log("Apartamento creado:", nuevoApartamento);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarApartamento(indice, costo, capacidadVivienda) {
        const lista = StorageApartamento.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, capacidadVivienda };
        StorageApartamento.save(lista);
        console.log("Apartamento actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarApartamento(indice) {
        const lista = StorageApartamento.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminado = lista.splice(indice, 1);
        StorageApartamento.save(lista);
        console.log("Apartamento eliminado:", eliminado[0]);
        return true;
    }
});
