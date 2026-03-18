// MapaController.js
import MapaService from "/negocio/MapaService.js";
import CiudadService from "/negocio/CiudadService.js";
import CasaService from "/negocio/CasaService.js";
import ApartamentoService from "/negocio/ApartamentoService.js";
import FabricaService from "/negocio/FabricaService.js";
import GranjaService from "/negocio/GranjaService.js";
import TiendaService from "/negocio/TiendaService.js";
import CentroComercialService from "/negocio/CentroComercialService.js";
import CiudadanoService from "/negocio/CiudadanoService.js";

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
    const casaService = new CasaService();
    const apartamentoService = new ApartamentoService();
    const fabricaService = new FabricaService();
    const granjaService = new GranjaService();
    const tiendaService = new TiendaService();
    const centroComercialService = new CentroComercialService();
    const ciudadanoService = new CiudadanoService();

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
            ciudadService.actualizarCiudadCompleta(ciudadActual);
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

    function obtenerNombreEdificio(tipo) {
        const nombres = {
            "R": "Camino",
            "R1": "Casa",
            "R2": "Apartamento",
            "C1": "Tienda",
            "C2": "Centro Comercial",
            "I1": "Fábrica",
            "I2": "Granja",
            "S1": "Hospital",
            "S2": "Estación de Bomberos",
            "S3": "Estación de Policía",
            "P1": "Parque",
            "U1": "Planta Eléctrica",
            "U2": "Planta de Agua"
        };
        return nombres[tipo] || tipo;
    }

    // Función para mostrar opciones de un edificio
    function mostrarOpciones(fila, columna) {
        const contenido = mapaActual[fila][columna];
        
        if (contenido === null) {
            alert("Esta celda está vacía");
            return;
        }

        const modal = document.getElementById("modalOpciones");
        const modalTitulo = document.getElementById("modalTitulo");
        const modalContenido = document.getElementById("modalContenido");
        const btnDemoledor = document.getElementById("btnDemoledor");
        const btnCerrar = document.getElementById("btnCerrarModal");

        // Llenar el modal con información del edificio
        const nombre = obtenerNombreEdificio(contenido.tipo);
        const icono = obtenerIconoEdificio(contenido.tipo);
        const contratos = Array.isArray(contenido.misContratos) ? contenido.misContratos : [];
        const capacidad = Number.isFinite(contenido.capacidadVivienda)
            ? contenido.capacidadVivienda
            : (Number.isFinite(contenido.numeroEmpleos) ? contenido.numeroEmpleos : null);
        const ocupacionActual = contratos.length;

        let bloquesInfo = [
            `<p><strong>Posición:</strong> Fila ${fila + 1}, Columna ${columna + 1}</p>`,
            `<p><strong>Tipo:</strong> ${contenido.tipo}</p>`,
            contenido.costo ? `<p><strong>Costo:</strong> ${contenido.costo}</p>` : "",
            contenido.dineroGenerado ? `<p><strong>Dinero generado:</strong> ${contenido.dineroGenerado}</p>` : "",
            capacidad !== null ? `<p><strong>Capacidad:</strong> ${capacidad}</p>` : "",
            capacidad !== null ? `<p><strong>Ocupación actual:</strong> ${ocupacionActual}/${capacidad}</p>` : ""
        ];

        if (contenido.tipo === "R1") {
            const ciudadanos = casaService.ciudadanosEnCasa(contenido);
            const felicidadPromedio = ciudadanos.length > 0
                ? casaService.felicidadPromedioCasa(contenido, ciudadanoService)
                : 0;

            bloquesInfo.push(`<p><strong>Ciudadanos viviendo:</strong> ${ciudadanos.length}</p>`);
            bloquesInfo.push(`<p><strong>Felicidad promedio:</strong> ${felicidadPromedio}</p>`);
        } else if (contenido.tipo === "R2") {
            const ciudadanos = apartamentoService.ciudadanosEnApartamento(contenido);
            const felicidadPromedio = ciudadanos.length > 0
                ? apartamentoService.felicidadPromedioApartamento(contenido, ciudadanoService)
                : 0;

            bloquesInfo.push(`<p><strong>Ciudadanos viviendo:</strong> ${ciudadanos.length}</p>`);
            bloquesInfo.push(`<p><strong>Felicidad promedio:</strong> ${felicidadPromedio}</p>`);
        } else if (contenido.tipo === "C1") {
            const empleados = tiendaService.empleadosEnTienda(contenido);
            bloquesInfo.push(`<p><strong>Empleados actuales:</strong> ${empleados.length}</p>`);
        } else if (contenido.tipo === "C2") {
            const empleados = centroComercialService.empleadosEnCentroComercial(contenido);
            bloquesInfo.push(`<p><strong>Empleados actuales:</strong> ${empleados.length}</p>`);
        } else if (contenido.tipo === "I1") {
            const empleados = fabricaService.empleadosEnFabrica(contenido);
            bloquesInfo.push(`<p><strong>Empleados actuales:</strong> ${empleados.length}</p>`);
        } else if (contenido.tipo === "I2") {
            const empleados = granjaService.empleadosEnGranja(contenido);
            bloquesInfo.push(`<p><strong>Empleados actuales:</strong> ${empleados.length}</p>`);
        }

        bloquesInfo = bloquesInfo.filter(Boolean);
        
        modalTitulo.textContent = `${icono} ${nombre}`;
        
        modalContenido.innerHTML = `
            <div class="bg-slate-700/50 rounded-lg p-3 space-y-2">
                ${bloquesInfo.join("")}
            </div>
        `;

        // Manejar clic en demoler
        btnDemoledor.onclick = () => {
            if (confirm(`¿Deseas demoler este ${nombre}?`)) {
                // Actualizar la matriz en memoria
                mapaActual[fila][columna] = null;
                ciudadActual.miMapa.matriz[fila][columna] = null;
                
                // Guardar los cambios en el JSON
                ciudadService.actualizarCiudadCompleta(ciudadActual);

                renderizarMapa();
                modal.classList.add("hidden");
                console.log(`${nombre} demolido en fila ${fila}, columna ${columna}`);
            }
        };

        // Manejar clic en cerrar
        btnCerrar.onclick = () => {
            modal.classList.add("hidden");
        };

        // Mostrar modal
        modal.classList.remove("hidden");

        // Cerrar modal al hacer clic fuera
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
            }
        };
    }
    
    const btnCargarMapa = document.getElementById("btnCargarMapa");
    if (btnCargarMapa) {
        btnCargarMapa.addEventListener("click", async () => {
            try {
                const nombre = document.getElementById("cityName").value.trim();
                if (!nombre) {
                    alert("Ingresa un nombre para la ciudad antes de cargar el mapa");
                    return;
                }

                const matriz = await mapaService.cargarMapaDesdeArchivo();
                const id = Date.now();

                ciudadService.crearCiudad(id, nombre, 1, matriz.length);
                const ciudad = ciudadService.cargarCiudad(id);
                ciudadService.asignarMapa(ciudad, matriz);

                window.location.href = `./newPanel.html?cityId=${id}`;
            } catch (error) {
                alert("❌ " + error.message);
            }
        });
    }
    

    window.construirEdificio = construirEdificio;

    // Inicializar con ciudad seleccionada desde query param
    const params = new URLSearchParams(window.location.search);
    const cityIdParam = Number(params.get("cityId"));
    const cityId = Number.isNaN(cityIdParam) ? 1 : cityIdParam;
    cargarCiudad(cityId);
});