/* import { NEWS_API_KEY } from "../../config.js"; // ajusta la ruta según desde dónde importes
import noticiasRepository from "../../acceso_datos/noticiasRepository.js";

const repo = new noticiasRepository(undefined, NEWS_API_KEY); */
class noticiasRepository {
    
    constructor(baseUrl = "https://newsapi.org/v2/top-headlines", apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    getNoticias(codigoPais) {
        return fetch(this.baseUrl + "?country=" + codigoPais + "&apiKey=" + this.apiKey).then(function (res) {
            if (!res.ok) {
                throw new Error("Error al obtener noticias");
            }
            return res.json();
        });
    }

    getUltimasNoticias(codigoPais, cantidad = 5) {
        return this.getNoticias(codigoPais).then(function (response) {
            return response.articles.slice(0, cantidad);
        });
    }

    getNoticiaPorId(id) {
        return fetch(this.baseUrl + "/" + id + "&apiKey=" + this.apiKey).then(function (res) {
            if (!res.ok) {
                throw new Error("Error al obtener noticia");
            }
            return res.json();
        });
    }
}

