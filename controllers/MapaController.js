// MapaController.js
import MapaService from "/negocio/MapaService.js";
import CiudadService from "/negocio/CiudadService.js";
import { actualizarPanelRecursos } from "../presentacion/ui/RecursosUI.js";
import { actualizarEstadisticas } from "../presentacion/ui/panel.js";
import CasaService from "/negocio/CasaService.js";
import ApartamentoService from "/negocio/ApartamentoService.js";
import FabricaService from "/negocio/FabricaService.js";
import GranjaService from "/negocio/GranjaService.js";
import TiendaService from "/negocio/TiendaService.js";
import CentroComercialService from "/negocio/CentroComercialService.js";
import CiudadanoService from "/negocio/CiudadanoService.js";
import StorageCiudad from "../acceso_datos/StorageCiudad.js";

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
    let refreshInterval = null;
    window.modoConstruccion = null; // Variable para indicar si estamos en modo construcción

    function obtenerAlcaldeActual() {
        return localStorage.getItem("currentMayor") || "Alcalde Anónimo";
    }

    // function iniciarActualizacionConstante() {
    //     if (refreshInterval) return;
    //     refreshInterval = setInterval(() => {
    //         if (!ciudadActual) return;
    //         actualizarRecursosDeCiudad();
    //     }, 1000);
    // }

    function iniciarActualizacionConstante() {
        if (refreshInterval) return;
        refreshInterval = setInterval(() => {
            // Recargar ciudad fresca del localStorage
            const lista = StorageCiudad.load();
            const params = new URLSearchParams(window.location.search);
            const cityId = Number(params.get("cityId"));
            ciudadActual = lista.find(c => c.id === cityId) || ciudadActual;
    
            if (!ciudadActual) return;
            actualizarRecursosDeCiudad();
        }, 1000);
    }

    function detenerActualizacionConstante() {
        if (!refreshInterval) return;
        clearInterval(refreshInterval);
        refreshInterval = null;
    }

    function leerRanking() {
        const raw = localStorage.getItem("ranking_v1");
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed.ranking) ? parsed.ranking : [];
        } catch {
            return [];
        }
    }

    function guardarRanking(rankingItems) {
        localStorage.setItem("ranking_v1", JSON.stringify({ ranking: rankingItems }));
    }

    function registrarPuntaje() {
        if (!ciudadActual) return;
        const mayor = obtenerAlcaldeActual();
        const scoreData = ciudadService.calcularPuntuacion(ciudadActual);
        const score = scoreData?.puntuacionFinal || 0;
        const poblacion = ciudadActual.misCiudadanos?.length || 0;
        const felicidad = Math.round((ciudadActual.misCiudadanos?.reduce((acc, c) => acc + (c.felicidad || 0), 0) || 0) / (ciudadActual.misCiudadanos?.length || 1));
        const entry = {
            cityName: ciudadActual.nombre || "Ciudad",
            mayor,
            score,
            population: poblacion,
            happiness: felicidad,
            turns: ciudadActual.turno || 0,
            date: new Date().toISOString(),
            id: ciudadActual.id
        };

        const rankingItems = leerRanking();
        const existingIndex = rankingItems.findIndex(r => r.id === entry.id && r.mayor === entry.mayor);
        if (existingIndex !== -1) {
            rankingItems[existingIndex] = entry;
        } else {
            rankingItems.push(entry);
        }

        rankingItems.sort((a, b) => b.score - a.score);
        guardarRanking(rankingItems);
    }

    function renderRankingModal() {
        const rankingItems = leerRanking();
        const tabla = document.getElementById("rankingTabla");
        const tuCiudad = document.getElementById("rankingTuCiudad");
        const mayor = obtenerAlcaldeActual();
        const ciudadActualName = ciudadActual?.nombre || "";

        if (!tabla || !tuCiudad) return;
        tabla.innerHTML = "";

        const top10 = rankingItems.slice(0, 10);
        let marcado = false;
        let posicionPersonal = -1;

        top10.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.className = "border-t border-slate-700";
            if (item.id === ciudadActual?.id && item.mayor === mayor) {
                tr.classList.add("bg-emerald-600/20");
                marcado = true;
                posicionPersonal = index + 1;
            }

            tr.innerHTML = `
                <td class="p-2 font-semibold text-slate-100">${index + 1}</td>
                <td class="p-2">${item.cityName}</td>
                <td class="p-2">${item.mayor}</td>
                <td class="p-2">${item.score}</td>
                <td class="p-2">${item.population}</td>
                <td class="p-2">${item.happiness}%</td>
                <td class="p-2">${item.turns}</td>
                <td class="p-2">${new Date(item.date).toLocaleDateString()}</td>
            `;
            tabla.appendChild(tr);
        });

        if (!marcado) {
            const fullRank = rankingItems;
            const matchIndex = fullRank.findIndex(item => item.id === ciudadActual?.id && item.mayor === mayor);
            if (matchIndex !== -1) {
                posicionPersonal = matchIndex + 1;
            }
        }

        if (posicionPersonal > 0) {
            tuCiudad.textContent = `Tu ciudad: #${posicionPersonal}`;
        } else {
            tuCiudad.textContent = "Tu ciudad no está en el ranking";
        }

        document.getElementById("rankingModal").classList.remove("hidden");
    }

    function actualizarRecursosDeCiudad() {
        if (!ciudadActual) return;
        actualizarPanelRecursos(ciudadActual);
        actualizarEstadisticas(ciudadActual);
        registrarPuntaje();
    }

    // Función para cargar la ciudad
    function cargarCiudad(ciudadId) {
        ciudadActual = ciudadService.cargarCiudad(ciudadId);
        if (!ciudadActual) {
            console.error("Ciudad no encontrada");
            return;
        }
        mapaActual = ciudadActual.miMapa?.matriz || [];
        console.log("Mapa cargado:", mapaActual);
        renderizarMapa();
        actualizarRecursosDeCiudad();
        iniciarActualizacionConstante();
    }

    // Función para construir un edificio
    function construirEdificio(fila, columna, tipo) {
        console.log(`Construyendo ${tipo} en fila ${fila}, columna ${columna}`);
        const resultado = mapaService.construirEdificio(ciudadActual, mapaActual, fila, columna, tipo);
        
        if (resultado.ok) {
            ciudadService.actualizarCiudadCompleta(ciudadActual);
            console.log(resultado.mensaje);
            renderizarMapa();
            actualizarRecursosDeCiudad();
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

    const btnVerRanking = document.getElementById("btn-ver-ranking");
    if (btnVerRanking) {
        btnVerRanking.addEventListener("click", function () {
            renderRankingModal();
        });
    }

    const btnCerrarRanking = document.getElementById("btnCerrarRanking");
    if (btnCerrarRanking) {
        btnCerrarRanking.addEventListener("click", function () {
            document.getElementById("rankingModal").classList.add("hidden");
        });
    }

    const btnExportarRanking = document.getElementById("btnExportarRanking");
    if (btnExportarRanking) {
        btnExportarRanking.addEventListener("click", function () {
            const rankingItems = leerRanking();
            const blob = new Blob([JSON.stringify({ ranking: rankingItems }, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "ranking_ciudades.json";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    }

    const btnReiniciarRanking = document.getElementById("btnReiniciarRanking");
    if (btnReiniciarRanking) {
        btnReiniciarRanking.addEventListener("click", function () {
            if (confirm("¿Deseas reiniciar el ranking? Esto eliminará todas las entradas.")) {
                guardarRanking([]);
                renderRankingModal();
            }
        });
    }

    // Inicializar con ciudad seleccionada desde query param
    const params = new URLSearchParams(window.location.search);
    const cityIdParam = Number(params.get("cityId"));
    const cityId = Number.isNaN(cityIdParam) ? 1 : cityIdParam;
    cargarCiudad(cityId);
});