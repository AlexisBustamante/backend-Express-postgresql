const id = require('faker/lib/locales/id_ID');
const pool = require('../libs/postgres.pool');
const { models } = require('./../libs/sequelize');
const { Model, Op, DataTypes, Sequelize } = require('sequelize');

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

        if (query.tipo != null) {
            where.tipo = query.tipo
        }
        if (query.fecha != null) {
            where.fecha = query.fecha
        }
        if (query.between != null) {
            if (query.between.startDate && query.between.endDate) {
                where.fecha = {
                    [Op.between]: [query.between.startDate, query.between.endDate]
                };
            }
        }
        if (query.usuario_id != null) {
            where.usuario_id = query.usuario_id
        }
        
        const options = {
            include: [
                {
                    model:models.User,
                    as:'users',
                    attributes:['id','name','lastName','avatar','role','email']
                  },
            ],
            where,
            order: [['fecha', 'DESC'],['id','ASC']] 
        }
        
        const records = await models.Marcaciones.findAll(options);
        if (!records) {
            throw boom.notFound('Marcaciones not found');
        }
        return records;
    }

    async getForDashboard() {
        const result = await models.Marcaciones.findAll({
            attributes: ['tipo', [Sequelize.fn('COUNT', Sequelize.col('tipo')), 'count']],
            group: ['tipo'],
          });
        return result;
    }
}

module.exports = MarcacionesServices;
