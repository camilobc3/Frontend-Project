import FabricaService from "../negocio/FabricaService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - FabricaController");

    // Función para iniciar la construcción de una Fábrica
    window.iniciarConstruccionFabrica = function() {
        console.log("Modo construcción: Fabrica activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "I1";
        alert("Selecciona una celda del mapa para construir una Fábrica");
    };

    // Agregar listeners a todos los botones de Fábrica
    const botonesFabrica = [
        document.getElementById("btn-fabrica"),
        document.getElementById("btn-fabrica-tablet"),
        document.getElementById("btn-fabrica-desktop")
    ];

    botonesFabrica.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionFabrica);
        }
    });
});
