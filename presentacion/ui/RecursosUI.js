import CiudadService from "../../negocio/CiudadService.js";

const ciudadService = new CiudadService();

export function calcularBalanceRecursos(ciudad) {
    const produccion = { dinero: 0, agua: 0, electricidad: 0, alimento: 0 };
    const consumo = { agua: 0, electricidad: 0 };

    if (Array.isArray(ciudad.misEdificios)) {
        ciudad.misEdificios.forEach(edificio => {
            if (edificio && edificio.activo !== false) {
                produccion.dinero += edificio.produccionXTurno?.() || 0;
                produccion.agua += edificio.produccionAgua?.() || 0;
                produccion.electricidad += edificio.produccionElectricidad?.() || 0;
                produccion.alimento += edificio.produccionAlimento?.() || 0;

                consumo.agua += edificio.consumoAgua?.() || 0;
                consumo.electricidad += edificio.consumoElectricidad?.() || 0;
            }
        });
    }

    return { produccion, consumo };
}

export function promedioFelicidad(ciudad) {
    if (!Array.isArray(ciudad.misCiudadanos) || ciudad.misCiudadanos.length === 0) return 0;
    const total = ciudad.misCiudadanos.reduce((acc, c) => acc + (c.felicidad || 0), 0);
    return Math.round(total / ciudad.misCiudadanos.length);
}

export function formatMoney(valor) {
    return "$" + Number(valor).toLocaleString("es-CO");
}

export function actualizarPanelRecursos(ciudad) {
    if (!ciudad) return;
    
    console.log("Actualizando panel. Población:", ciudadService.numeroCiudadanos(ciudad));

    const { produccion, consumo } = calcularBalanceRecursos(ciudad);
    const netoEnergia = produccion.electricidad - consumo.electricidad;
    const netoAgua = produccion.agua - consumo.agua;

    const dineroElem = document.getElementById("dinero");
    const dineroLine = document.getElementById("dinero-line");
    const poblacionElem = document.getElementById("poblacion");
    const felicidadElem = document.getElementById("felicidad");
    const electricidadElem = document.getElementById("energia");
    const aguaElem = document.getElementById("agua");
    const alimentoElem = document.getElementById("alimento");
    const turnoElem = document.getElementById("turno");

    if (dineroElem) {
        dineroElem.textContent = formatMoney(ciudad.dinero ?? 0);
        dineroElem.classList.remove("text-emerald-400", "text-amber-300", "text-rose-400");
        if (ciudad.dinero > 10000) {
            dineroElem.classList.add("text-emerald-400");
        } else if (ciudad.dinero < 1000) {
            dineroElem.classList.add("text-rose-400");
        } else if (ciudad.dinero < 5000) {
            dineroElem.classList.add("text-amber-300");
        }
    }

    if (poblacionElem) poblacionElem.textContent = String(ciudadService.numeroCiudadanos(ciudad) || 0);
    if (felicidadElem) felicidadElem.textContent = `${promedioFelicidad(ciudad)}%`;
    if (electricidadElem) electricidadElem.textContent = `${consumo.electricidad} / ${produccion.electricidad}`;
    if (aguaElem) aguaElem.textContent = `${consumo.agua} / ${produccion.agua}`;
    if (alimentoElem) alimentoElem.textContent = String(ciudad.alimento || 0);
    if (turnoElem) turnoElem.textContent = String(ciudad.turno || 0);

    if (dineroLine) {
        dineroLine.setAttribute("title",
            `Producción: ${formatMoney(produccion.dinero)}\nConsumo: ${formatMoney(consumo.dinero || 0)}\nBalance neto: ${formatMoney(produccion.dinero - (consumo.dinero || 0))}`
        );
    }

    const buildTooltip = (consumoVal, produccionVal, nombre) => {
        return `${nombre} Consumo: ${consumoVal}\nReserva: ${produccionVal}\nBalance: ${produccionVal - consumoVal}`;
    };

    const energiaLine = document.getElementById("energia-line");
    if (energiaLine) energiaLine.setAttribute("title", buildTooltip(consumo.electricidad, produccion.electricidad, "Electricidad:"));
    const aguaLine = document.getElementById("agua-line");
    if (aguaLine) aguaLine.setAttribute("title", buildTooltip(consumo.agua, produccion.agua, "Agua:"));
    const alimentoLine = document.getElementById("alimento-line");
    if (alimentoLine) alimentoLine.setAttribute("title", `Producción: ${produccion.alimento}\nConsumo: 0\nBalance: ${produccion.alimento}`);
    const poblacionLine = document.getElementById("poblacion-line");
    if (poblacionLine) poblacionLine.setAttribute("title", `Población actual: ${ciudadService.numeroCiudadanos(ciudad)}`);
    const felicidadLine = document.getElementById("felicidad-line");
    if (felicidadLine) felicidadLine.setAttribute("title", `Felicidad promedio de los ciudadanos: ${promedioFelicidad(ciudad)}%`);

    // Actualizar recursos móviles
    const dineroMobile = document.getElementById("dinero-mobile");
    if (dineroMobile) dineroMobile.textContent = formatMoney(ciudad.dinero ?? 0);
    const poblacionMobile = document.getElementById("poblacion-mobile");
    if (poblacionMobile) poblacionMobile.textContent = String(ciudadService.numeroCiudadanos(ciudad) || 0);
    const energiaMobile = document.getElementById("energia-mobile");
    if (energiaMobile) energiaMobile.textContent = String(netoEnergia);
    const aguaMobile = document.getElementById("agua-mobile");
    if (aguaMobile) aguaMobile.textContent = String(netoAgua);
    const felicidadMobile = document.getElementById("felicidad-mobile");
    if (felicidadMobile) felicidadMobile.textContent = `${promedioFelicidad(ciudad)}%`;

    // Actualizar recursos tablet
    const dineroTablet = document.getElementById("dinero-tablet");
    if (dineroTablet) dineroTablet.textContent = formatMoney(ciudad.dinero ?? 0);
    const poblacionTablet = document.getElementById("poblacion-tablet");
    if (poblacionTablet) poblacionTablet.textContent = String(ciudadService.numeroCiudadanos(ciudad) || 0);
    const energiaTablet = document.getElementById("energia-tablet");
    if (energiaTablet) energiaTablet.textContent = String(netoEnergia);
    const aguaTablet = document.getElementById("agua-tablet");
    if (aguaTablet) aguaTablet.textContent = String(netoAgua);
    const felicidadTablet = document.getElementById("felicidad-tablet");
    if (felicidadTablet) felicidadTablet.textContent = `${promedioFelicidad(ciudad)}%`;
}
