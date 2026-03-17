import CentroComercialService from "../negocio/CentroComercialService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CentroComercialController");

    // Función para iniciar la construcción de un Centro Comercial
    window.iniciarConstruccionCentroComercial = function() {
        console.log("Modo construcción: CentroComercial activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "C2";
        alert("Selecciona una celda del mapa para construir un Centro Comercial");
    };

    // Agregar listeners a todos los botones de Centro Comercial
    const botonesCentroComercial = [
        document.getElementById("btn-centrocomercial"),
        document.getElementById("btn-centrocomercial-tablet"),
        document.getElementById("btn-centrocomercial-desktop")
    ];

    botonesCentroComercial.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionCentroComercial);
        }
    });
});
