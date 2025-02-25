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
        where.tipo = { [Op.in]: ["entrada", "salida"] };

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
                    attributes:['id','name','lastName','lastName2','rut','avatar','role','email','horas_servicio'],
                    include: [
                        {
                          model: models.Centros, // Relación con Centro
                          as: 'centros', // Alias definido en el modelo User
                          attributes: ['id', 'nombre']
                        },
                        {
                          model: models.Cargos, // Relación con Cargo
                          as: 'cargos', // Alias definido en el modelo User
                          attributes: ['id', 'nombre']
                        }
                      ]
                  },
            ],
            where,
            order: [['fecha', 'DESC'],['id','ASC']] 
        }

          // Si viene centro_id en la consulta, filtrar usuarios que pertenezcan a ese centro
        if (query.centro_id != null) {
            options.include[0].where = { centro_id: query.centro_id };
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

    async update(id, changes) {
        const model = await this.findOne(id);
        const result = await model.update(changes);
        return result;
    }

    async delete(id) {
        const model = await this.findOne(id);
        const result = await model.destroy();
        return result;
    }
}

module.exports = MarcacionesServices;
