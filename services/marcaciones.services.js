const pool = require('../libs/postgres.pool');
const { models } = require('./../libs/sequelize');

class MarcacionesServices {
    constructor() {
        // this.pool = pool;
        // this.pool.on("error", (err) => console.log(eror));
    }

    async create(data) {
        const newRecord = await models.Marcaciones.create(data)
        return newRecord;
    }

    async findAllRecords() {
        const records = await models.Marcaciones.findAll();
        return records;
    }

    async findOne(id) {
        const records = await models.Marcaciones.findByPk(id);
        if (!records) {
            throw boom.notFound('Marcaciones not found');
        }
        return records;
    }

    async find(query = {}) {

        let where = {};
        if (query.usuario_id != null) {
            where.usuario_id = query.usuario_id
        }
        if (query.tipo != null) {
            where.tipo = query.tipo
        }
        if (query.fecha != null) {
            where.fecha = query.fecha
        }
        const options = {
            include: [
                {
                    model:models.User,
                    as:'users',
                    attributes:['id','name','lastName','avatar','role','email']
                  },
            ],
            where
        }

        
        const records = await models.Marcaciones.findAll(options);
        if (!records) {
            throw boom.notFound('Marcaciones not found');
        }
        return records;
    }
}

module.exports = MarcacionesServices;
