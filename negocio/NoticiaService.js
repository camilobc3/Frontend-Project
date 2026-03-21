// negocio/NoticiaService.js

import Noticia from "../modelos/Noticia.js";

export default class NoticiaService {

    //Crea el repositorio para poder usarlo en el servicio
    constructor(noticiasRepository) {
        this.repo = noticiasRepository;
    }

    /**
     * La función obtiene las últimas 5 noticias de una región y las convierte 
     * en objetos Noticia.
     * @param {string} codigoPais - Ej: "co"
     */
    obtenerUltimasNoticias(codigoPais) {

        return this.repo
        /* Con el repositorio se llama a la función getNoticias, que 
        devuelve un array de objetos crudos (artículos). */
            .getNoticias(codigoPais, 5)
            .then(function (articulos) {

                // Filtrar artículos sin título o removidos por NewsAPI
                const validos = articulos.filter(function (a) {
                    return a.title && a.title !== "[Removed]";
                });

                // Se mapean los objetos en JSON que vienen en la promesa y se vuelven objetos Noticia
                // Para poder trabajar con ellos en el NoticiasController y así, poder
                // renderizarlos en el DOM.
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