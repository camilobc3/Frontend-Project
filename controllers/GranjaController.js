import GranjaService from "../negocio/GranjaService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - GranjaController");

    // Función para iniciar la construcción de una Granja
    window.iniciarConstruccionGranja = function() {
        console.log("Modo construcción: Granja activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "I2";
        alert("Selecciona una celda del mapa para construir una Granja");
    };

    // Agregar listeners a todos los botones de Granja
    const botonesGranja = [
        document.getElementById("btn-granja"),
        document.getElementById("btn-granja-tablet"),
        document.getElementById("btn-granja-desktop")
    ];

    botonesGranja.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionGranja);
        }
    });
});
