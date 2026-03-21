import Alcalde from "../modelos/Alcalde.js";
import StorageAlcalde from "../acceso_datos/StorageAlcalde.js";

class AlcaldeService {

    //cargarAlcaldes();

    asignacionId() {
            const lista = StorageAlcalde.getListaAlcaldes();
            
            let i = 0;
    
            while (true) {
                i++;
                if (!lista.some(alcalde => Number(alcalde.id) === i)) {
                    return i;
                }
        }
    }

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarAlcaldes() {
        const lista = StorageAlcalde.load();
        console.log("Alcaldes cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarAlcalde(id) {
        const lista = StorageAlcalde.load();
        const alcalde = lista.find(a => a.id === id);
        console.log("Alcalde encontrado:", alcalde);
        return alcalde || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearAlcalde(nombre, contraseña) {
        const id = this.asignacionId(); // ✅ ID generado automáticamente
        const nuevoAlcalde = new Alcalde(id, nombre, contraseña);
        StorageAlcalde.save(nuevoAlcalde); // ✅ Guarda un alcalde, no una lista
        console.log("Alcalde creado:", nuevoAlcalde);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarAlcalde(id, nombre, contraseña) {
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
    eliminarAlcalde(id) {
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

    actualizarCiudades(id, ciudad) {

    }
    
};

export default AlcaldeService;
