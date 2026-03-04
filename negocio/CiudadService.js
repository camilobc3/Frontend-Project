document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CiudadService");

    cargarCiudades();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarCiudades() {
        const lista = StorageCiudad.load();
        console.log("Ciudades cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarCiudad(id) {
        const lista = StorageCiudad.load();
        const ciudad = lista.find(c => c.id === id);
        console.log("Ciudad encontrada:", ciudad);
        return ciudad || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearCiudad(id, nombre, turno, miMapa = null) {
        const lista = StorageCiudad.load();
        const existe = lista.some(c => c.id === id);
        if (existe) {
            console.warn(`Ya existe una ciudad con id ${id}`);
            return false;
        }
        const nuevaCiudad = new Ciudad(id, nombre, turno, miMapa);
        lista.push(nuevaCiudad);
        StorageCiudad.save(lista);
        console.log("Ciudad creada:", nuevaCiudad);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarCiudad(id, nombre, turno) {
        const lista = StorageCiudad.load();
        const indice = lista.findIndex(c => c.id === id);
        if (indice === -1) {
            console.warn(`No se encontró ciudad con id ${id}`);
            return false;
        }
        lista[indice] = { ...lista[indice], nombre, turno };
        StorageCiudad.save(lista);
        console.log("Ciudad actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarCiudad(id) {
        const lista = StorageCiudad.load();
        const nuevaLista = lista.filter(c => c.id !== id);
        if (nuevaLista.length === lista.length) {
            console.warn(`No se encontró ciudad con id ${id}`);
            return false;
        }
        StorageCiudad.save(nuevaLista);
        console.log(`Ciudad con id ${id} eliminada`);
        return true;
    }
});
