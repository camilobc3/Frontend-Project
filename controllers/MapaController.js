// MapaController.js
import StorageCiudad from "../acceso_datos/StorageCiudad.js";
import Mapa from "../modelos/Mapa.js";
import { actualizarPanelRecursos } from "../presentacion/ui/RecursosUI.js";
import { actualizarEstadisticas } from "../presentacion/ui/panel.js";
import ApartamentoService from "/negocio/ApartamentoService.js";
import CasaService from "/negocio/CasaService.js";
import CentroComercialService from "/negocio/CentroComercialService.js";
import CiudadService from "/negocio/CiudadService.js";
import CiudadanoService from "/negocio/CiudadanoService.js";
import FabricaService from "/negocio/FabricaService.js";
import GranjaService from "/negocio/GranjaService.js";
import MapaService from "/negocio/MapaService.js";
import TiendaService from "/negocio/TiendaService.js";

// Importar todos los controllers para registrar sus funciones
import "./ApartamentoController.js";
import "./CaminoController.js";
import "./CasaController.js";
import "./CentroComercialController.js";
import "./EstacionBomberoController.js";
import "./EstacionPoliciaController.js";
import "./FabricaController.js";
import "./GranjaController.js";
import "./HospitalController.js";
import "./ParqueController.js";
import "./PlantaAguaController.js";
import "./PlantaElectricaController.js";
import { manejarClickCelda } from "./RutaController.js";
import "./TiendaController.js";

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
    window.modoDemoledorActivo = false;

    //Variables globales para el zoom
    let zoomActual = 1;
    const ZOOM_MIN = 0.1;
    const ZOOM_MAX = 2;
    const ZOOM_STEP = 0.1;

    function actualizarUIBotonModoDemoledor() {
        const botones = [
            document.getElementById("btn-modo-eliminar-desktop"),
            document.getElementById("btn-modo-eliminar-mobile")
        ].filter(Boolean);

        botones.forEach(btn => {
            if (window.modoDemoledorActivo) {
                btn.classList.remove("bg-red-600", "hover:bg-red-500");
                btn.classList.add("bg-red-700", "hover:bg-red-600", "ring-2", "ring-red-300");
                btn.textContent = "Activo modo demoledor";
            } else {
                btn.classList.remove("bg-red-700", "hover:bg-red-600", "ring-2", "ring-red-300");
                btn.classList.add("bg-red-600", "hover:bg-red-500");
                btn.textContent = "🚫 Modo demoledor";
            }
        });
    }

    function actualizarCursorModoDemoledor() {
        const cursor = window.modoDemoledorActivo ? "not-allowed" : "default";
        const cursorCelda = window.modoDemoledorActivo ? "not-allowed" : "pointer";

        ["gameMap", "gameMapTablet", "gameMapMobile"].forEach(id => {
            const contenedor = document.getElementById(id);
            if (contenedor) {
                contenedor.style.cursor = cursor;
            }
        });

        const celdas = document.querySelectorAll(
            "#gameMap [data-fila], #gameMapTablet [data-fila], #gameMapMobile [data-fila]"
        );
        celdas.forEach(celda => {
            celda.style.cursor = cursorCelda;
        });
    }

    function alternarModoDemoledor() {
        window.modoDemoledorActivo = !window.modoDemoledorActivo;

        if (window.modoDemoledorActivo) {
            window.modoConstruccion = null;
        }

        actualizarUIBotonModoDemoledor();
        actualizarCursorModoDemoledor();
    }

    function demolerCelda(fila, columna) {
        if (!confirm("¿Estás seguro de que deseas eliminar este edificio?")) {
            return;
        }

        // Leer ciudad fresca antes de operar para no pisar estado de otros servicios
        const lista = StorageCiudad.load();
        const params = new URLSearchParams(window.location.search);
        const cityId = Number(params.get("cityId"));
        const ciudadFresca = lista.find(c => c.id === cityId);

        if (ciudadFresca) {
            ciudadActual = ciudadFresca;
            mapaActual = ciudadActual.miMapa?.matriz || [];
            window.mapaActual = mapaActual;
        }

        const resultado = mapaService.demolerEdificio(ciudadActual, mapaActual, fila, columna);
        if (!resultado?.ok) {
            alert(resultado?.mensaje || "No se pudo demoler el edificio");
            return;
        }

        ciudadService.actualizarCiudadCompleta(ciudadActual);
        window.mapaActual = mapaActual;
        renderizarMapa();
        actualizarRecursosDeCiudad();
    }

    function obtenerAlcaldeActual() {
        return localStorage.getItem("currentMayor") || "Alcalde Anónimo";
    }

    function iniciarActualizacionConstante() {
        if (refreshInterval) return;
        refreshInterval = setInterval(() => {
            if (!ciudadActual) return;
            actualizarRecursosDeCiudad();
        }, 1000);
    }

    // function iniciarActualizacionConstante() {
    //     if (refreshInterval) return;
    //     refreshInterval = setInterval(() => {
    //         // Recargar ciudad fresca del localStorage
    //         const lista = StorageCiudad.load();
    //         const params = new URLSearchParams(window.location.search);
    //         const cityId = Number(params.get("cityId"));
    //         ciudadActual = lista.find(c => c.id === cityId) || ciudadActual;
    
    //         if (!ciudadActual) return;
    //         actualizarRecursosDeCiudad();
    //     }, 1000);
    // }

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
                <td class="p-1 md:p-2 font-semibold text-slate-100">${index + 1}</td>
                <td class="p-1 md:p-2">${item.cityName}</td>
                <td class="p-1 md:p-2">${item.mayor}</td>
                <td class="p-1 md:p-2">${item.score}</td>
                <td class="p-1 md:p-2">${item.population}</td>
                <td class="p-1 md:p-2">${item.happiness}%</td>
                <td class="p-1 md:p-2">${item.turns}</td>
                <td class="p-1 md:p-2">${new Date(item.date).toLocaleDateString()}</td>
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

    function exportarCiudad() {
        if (!ciudadActual) {
            alert("No hay ciudad cargada para exportar.");
            return;
        }

        const matrizActual = ciudadActual.miMapa?.matriz || [];
        const resultado = ciudadService.calcularPuntuacion(ciudadActual);
        const promedioFelicidad = ciudadActual.misCiudadanos?.length > 0
            ? Math.round(ciudadActual.misCiudadanos.reduce((sum, c) => sum + (c.felicidad || 0), 0) / ciudadActual.misCiudadanos.length)
            : 0;

        // Exportar una matriz ligera y compatible con el importador.
        const matriz = matrizActual.map(fila =>
            fila.map(celda => {
                if (!celda) return null;
                return celda.tipo || null;
            })
        );

        const ciudadSerializada = JSON.parse(JSON.stringify(ciudadActual));
        if (!ciudadSerializada.miMapa) {
            ciudadSerializada.miMapa = { matriz: [] };
        }
        ciudadSerializada.miMapa.matriz = matriz;

        const height = matriz.length;
        const width = height > 0 ? matriz[0].length : 0;

        const exportData = {
            version: 2,
            exportedAt: new Date().toISOString(),
            cityName: ciudadActual.nombre || "Sin Nombre",
            mayor: obtenerAlcaldeActual() || "Sin Alcalde",
            gridSize: { width: width, height: height },
            coordinates: { lat: 4.6097, lon: -74.0817 }, // Valores fijos por ahora
            turn: ciudadActual.turno || 0,
            score: resultado.puntuacionFinal || 0,
            matriz,
            ciudad: ciudadSerializada,
            resources: {
                dinero: ciudadActual.dinero || 0,
                electricidad: ciudadActual.electricidad || 0,
                agua: ciudadActual.agua || 0,
                alimento: ciudadActual.alimento || 0
            },
            duracionTurnoSeg : ciudadActual.duracionTurnoSeg || 300,
            citizens: ciudadActual.misCiudadanos || [],
            population: ciudadActual.misCiudadanos?.length || 0,
            happiness: promedioFelicidad,
            estadisticas: {
                poblacion: ciudadActual.misCiudadanos?.length || 0,
                felicidad: promedioFelicidad,
                puntuacion: resultado.puntuacionFinal || 0,
                turno: ciudadActual.turno || 0
            }
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const fecha = new Date().toISOString().split("T")[0];
        const nombreCiudadSeguro = (exportData.cityName || "Sin_Nombre")
            .replace(/[\\/:*?"<>|]/g, "_")
            .replace(/\s+/g, "_");
        const nombreArchivo = `ciudad_${nombreCiudadSeguro}_${fecha}.json`;

        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        alert("Ciudad exportada exitosamente como " + nombreArchivo);
    }

    // function actualizarRecursosDeCiudad() {
    //     if (!ciudadActual) return;
    //     actualizarPanelRecursos(ciudadActual);
    //     actualizarEstadisticas(ciudadActual);
    //     registrarPuntaje();
    // }

    function actualizarRecursosDeCiudad() {
        if (!ciudadActual) return;
        
        // Leer ciudad fresca solo para mostrar recursos
        const lista = StorageCiudad.load();
        const params = new URLSearchParams(window.location.search);
        const cityId = Number(params.get("cityId"));
        const ciudadFresca = lista.find(c => c.id === cityId) || ciudadActual;
        
        actualizarPanelRecursos(ciudadFresca);
        actualizarEstadisticas(ciudadFresca);
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
        window.mapaActual = mapaActual; // Se añadio esto para exponer globalmente el mapa actual
        console.log("Mapa cargado:", mapaActual);
        renderizarMapa();
        actualizarRecursosDeCiudad();
        iniciarActualizacionConstante();
    }

    // Función para construir un edificio
    // function construirEdificio(fila, columna, tipo) {
    //     console.log(`Construyendo ${tipo} en fila ${fila}, columna ${columna}`);
    //     const resultado = mapaService.construirEdificio(ciudadActual, mapaActual, fila, columna, tipo);
        
    //     if (resultado.ok) {
    //         ciudadService.actualizarCiudadCompleta(ciudadActual);
    //         window.mapaActual = mapaActual; // Se añadio esto para exponer globalmente el mapa actual
    //         console.log(resultado.mensaje);
    //         renderizarMapa();
    //         actualizarRecursosDeCiudad();
    //     } else {
    //         console.error(resultado.mensaje);
    //         alert(resultado.mensaje);
    //     }
    // }

    function construirEdificio(fila, columna, tipo) {
        console.log(`Construyendo ${tipo} en fila ${fila}, columna ${columna}`);
    
        // ✅ Leer ciudad fresca antes de construir para no pisar el estado del TurnoService
        const lista = StorageCiudad.load();
        const params = new URLSearchParams(window.location.search);
        const cityId = Number(params.get("cityId"));
        const ciudadFresca = lista.find(c => c.id === cityId);
        if (ciudadFresca) {
            ciudadActual = ciudadFresca;
            mapaActual = ciudadActual.miMapa?.matriz || [];
            window.mapaActual = mapaActual;
        }
    
        const resultado = mapaService.construirEdificio(ciudadActual, mapaActual, fila, columna, tipo);
        
        if (resultado.ok) {
            ciudadService.actualizarCiudadCompleta(ciudadActual);
            window.mapaActual = mapaActual;
            console.log(resultado.mensaje);
            renderizarMapa();
            actualizarRecursosDeCiudad();
        } else {
            console.error(resultado.mensaje);
            alert(resultado.mensaje);
        }
    }

    function zoom(){

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
            contenedorMapa.style.gridTemplateColumns = `repeat(${mapaActual[0].length}, 80px)`;
            contenedorMapa.style.gap = "1px";
            contenedorMapa.style.width = "max-content";

            for (let fila = 0; fila < mapaActual.length; fila++) {
                for (let columna = 0; columna < mapaActual[fila].length; columna++) {
                    const celda = document.createElement("div");
                    celda.className = " h-[80px] y w-[80px] rounded border border-slate-700 bg-slate-800 text-[10px] text-slate-200 grid place-items-center";
                    celda.dataset.fila = fila;
                    celda.dataset.columna = columna;

                    const contenido = mapaActual[fila][columna];
                    if (contenido === null) {
                        const src = obtenerSrcEdificio(null);
                        celda.title = "Vacío";
                        celda.innerHTML = `<img src="${src}" alt="Vacío" class="map-cell__img" style="max-width: 90%; max-height: 90%; width: auto; height: auto; margin: auto;" loading="lazy">`;
                        celda.classList.add("map-cell-empty");
                    } else {
                        const src = obtenerSrcEdificio(contenido.tipo);
                        const nombre = obtenerNombreEdificio(contenido.tipo);
                        celda.title = nombre;
                        celda.innerHTML = `<img src="${src}" alt="${nombre}" class="map-cell__img" loading="lazy">`;
                        celda.classList.add("map-cell", contenido.tipo.toLowerCase());
                    }

                    // Manejar clicks en las celdas
                    celda.addEventListener("click", () => {
                        if (window.modoDemoledorActivo) {
                            demolerCelda(fila, columna);
                        } else if (window.modoConstruccion) {
                            // Si estamos en modo construcción, construir el edificio
                            console.log(`Celda clickeada en modo construcción: ${window.modoConstruccion}`);
                            construirEdificio(fila, columna, window.modoConstruccion);
                            // Desactivar el modo construcción después de construir
                            window.modoConstruccion = null;
                        }else if(manejarClickCelda(fila,columna)){

                        } else {
                            // Si no, mostrar opciones
                            mostrarOpciones(fila, columna);
                        }
                    });
                    contenedorMapa.appendChild(celda);
                }
            }
        });
        aplicarZoom();
        actualizarCursorModoDemoledor();
    }

    function obtenerSrcEdificio(tipo) {
        const rutas = {
            R: "../assets/camino.png",
            R1: "../assets/casa.png",
            R2: "../assets/apartamento.png",
            C1: "../assets/tienda.png",
            C2: "../assets/CentroComercial.png",
            I1: "../assets/Fabrica.png",
            I2: "../assets/Granja.png",
            S1: "../assets/Hospital.png",
            S2: "../assets/EstacionBomberos.png",
            S3: "../assets/EstacionPolicia.png",
            P1: "../assets/Parque.png",
            U1: "../assets/PlantaElectrica.png",
            U2: "../assets/PlantaDeAgua.png",
            null: "../assets/Pasto.png"
        };
        return rutas[tipo] || "../assets/Pasto.png";
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
        let contenido = mapaActual[fila][columna];

        // Sincronizar con storage para mostrar contratos actualizados por turno
        const lista = StorageCiudad.load();
        const params = new URLSearchParams(window.location.search);
        const cityId = Number(params.get("cityId"));
        const ciudadFresca = lista.find(c => c.id === cityId);

        if (ciudadFresca) {
            ciudadActual = ciudadFresca;
            mapaActual = ciudadActual.miMapa?.matriz || mapaActual;
            window.mapaActual = mapaActual;

            const edificioPorId = contenido?.id != null
                ? ciudadActual.misEdificios?.find(e => e.id === contenido.id)
                : null;
            const edificioEnMatriz = ciudadActual.miMapa?.matriz?.[fila]?.[columna] || null;
            contenido = edificioPorId || edificioEnMatriz || contenido;
        }
        
        if (contenido === null) {
            alert("Esta celda está vacía");
            return;
        }

        const modal = document.getElementById("modalOpciones");
        const modalTitulo = document.getElementById("modalTitulo");
        const modalContenido = document.getElementById("modalContenido");
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
            contenido.costo ? `<p><strong>Reembolso por demolición (50%):</strong> ${Math.floor(contenido.costo * 0.5)}</p>` : "",
            contenido.dineroGenerado ? `<p><strong>Dinero generado:</strong> ${contenido.dineroGenerado}</p>` : "",
            capacidad !== null ? `<p><strong>Capacidad:</strong> ${capacidad}</p>` : "",
            capacidad !== null ? `<p><strong>Ocupación actual:</strong> ${ocupacionActual}/${capacidad}</p>` : ""
        ];

        if (contenido.tipo === "R1") {
            const ciudadanos = casaService.ciudadanosEnCasa(contenido);
            const felicidadPromedio = ciudadanos.length > 0
                ? casaService.felicidadPromedioCasa(contenido, ciudadanoService, ciudadActual)
                : 0;

            bloquesInfo.push(`<p><strong>Ciudadanos viviendo:</strong> ${ciudadanos.length}</p>`);
            bloquesInfo.push(`<p><strong>Felicidad promedio:</strong> ${felicidadPromedio}</p>`);
        } else if (contenido.tipo === "R2") {
            const ciudadanos = apartamentoService.ciudadanosEnApartamento(contenido);
            const felicidadPromedio = ciudadanos.length > 0
                ? apartamentoService.felicidadPromedioApartamento(contenido, ciudadanoService, ciudadActual)
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
        // btnDemoledor.onclick = () => {
        //     if (confirm(`¿Deseas demoler este ${nombre}?`)) {
        //         // Actualizar la matriz en memoria
        //         mapaActual[fila][columna] = null;
        //         ciudadActual.miMapa.matriz[fila][columna] = null;
                
        //         // Guardar los cambios en el JSON
        //         ciudadService.actualizarCiudadCompleta(ciudadActual);

        //         renderizarMapa();
        //         modal.classList.add("hidden");
        //         console.log(`${nombre} demolido en fila ${fila}, columna ${columna}`);
        //     }
        // };

/*         const btnDemoledor = document.getElementById("btnDemoledor");
        btnDemoledor.onclick = () => {
            if (confirm(`¿Deseas demoler este ${nombre}?`)) {
                // ✅ Leer ciudad fresca antes de demoler
                const lista = StorageCiudad.load();
                const params = new URLSearchParams(window.location.search);
                const cityId = Number(params.get("cityId"));
                const ciudadFresca = lista.find(c => c.id === cityId);
                if (ciudadFresca) {
                    ciudadActual = ciudadFresca;
                    mapaActual = ciudadActual.miMapa?.matriz || [];
                    window.mapaActual = mapaActual;
                }
        
                mapaActual[fila][columna] = null;
                ciudadActual.miMapa.matriz[fila][columna] = null;
                mapaService.demolerEdificio(ciudadActual, ciudadActual.miMapa, fila, columna)    
                ciudadService.actualizarCiudadCompleta(ciudadActual);
                renderizarMapa();
                actualizarRecursosDeCiudad();
                modal.classList.add("hidden");
            }
        }; */

        const btnDemoledor = document.getElementById("btnDemoledor");
        btnDemoledor.onclick = () => {
            if (!confirm(`¿Deseas demoler este ${nombre}?`)) return;

            // Leer ciudad fresca antes de operar para evitar pisar estado
            const lista = StorageCiudad.load();
            const params = new URLSearchParams(window.location.search);
            const cityId = Number(params.get("cityId"));
            const ciudadFresca = lista.find(c => c.id === cityId);

            if (ciudadFresca) {
                ciudadActual = ciudadFresca;
                mapaActual = ciudadActual.miMapa?.matriz || [];
                window.mapaActual = mapaActual;
            }

            // Importante: NO hacer null manual antes del servicio
            // Importante: pasar la matriz, no el objeto miMapa completo
            const resultado = mapaService.demolerEdificio(
                ciudadActual,
                ciudadActual.miMapa?.matriz,
                fila,
                columna
            );

            if (!resultado?.ok) {
                alert(resultado?.mensaje || "No se pudo demoler el edificio");
                return;
            }

            ciudadService.actualizarCiudadCompleta(ciudadActual);
            window.mapaActual = ciudadActual.miMapa?.matriz || mapaActual;
            renderizarMapa();
            actualizarRecursosDeCiudad();
            modal.classList.add("hidden");
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

    //Función para manejar el zoom del mapa
    function aplicarZoom() {
        const mapa = document.getElementById("gameMap");
        if (!mapa) return;
        mapa.style.transform = "scale(" + zoomActual + ")";
        mapa.style.transformOrigin = "top left";
        mapa.style.transition = "transform 0.15s ease";
    }

    const btnZoomIn = document.getElementById("btnZoomIn");
    if (btnZoomIn) {
            btnZoomIn.addEventListener("click", function () {
            zoomActual = Math.min(ZOOM_MAX, +(zoomActual + ZOOM_STEP).toFixed(2));
            aplicarZoom();
        });
    }

    const btnZoomOut = document.getElementById("btnZoomOut");
    if (btnZoomOut) {
            btnZoomOut.addEventListener("click", function () {
            zoomActual = Math.max(ZOOM_MIN, +(zoomActual - ZOOM_STEP).toFixed(2));
            aplicarZoom();
        });
    }

    
    // const btnCargarMapa = document.getElementById("btnCargarMapa");
    // if (btnCargarMapa) {
    //     btnCargarMapa.addEventListener("click", async () => {
    //         try {
    //             const nombre = document.getElementById("cityName").value.trim();
    //             const payload = await mapaService.cargarMapaDesdeArchivo();
    //             const id = ciudadService.asignacionId;

    //             if (payload?.tipo === "ciudad") {
    //                 const lista = StorageCiudad.load();
    //                 const ciudadImportada = payload.ciudad;

    //                 ciudadImportada.id = id;
    //                 if (!ciudadImportada.nombre || !ciudadImportada.nombre.trim()) {
    //                     ciudadImportada.nombre = nombre || "Ciudad importada";
    //                 }

    //                 lista.push(ciudadImportada);
    //                 StorageCiudad.save(lista);
    //             } else {
    //                 const matriz = payload?.matriz;
    //                 if (!Array.isArray(matriz) || !matriz.length) {
    //                     throw new Error("El archivo no contiene una matriz valida");
    //                 }

    //                 const nombreCiudad = nombre || "Ciudad importada";
    //                 ciudadService.crearCiudad(id, nombreCiudad, 1, new Mapa(matriz.length));
    //                 const ciudad = ciudadService.cargarCiudad(id);
    //                 ciudadService.asignarMapa(ciudad, matriz);
    //             }

    //             window.location.href = `./newPanel.html?cityId=${id}`;
    //         } catch (error) {
    //             alert("❌ " + error.message);
    //         }
    //     });
    // }
    

    window.construirEdificio = construirEdificio;

    const btnVerRanking = document.getElementById("btn-ver-ranking");
    if (btnVerRanking) {
        btnVerRanking.addEventListener("click", function () {
            renderRankingModal();
        });
    }

    const btnVerRankingMobile = document.getElementById("btn-ver-ranking-mobile");
    if (btnVerRankingMobile) {
        btnVerRankingMobile.addEventListener("click", function () {
            renderRankingModal();
        });
    }

    const btnCerrarRanking = document.getElementById("btnCerrarRanking");
    if (btnCerrarRanking) {
        btnCerrarRanking.addEventListener("click", function () {
            document.getElementById("rankingModal").classList.add("hidden");
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

    const btnExportarCiudad = document.getElementById("btn-exportar-ciudad");
    if (btnExportarCiudad) {
        btnExportarCiudad.addEventListener("click", function () {
            exportarCiudad();
        });
    }

    const botonesModoDemoledor = [
        document.getElementById("btn-modo-eliminar-desktop"),
        document.getElementById("btn-modo-eliminar-mobile")
    ];

    botonesModoDemoledor.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", alternarModoDemoledor);
        }
    });

    actualizarUIBotonModoDemoledor();
    actualizarCursorModoDemoledor();



    // Inicializar con ciudad seleccionada desde query param
    const params = new URLSearchParams(window.location.search);
    const cityIdParam = Number(params.get("cityId"));
    const cityId = Number.isNaN(cityIdParam) ? 1 : cityIdParam;
    cargarCiudad(cityId);
});