document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - AlcaldeService");

    cargarAlcaldes();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarAlcaldes() {
        const lista = StorageAlcalde.load();
        console.log("Alcaldes cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarAlcalde(id) {
        const lista = StorageAlcalde.load();
        const alcalde = lista.find(a => a.id === id);
        console.log("Alcalde encontrado:", alcalde);
        return alcalde || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearAlcalde(id, nombre, contraseña) {
        const lista = StorageAlcalde.load();
        const existe = lista.some(a => a.id === id);
        if (existe) {
            console.warn(`Ya existe un alcalde con id ${id}`);
            return false;
        }
        const nuevoAlcalde = new Alcalde(id, nombre, contraseña);
        lista.push(nuevoAlcalde);
        StorageAlcalde.save(lista);
        console.log("Alcalde creado:", nuevoAlcalde);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarAlcalde(id, nombre, contraseña) {
        const lista = StorageAlcalde.load();
        const indice = lista.findIndex(a => a.id === id);
        if (indice === -1) {
            console.warn(`No se encontró alcalde con id ${id}`);
            return false;
        }
        lista[indice] = { ...lista[indice], nombre, contraseña };
        StorageAlcalde.save(lista);
        console.log("Alcalde actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarAlcalde(id) {
        const lista = StorageAlcalde.load();
        const nuevaLista = lista.filter(a => a.id !== id);
        if (nuevaLista.length === lista.length) {
            console.warn(`No se encontró alcalde con id ${id}`);
            return false;
        }
        StorageAlcalde.save(nuevaLista);
        console.log(`Alcalde con id ${id} eliminado`);
        return true;
    }
});

//Este es el service de alcalde
// oeoeoeooe 