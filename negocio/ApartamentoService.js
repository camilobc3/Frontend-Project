import Apartamento from "../modelos/Apartamento.js";
class ApartamentoService{

    //cargarApartamentos();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarApartamentos() {
        const lista = StorageApartamento.load();
        console.log("Apartamentos cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarApartamento(indice) {
        const lista = StorageApartamento.load();
        const apartamento = lista[indice];
        console.log("Apartamento encontrado:", apartamento);
        return apartamento || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearApartamento(costo, capacidadVivienda) {
        const lista = StorageApartamento.load();
        const nuevoApartamento = new Apartamento(costo, capacidadVivienda);
        lista.push(nuevoApartamento);
        StorageApartamento.save(lista);
        console.log("Apartamento creado:", nuevoApartamento);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarApartamento(indice, costo, capacidadVivienda) {
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
    eliminarApartamento(indice) {
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

    // Esta funcón verifica si un apartamento tiene capacidad disponible para nuevos contratos (capacidad de vivienda), comparando la cantidad de contratos actuales con la capacidad máxima de la vivienda.
    capacidadDisponibleApartamento(apartamento) {
        if(apartamento.misContratos.length === apartamento.capacidadVivienda){
            return false;
        } else {
            return true;
        }
    }
};

export default ApartamentoService;
