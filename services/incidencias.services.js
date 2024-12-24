const pool = require('../libs/postgres.pool');
const { models } = require('./../libs/sequelize');

class IncidenciasServices{
    constructor (){
        this.pool = pool;
        this.pool.on("error", (err) => console.log(eror));
    }

    async create(data) {
        const newIncidencias = await models.Incidencias.create(data)
        return newIncidencias;
      }
}

module.exports = IncidenciasServices;
