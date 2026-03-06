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

    function actualizarCiudadCompleta(ciudad){ //Funcion para actualizar ciudad recibiendo el objeto
        const lista = StorageCiudad.load();
        const indice = lista.findIndex(c => c.id === ciudad.id);
        if (indice === -1) {
            console.warn(`No se encontró ciudad con id ${ciudad.id}`);
            return false;
        }
        lista[indice] = ciudad;
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

    function calcularPuntuacion(ciudad) {

        // Calculos de lo que corresponde con su condicion para la puntuacion final
        // Por esta razon era necesario poner los atributos de los recursos [Cami]

        let poblacion = (ciudad.misCiudadanos.length * 10);
        let dinero = (ciudad.dinero/100);
        let edificios = (ciudad.misEdificios.length * 50);
        let electricidad = (ciudad.electricidad * 2);
        let agua = (ciudad.agua * 2);

        // Calculando el promedio de felicidad de los ciudadanos de la ciudad
        let promedioFelicidad = 0
        
        for (let ciudadano of ciudad.misCiudadanos) {
            promedioFelicidad += ciudadano.nivelFelicidad/ciudad.misCiudadanos.length;
        }

        let puntuacion = poblacion + dinero + edificios + electricidad + agua + promedioFelicidad 

        return puntuacion

        // ESTA SIN TERMINAR CHANGUITOS [------ATENCION!-------]
        
    }

    //Lista de hospitales
    function listaHospitales(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Hospital);
    }

    //Lista de parques 
    function listaParques(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Parque);
    }

    //Lista de estaciones de policia
    function listaEstacionesPolicia(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionPolicia);
    }

    //Lista de estaciones de bomberos
    function listaEstacionesBomberos(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionBombero);
    }


    window.crearCiudad = crearCiudad;
    window.cargarCiudad = cargarCiudad;
    window.actualizarCiudadCompleta = actualizarCiudadCompleta;

    
});
