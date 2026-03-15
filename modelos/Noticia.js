// modelos/Noticia.js

class Noticia {
    constructor(titulo, descripcion, urlImagen, urlNoticia, fechaPublicacion, fuente) {
        this.titulo          = titulo          || "Sin título";
        this.descripcion     = descripcion     || "Sin descripción";
        this.urlImagen       = urlImagen       || null;
        this.urlNoticia      = urlNoticia      || "#";
        this.fechaPublicacion = fechaPublicacion || new Date().toISOString();
        this.fuente          = fuente          || "Desconocida";
    }
}