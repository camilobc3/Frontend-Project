import CaminoService from "../negocio/CaminoService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CaminoController");

    // Función para iniciar la construcción de un Camino
    window.iniciarConstruccionCamino = function() {
        console.log("Modo construcción: Camino activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "R";
        alert("Selecciona una celda del mapa para construir un Camino");
    };

    // Agregar listeners a todos los botones de Camino
    const botonesCamino = [
        document.getElementById("btn-camino"),
        document.getElementById("btn-camino-tablet"),
        document.getElementById("btn-camino-desktop")
    ];

    botonesCamino.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionCamino);
        }
    });
});
