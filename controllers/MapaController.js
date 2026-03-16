// MapaController.js
import MapaService from "/negocio/MapaService.js";
import CiudadService from "/negocio/CiudadService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - MapaController");

    // Instanciar el servicio
    const mapaService = new MapaService();
    const ciudadService = new CiudadService();

    // Variables globales
    let ciudadActual = null;
    let mapaActual = null;

    // Función para cargar la ciudad
    function cargarCiudad(ciudadId) {
        ciudadActual = ciudadService.cargarCiudad(ciudadId);
        if (!ciudadActual) {
            console.error("Ciudad no encontrada");
            return;
        }
        mapaActual = ciudadActual.miMapa.matriz; // ✅ sin const, usando ciudadActual
        console.log("Mapa cargado:", mapaActual);
        renderizarMapa();
    }

    // Función para construir un edificio
    function construirEdificio(fila, columna, tipo) {
        const resultado = mapaService.construirEdificio(ciudadActual, mapaActual, fila, columna, tipo);
        
        if (resultado.ok) {
            console.log(resultado.mensaje);
            renderizarMapa();
            actualizarUI(ciudadActual);
        } else {
            console.error(resultado.mensaje);
            alert(resultado.mensaje);
        }
    }

    // Función para renderizar el mapa en el DOM
// MapaController.js — reemplaza la función renderizarMapa
function renderizarMapa() {
    // Renderiza en los TRES contenedores a la vez
    const contenedores = [
        document.getElementById("gameMap"),
        document.getElementById("gameMapTablet"),
        document.getElementById("gameMapMobile")
    ].filter(c => c !== null); // elimina los que no existan

    if (contenedores.length === 0) {
        console.error("No se encontró ningún contenedor del mapa");
        return;
    }

    contenedores.forEach(contenedorMapa => {
        contenedorMapa.innerHTML = "";

        // ✅ Aplicar grid al contenedor
        contenedorMapa.style.display = "grid";
        contenedorMapa.style.gridTemplateColumns = `repeat(${mapaActual[0].length}, 26px)`;
        contenedorMapa.style.gap = "1px";
        contenedorMapa.style.width = "max-content";

        for (let fila = 0; fila < mapaActual.length; fila++) {
            for (let columna = 0; columna < mapaActual[fila].length; columna++) {
                const celda = document.createElement("div");
                celda.className = "h-[26px] w-[26px] rounded border border-slate-700 bg-slate-800 text-[10px] text-slate-200 grid place-items-center";
                celda.dataset.fila = fila;
                celda.dataset.columna = columna;

                const contenido = mapaActual[fila][columna];
                if (contenido === null) {
                    celda.textContent = "•";
                } else if (contenido instanceof Object) {
                    celda.textContent = contenido.constructor.name.charAt(0);
                    celda.classList.add(contenido.constructor.name.toLowerCase());
                }

                celda.addEventListener("click", () => mostrarOpciones(fila, columna));
                contenedorMapa.appendChild(celda);
            }
        }
    });
}
    // Función para mostrar opciones de construcción
    function mostrarOpciones(fila, columna) {
        const opciones = [
            {tipo: 'R1', nombre: 'Casa'},
            {tipo: 'R2', nombre: 'Apartamento'},
            {tipo: 'C1', nombre: 'Tienda'},
            {tipo: 'C2', nombre: 'Centro Comercial'},
            {tipo: 'I1', nombre: 'Fábrica'},
            {tipo: 'I2', nombre: 'Granja'},
            {tipo: 'S1', nombre: 'Hospital'},
            {tipo: 'S2', nombre: 'Estación Bomberos'},
            {tipo: 'S3', nombre: 'Estación Policía'},
            {tipo: 'P1', nombre: 'Parque'},
            {tipo: 'U1', nombre: 'Planta Eléctrica'},
            {tipo: 'U2', nombre: 'Planta Agua'},
            {tipo: 'R', nombre: 'Camino'}
        ];
/* 
        const menu = document.createElement("div");
        menu.className = "menu-construccion";

        opciones.forEach(op => {
            const btn = document.createElement("button");
            btn.textContent = op.nombre;
            btn.addEventListener("click", () => {
                construirEdificio(fila, columna, op.tipo);
                menu.remove();
            });
            menu.appendChild(btn);
        });

        document.body.appendChild(menu); */
    }

    // Función para actualizar UI (dinero, recursos, etc)
    function actualizarUI(ciudad) {
        document.getElementById("dinero").textContent = ciudad.dinero;
        document.getElementById("electricidad").textContent = ciudad.electricidad;
        document.getElementById("agua").textContent = ciudad.agua;
        document.getElementById("poblacion").textContent = ciudad.misCiudadanos.length;
    }

    // Inicializar
    cargarCiudad(1); // Cargar ciudad con ID 1
});