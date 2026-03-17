import PlantaAguaService from "../negocio/PlantaAguaService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - PlantaAguaController");

    // Función para iniciar la construcción de una Planta de Agua
    window.iniciarConstruccionPlantaAgua = function() {
        console.log("Modo construcción: PlantaAgua activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "U2";
        alert("Selecciona una celda del mapa para construir una Planta de Agua");
    };

    // Agregar listeners a todos los botones de Planta de Agua
    const botonesPlantaAgua = [
        document.getElementById("btn-plantaagua"),
        document.getElementById("btn-plantaagua-tablet"),
        document.getElementById("btn-plantaagua-desktop")
    ];

    botonesPlantaAgua.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionPlantaAgua);
        }
    });
});
