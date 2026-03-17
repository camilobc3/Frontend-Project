// ✅ Botón nueva ciudad
const nuevaCiudad = document.getElementById("btnNuevaCiudad");

nuevaCiudad.addEventListener("click", function () {
    window.location.href = "./nuevaCiudad.html";
});

const cerrarSesion = document.getElementById("cerrar-sesion");

cerrarSesion.addEventListener("click", function () {
    alert("Cerraste la sesion");
    window.location.href = "./ingreso.html"; 
});

