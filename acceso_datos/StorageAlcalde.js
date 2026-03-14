const StorageAlcalde = {

    key: "alcaldes",

    /**
     * Guarda un nuevo alcalde
     * @param {Alcalde} alcalde
     */
    save(alcalde) {
        let alcaldes = this.findAll();
        alcaldes.push(alcalde);
        localStorage.setItem(this.key, JSON.stringify(alcaldes));
    },

    /**
     * Retorna todos los alcaldes
     */
    findAll() {

        let datos = localStorage.getItem(this.key);
        if (datos === null) {
            return [];
        }
        return JSON.parse(datos);
    },

    /**
     * Busca un alcalde por id
     * @param {number} id
     */
    findById(id) {
        let alcaldes = this.findAll();
        return alcaldes.find(alcalde => alcalde.id === id);
    },

    /**
     * Actualiza un alcalde
     * @param {number} id
     * @param {Alcalde} nuevoAlcalde
     */
    update(id, nuevoAlcalde) {
        let alcaldes = this.findAll();
        let index = alcaldes.findIndex(a => a.id === id);
        if (index !== -1) {
            alcaldes[index] = nuevoAlcalde;
        }
        localStorage.setItem(this.key, JSON.stringify(alcaldes));
    },

    /**
     * Elimina un alcalde
     * @param {number} id
     */
    delete(id) {
        let alcaldes = this.findAll();
        alcaldes = alcaldes.filter(a => a.id !== id);
        localStorage.setItem(this.key, JSON.stringify(alcaldes));
    }

};

export default StorageAlcalde;