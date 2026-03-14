import Noticia from "../modelos/Noticia.js";

class noticiasRepository {
    constructor(baseUrl = "https://newsapi.org/v2/top-headlines", apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
/* https://newsapi.org/v2/top-headlines?country={code} */
    getUltimasNoticias(codigoPais, cantidad = 5) {
        return fetch(`${this.baseUrl}?country=${codigoPais}&apiKey=${this.apiKey}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener noticias");
                return res.json();
            })
            .then(response => {
                return response.articles.slice(0, cantidad).map(article =>
                    new Noticia(
                        article.title,
                        article.description,
                        article.urlToImage,
                        article.url,
                        article.publishedAt
                    )
                );
            });
    }
}

export default noticiasRepository;