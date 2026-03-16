// negocio/NoticiaService.js

import Noticia from "../modelos/Noticia.js";

export default class NoticiaService {

    constructor(noticiasRepository) {
        this.repo = noticiasRepository;
    }

    /**
     * Obtiene las últimas 5 noticias de una región y las convierte en objetos Noticia.
     * @param {string} codigoPais - Ej: "co"
     */
    obtenerUltimasNoticias(codigoPais) {
        return this.repo
            .getNoticias(codigoPais, 5)
            .then(function (articulos) {

                // Filtrar artículos sin título o removidos por NewsAPI
                const validos = articulos.filter(function (a) {
                    return a.title && a.title !== "[Removed]";
                });

                // Mapear artículos crudos → objetos Noticia
                return validos.slice(0, 5).map(function (a) {
                    return new Noticia(
                        a.title,
                        a.description,
                        a.urlToImage,
                        a.url,
                        a.publishedAt,
                        a.source ? a.source.name : "Desconocida"
                    );
                });
            });
    }
}