import StorageAlcalde from "../../acceso_datos/StorageAlcalde.js";

const formulario = document.getElementById("login-formulario");
const ingresar = document.getElementById("iniciar-sesion");
const registrar = document.getElementById("crear-cuenta");

ingresar.addEventListener("click", function(e){

    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if(usuario === "" || contrasena === ""){
        alert("Debes ingresar usuario y contraseña");
        return;
    }
    
    const alcaldes = StorageAlcalde.findAll();

    const alcalde = alcaldes.find(a => 
    a.nombre === usuario && a.contrasena === contrasena);

    if(alcalde){
        localStorage.setItem("currentMayor", alcalde.nombre);
        alert("Bienvenido alcalde " + alcalde.nombre);
        window.location.href = "menuCiudades.html";
    } else {
        alert("Usuario o contraseña incorrectos");
        document.getElementById("usuario").value = "";
        document.getElementById("contrasena").value = "";
        window.location.href = "ingreso.html";
    }
});

registrar.addEventListener("click", function(e){

    e.preventDefault();
    window.location.href = "crear-cuenta.html";
});