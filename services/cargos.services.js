const id = require('faker/lib/locales/id_ID');
const pool = require('../libs/postgres.pool');
const { models } = require('./../libs/sequelize');
const { Model, Op, DataTypes, Sequelize } = require('sequelize');
const boom = require('@hapi/boom');

class CargosServices {
    constructor() {
        // this.pool = pool;
        // this.pool.on("error", (err) => console.log(eror));
    }

    async create(data) {
        const newRecord = await models.Cargos.create(data)
        return newRecord;
    }

    async findAllRecords() {
        const records = await models.Cargos.findAll();
        return records;
    }

    async findOne(id) {
        const records = await models.Cargos.findByPk(id);
        if (!records) {
            throw boom.notFound('Cargos not found');
        }
        return records;
    }

    async update(id, changes) {
        const model = await this.findOne(id);
        const record = await model.update(changes);
        if (!record) {
            throw boom.notFound('Cargos not found');
        }
        return record;
    }

    async delete(id) {
        const record = await this.findOne(id);
        await record.destroy();
        return { rta: true };
    }

}

module.exports = CargosServices;
