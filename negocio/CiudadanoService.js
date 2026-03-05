document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CiudadanoService");

    cargarCiudadanos();
    const CiudadService = new CiudadService(); // Preguntar


    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarCiudadanos() {
        const lista = StorageCiudadano.load();
        console.log("Ciudadanos cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarCiudadano(id) {
        const lista = StorageCiudadano.load();
        const ciudadano = lista.find(c => c.id === id);
        console.log("Ciudadano encontrado:", ciudadano);
        return ciudadano || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearCiudadano(id, nivelFelicidad) {
        const lista = StorageCiudadano.load();
        const existe = lista.some(c => c.id === id);
        if (existe) {
            console.warn(`Ya existe un ciudadano con id ${id}`);
            return false;
        }
        const nuevoCiudadano = new Ciudadano(id, nivelFelicidad);
        lista.push(nuevoCiudadano);
        StorageCiudadano.save(lista);
        console.log("Ciudadano creado:", nuevoCiudadano);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarCiudadano(id, nivelFelicidad) {
        const lista = StorageCiudadano.load();
        const indice = lista.findIndex(c => c.id === id);
        if (indice === -1) {
            console.warn(`No se encontró ciudadano con id ${id}`);
            return false;
        }
        lista[indice] = { ...lista[indice], nivelFelicidad };
        StorageCiudadano.save(lista);
        console.log("Ciudadano actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarCiudadano(id) {
        const lista = StorageCiudadano.load();
        const nuevaLista = lista.filter(c => c.id !== id);
        if (nuevaLista.length === lista.length) {
            console.warn(`No se encontró ciudadano con id ${id}`);
            return false;
        }
        StorageCiudadano.save(nuevaLista);
        console.log(`Ciudadano con id ${id} eliminado`);
        return true;
    }

    // Verificacion de si el ciudadano tiene contrato con vivienda
    function verificarContratoVivienda(ciudadano) {
        return ciudadano.misContratos.some(contrato => contrato.miEdificio instanceof Casa || contrato.miEdificio instanceof Apartamento);
    }

    //verificacion de si el ciudadano tiene contrato con edificio comercial
    function verificarContratoComercial(ciudadano) {
        return ciudadano.misContratos.some(contrato => contrato.miEdificio instanceof CentroComercial  || contrato.miEdificio instanceof Tienda);
    }

    // Calculo de la felicidad del ciudadano
    function  calcularFelicidad(ciudadano) {  
        let factoresPositivos = 0;
        let factoresNegativos = 0;
        factoresPositivos = calculoFactoresPositivos(ciudadano);
        factoresNegativos = calculoFactoresNegativos(ciudadano);
        return factoresPositivos + factoresNegativos; // La felicidad se calcula como la suma de factores positivos y negativos



    } 


    function calculoFactoresPositivos(ciudadano) {
        let factoresPositivosRespuesta = 0;

        //Factores positivos relacionados con la ciudad
        if(CiudadService.listaHospitales(ciudadano.miCiudad).length > 0) {
            factoresPositivosRespuesta += CiudadService.listaHospitales(ciudadano.miCiudad).length * 10; // Cada hospital suma 10 puntos
        }

        if(CiudadService.listaParques(ciudadano.miCiudad).length > 0) {
            factoresPositivosRespuesta += CiudadService.listaParques(ciudadano.miCiudad).length * 5; // Cada parque suma 5 puntos
        }

        if(CiudadService.listaEstacionesPolicia(ciudadano.miCiudad).length > 0) {
            factoresPositivosRespuesta += CiudadService.listaEstacionesPolicia(ciudadano.miCiudad).length * 10; // Cada estación de policía suma 10 puntos
        }

        if(CiudadService.listaEstacionesBomberos(ciudadano.miCiudad).length > 0) {
            factoresPositivosRespuesta += CiudadService.listaEstacionesBomberos(ciudadano.miCiudad).length * 10; // Cada estación de bomberos suma 10 puntos
        }

        //Factores positivos relacionados con la calidad de vida del ciudadano - trabajo y vivienda
        if(verificarContratoVivienda(ciudadano)) {
            factoresPositivosRespuesta += 20; // Tener contrato con vivienda suma 20 puntos
        }

        if(verificarContratoComercial(ciudadano)) {
            factoresPositivosRespuesta += 15; // Tener contrato con edificio comercial suma 15 puntos
        }

        return factoresPositivosRespuesta;
    }

    function calculoFactoresNegativos(ciudadano) {
        let factoresNegativosRespuesta = 0;

        if(!verificarContratoVivienda(ciudadano)) {
            factoresNegativosRespuesta -=20 ; // Tener contrato con vivienda suma 20 puntos
        }

        if(!verificarContratoComercial(ciudadano)) {
            factoresPositivos -= 15; // Tener contrato con edificio comercial suma 15 puntos
        }

        return factoresNegativosRespuesta;
    }
});
