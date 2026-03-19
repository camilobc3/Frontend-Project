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

    if (poblacionElem) poblacionElem.textContent = String(ciudad.misCiudadanos?.length || 0);
    if (felicidadElem) felicidadElem.textContent = `${promedioFelicidad(ciudad)}%`;
    if (electricidadElem) electricidadElem.textContent = `${produccion.electricidad} / ${consumo.electricidad}`;
    if (aguaElem) aguaElem.textContent = `${produccion.agua} / ${consumo.agua}`;
    if (alimentoElem) alimentoElem.textContent = String(ciudad.alimento || 0);
    if (turnoElem) turnoElem.textContent = String(ciudad.turno || 0);

    if (dineroLine) {
        dineroLine.setAttribute("title",
            `Producción: ${formatMoney(produccion.dinero)}\nConsumo: ${formatMoney(consumo.dinero || 0)}\nBalance neto: ${formatMoney(produccion.dinero - (consumo.dinero || 0))}`
        );
    }

    const buildTooltip = (produccionVal, consumoVal, nombre) => {
        return `${nombre} Producción: ${produccionVal}\nConsumo: ${consumoVal}\nBalance: ${produccionVal - consumoVal}`;
    };

    const energiaLine = document.getElementById("energia-line");
    if (energiaLine) energiaLine.setAttribute("title", buildTooltip(produccion.electricidad, consumo.electricidad, "Electricidad:"));
    const aguaLine = document.getElementById("agua-line");
    if (aguaLine) aguaLine.setAttribute("title", buildTooltip(produccion.agua, consumo.agua, "Agua:"));
    const alimentoLine = document.getElementById("alimento-line");
    if (alimentoLine) alimentoLine.setAttribute("title", `Producción: ${produccion.alimento}\nConsumo: 0\nBalance: ${produccion.alimento}`);
    const poblacionLine = document.getElementById("poblacion-line");
    if (poblacionLine) poblacionLine.setAttribute("title", `Población actual: ${ciudad.misCiudadanos?.length || 0}`);
    const felicidadLine = document.getElementById("felicidad-line");
    if (felicidadLine) felicidadLine.setAttribute("title", `Felicidad promedio de los ciudadanos: ${promedioFelicidad(ciudad)}%`);
}
