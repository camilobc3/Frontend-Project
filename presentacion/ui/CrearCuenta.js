import StorageAlcalde from "../../acceso_datos/StorageAlcalde.js";

const formulario = document.getElementById("crear-formulario");

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
    const confirmar = document.getElementById("confirmar-contrasena").value;

    if(usuario === "" || contrasena === ""){
        alert("Debes ingresar usuario y contraseña");
        return;
    }

    if(contrasena !== confirmar){
        alert("Las contraseñas no coinciden");
        return;
    }

    const alcaldes = StorageAlcalde.findAll();

    const existe = alcaldes.find(a => a.nombre === usuario);

    if(existe){
        alert("Ese alcalde ya existe");
        return;
    }

    const nuevoAlcalde = {
        id: Date.now(),
        nombre: usuario,
        contrasena: contrasena
    };

    StorageAlcalde.save(nuevoAlcalde);

    alert("Cuenta creada correctamente");

    window.location.href = "nuevaCiudad.html"; // volver al login
});