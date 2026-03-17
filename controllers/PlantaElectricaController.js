import PlantaElectricaService from "../negocio/PlantaElectricaService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - PlantaElectricaController");

    // Función para iniciar la construcción de una Planta Eléctrica
    window.iniciarConstruccionPlantaElectrica = function() {
        console.log("Modo construcción: PlantaElectrica activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "U1";
        alert("Selecciona una celda del mapa para construir una Planta Eléctrica");
    };

    // Agregar listeners a todos los botones de Planta Eléctrica
    const botonesPlantaElectrica = [
        document.getElementById("btn-plantaelectrica"),
        document.getElementById("btn-plantaelectrica-tablet"),
        document.getElementById("btn-plantaelectrica-desktop")
    ];

    botonesPlantaElectrica.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionPlantaElectrica);
        }
    });
});
