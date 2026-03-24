// acceso_datos/noticiasRepository.js

export default class NoticiasRepository {

    constructor(apiKey, baseUrl = "https://newsapi.org/v2/top-headlines") {
        this.apiKey  = apiKey;
        this.baseUrl = baseUrl;
    }

    /**
     * Obtiene las últimas noticias por código de país.
     * @param {string} codigoPais  - Ej: "co", "us", "mx"
     * @param {number} cantidad    - Cuántas noticias traer (default 5)
     */
    getNoticias(codigoPais, cantidad = 5) {
        const url = `${this.baseUrl}?q=${codigoPais}&pageSize=${cantidad}&apiKey=${this.apiKey}`;

        return fetch(url)
            .then(function (res) {
                if (!res.ok) {
                    throw new Error("Error al obtener noticias: " + res.status);
                }
                return res.json();
            })

            //Recibe el objeto js que viene del json  de la API
            //pero verifica que no hayna errores internos ej: apikey ivalida, etc.
            //si todo esta bien, devuelve el array de noticias.
            .then(function (data) {
                // NewsAPI devuelve { status, totalResults, articles: [...] }
                if (data.status !== "ok") {
                    throw new Error("NewsAPI respondió con error: " + data.message);
                }
                return data.articles; // array de noticias 
            });
    }
}