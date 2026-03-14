import Parque from "../modelos/Parque.js";
class ParqueService{

    //cargarParques();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarParques() {
        const lista = StorageParque.load();
        console.log("Parques cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarParque(indice) {
        const lista = StorageParque.load();
        const parque = lista[indice];
        console.log("Parque encontrado:", parque);
        return parque || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearParque(costo, beneficio) {
        const lista = StorageParque.load();
        const nuevoParque = new Parque(costo, beneficio);
        lista.push(nuevoParque);
        StorageParque.save(lista);
        console.log("Parque creado:", nuevoParque);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarParque(indice, costo, beneficio) {
        const lista = StorageParque.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, beneficio };
        StorageParque.save(lista);
        console.log("Parque actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarParque(indice) {
        const lista = StorageParque.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminado = lista.splice(indice, 1);
        StorageParque.save(lista);
        console.log("Parque eliminado:", eliminado[0]);
        return true;
    }
};

export default ParqueService;