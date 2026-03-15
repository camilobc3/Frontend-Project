import noticiasRepository from "../acceso_datos/noticiasRepository.js";
import { NEWS_API_KEY } from "../../config.js";

class noticiasService {
    constructor() {
        this.repo = new noticiasRepository(undefined, NEWS_API_KEY);
    }

    obtenerUltimasNoticias(codigoPais = "us") {
        return this.repo.getUltimasNoticias(codigoPais, 5);
    }
}

export default noticiasService;