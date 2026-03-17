import HospitalService from "../negocio/HospitalService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - HospitalController");

    // Función para iniciar la construcción de un Hospital
    window.iniciarConstruccionHospital = function() {
        console.log("Modo construcción: Hospital activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "S1";
        alert("Selecciona una celda del mapa para construir un Hospital");
    };

    // Agregar listeners a todos los botones de Hospital
    const botonesHospital = [
        document.getElementById("btn-hospital"),
        document.getElementById("btn-hospital-tablet"),
        document.getElementById("btn-hospital-desktop")
    ];

    botonesHospital.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionHospital);
        }
    });
});
