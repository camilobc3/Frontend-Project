import CiudadService from "../negocio/CiudadService.js";
const ciudadService = new CiudadService();
import { obtenerRegiones } from "../api/RegionesApi.js";

function cargarRegiones() {
    const regionSelect = document.getElementById("region");
    if (!regionSelect) return;

    obtenerRegiones()
        .then(data => {
            data.forEach(r => {
                const option = document.createElement("option");
                option.value = r.name;
                option.textContent = r.name;
                regionSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("No se pudieron cargar regiones:", error);
        });
}

function crearTarjetaCiudad(ciudad) {
    const card = document.createElement("div");
    card.className = "group cursor-pointer rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300";
    card.dataset.ciudadId = ciudad.id;

    const imageWrap = document.createElement("div");
    imageWrap.className = "w-full h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center";

    const icon = document.createElement("div");
    icon.className = "text-5xl";
    icon.textContent = "🏙️";

    const body = document.createElement("div");
    body.className = "p-4";

    const title = document.createElement("div");
    title.className = "text-center font-semibold text-lg";
    title.textContent = ciudad.nombre || "Ciudad sin nombre";

    const idText = document.createElement("div");
    idText.className = "mt-1 text-center text-xs text-slate-400";
    idText.textContent = "ID: " + ciudad.id;

    imageWrap.appendChild(icon);
    body.appendChild(title);
    body.appendChild(idText);
    card.appendChild(imageWrap);
    card.appendChild(body);

    return card;
}

function renderizarCiudadesMenu() {
    const gridCiudades = document.getElementById("gridCiudades");
    const btnNuevaCiudad = document.getElementById("btnNuevaCiudad");
    if (!gridCiudades || !btnNuevaCiudad) return;

    gridCiudades.querySelectorAll("[data-ciudad-id]").forEach(el => el.remove());

    const ciudades = ciudadService.cargarCiudades();
    ciudades.forEach(ciudad => {
        const card = crearTarjetaCiudad(ciudad);
        gridCiudades.insertBefore(card, btnNuevaCiudad);
    });
}


document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CiudadController");

    cargarRegiones();
    renderizarCiudadesMenu();

    

    // ✅ Form solo si existe (está en nuevaCiudad.html)
    const createCityForm = document.getElementById("createCityForm");
    if (createCityForm) {
        createCityForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const nickname     = document.getElementById("nickname").value;
            const nombreCiudad = document.getElementById("cityName").value;
            const mapSize      = document.getElementById("mapSize").value;
            const region       = document.getElementById("region").value;
            const id    = Date.now();
            const turno = 1;

            const creada = ciudadService.crearCiudad(id, nombreCiudad, turno, mapSize, region);
            if (creada) {
                window.location.href = "./menuCiudades.html";
            }
        });
    }

    // ✅ Menú móvil
    const btnMobileMenu     = document.getElementById("btnMobileMenu");
    const btnCloseMobileMenu = document.getElementById("btnCloseMobileMenu");
    const sidebarMobile     = document.getElementById("sidebarMobile");
    const sidebarOverlay    = document.getElementById("sidebarOverlay");

    function abrirMenu() {
        sidebarMobile.classList.add("translate-x-0");
        sidebarMobile.classList.remove("-translate-x-full");
    }

    function cerrarMenu() {
        sidebarMobile.classList.add("-translate-x-full");
        sidebarMobile.classList.remove("translate-x-0");
    }

    if (btnMobileMenu)      btnMobileMenu.addEventListener("click", abrirMenu);
    if (btnCloseMobileMenu) btnCloseMobileMenu.addEventListener("click", cerrarMenu);
    if (sidebarOverlay)     sidebarOverlay.addEventListener("click", cerrarMenu);

    // ✅ Botón nueva ciudad
    const btnNuevaCiudad = document.getElementById("btnNuevaCiudad");
    if (btnNuevaCiudad) {
        btnNuevaCiudad.addEventListener("click", function () {
            window.location.href = "./nuevaCiudad.html";
        });
    }
});