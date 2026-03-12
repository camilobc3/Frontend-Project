import Casa from "../modelos/Casa.js";
class CasaService {

    //cargarCasas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarCasas() {
        const lista = StorageCasa.load();
        console.log("Casas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarCasa(indice) {
        const lista = StorageCasa.load();
        const casa = lista[indice];
        console.log("Casa encontrada:", casa);
        return casa || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearCasa(costo, capacidadVivienda) {
        const lista = StorageCasa.load();
        const nuevaCasa = new Casa(costo, capacidadVivienda);
        lista.push(nuevaCasa);
        StorageCasa.save(lista);
        console.log("Casa creada:", nuevaCasa);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarCasa(indice, costo, capacidadVivienda) {
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
    eliminarCasa(indice) {
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

    // Esta funcón verifica si una casa tiene capacidad disponible para nuevos contratos(capacidad de vivienda), comparando la cantidad de contratos actuales con la capacidad máxima de la vivienda.
    capacidadDisponibleCasa(casa) {
        if(casa.misContratos.length === casa.capacidadVivienda){
            return false;
        } else {
            return true;
        }
    }

};

export default CasaService;