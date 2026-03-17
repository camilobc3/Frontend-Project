// MapaController.js
import MapaService from "/negocio/MapaService.js";
import CiudadService from "/negocio/CiudadService.js";

// Importar todos los controllers para registrar sus funciones
import "./CasaController.js";
import "./ApartamentoController.js";
import "./FabricaController.js";
import "./TiendaController.js";
import "./GranjaController.js";
import "./HospitalController.js";
import "./CentroComercialController.js";
import "./CaminoController.js";
import "./EstacionBomberoController.js";
import "./EstacionPoliciaController.js";
import "./ParqueController.js";
import "./PlantaAguaController.js";
import "./PlantaElectricaController.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - MapaController");

    // Instanciar el servicio
    const mapaService = new MapaService();
    const ciudadService = new CiudadService();

    // Variables globales
    let ciudadActual = null;
    let mapaActual = null;
    window.modoConstruccion = null; // Variable para indicar si estamos en modo construcción

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
        console.log(`Construyendo ${tipo} en fila ${fila}, columna ${columna}`);
        const resultado = mapaService.construirEdificio(ciudadActual, mapaActual, fila, columna, tipo);
        
        if (resultado.ok) {
            console.log(resultado.mensaje);
            renderizarMapa();
            //actualizarUI(ciudadActual);
        } else {
            console.error(resultado.mensaje);
            alert(resultado.mensaje);
        }
    }

    // Función para renderizar el mapa en el DOM
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
                    } else {
                        celda.textContent = obtenerIconoEdificio(contenido.tipo); // ✅
                        //celda.classList.add(contenido.tipo.toLowerCase());
                        celda.title = contenido.tipo;; // tooltip al hacer hover
                    }

                    // Manejar clicks en las celdas
                    celda.addEventListener("click", () => {
                        if (window.modoConstruccion) {
                            // Si estamos en modo construcción, construir el edificio
                            console.log(`Celda clickeada en modo construcción: ${window.modoConstruccion}`);
                            construirEdificio(fila, columna, window.modoConstruccion);
                            // Desactivar el modo construcción después de construir
                            window.modoConstruccion = null;
                        } else {
                            // Si no, mostrar opciones
                            mostrarOpciones(fila, columna);
                        }
                    });
                    contenedorMapa.appendChild(celda);
                }
            }
        });
    }

    function obtenerIconoEdificio(contenido) {
        switch (contenido) {
            case "R":  return "🛣️";
            case "R1": return "🏠";
            case "R2": return "🏢";
            case "C1": return "🏪";
            case "C2": return "🏬";
            case "I1": return "🏭";
            case "I2": return "🌾";
            case "S1": return "🏥";
            case "S2": return "🚒";
            case "S3": return "🚔";
            case "P1": return "🌳";
            case "U1": return "⚡";
            case "U2": return "💧";
            default:   return "❓";
        }
}

    // Función para actualizar UI (dinero, recursos, etc)
/*     function actualizarUI(ciudad) {
        document.getElementById("dinero").textContent = ciudad.dinero;
        document.getElementById("electricidad").textContent = ciudad.electricidad;
        document.getElementById("agua").textContent = ciudad.agua;
        document.getElementById("poblacion").textContent = ciudad.misCiudadanos.length;
    } */

    // Exponer construirEdificio en window para que sea accesible desde otros controllers
    window.construirEdificio = construirEdificio;

    // Inicializar con ciudad seleccionada desde query param
    const params = new URLSearchParams(window.location.search);
    const cityIdParam = Number(params.get("cityId"));
    const cityId = Number.isNaN(cityIdParam) ? 1 : cityIdParam;
    cargarCiudad(cityId);
});