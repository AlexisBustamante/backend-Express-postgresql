const id = require('faker/lib/locales/id_ID');
const pool = require('../libs/postgres.pool');
const { models } = require('./../libs/sequelize');
const { Model, Op, DataTypes, Sequelize } = require('sequelize');
const boom = require('@hapi/boom');

class CentrosServices {
    constructor() {
        // this.pool = pool;
        // this.pool.on("error", (err) => console.log(eror));
    }

    async create(data) {
        const newRecord = await models.Centros.create(data)
        return newRecord;
    }

    async findAllRecords() {
        const records = await models.Centros.findAll();
        return records;
    }

    async findOne(id) {
        const records = await models.Centros.findByPk(id);
        if (!records) {
            throw boom.notFound('Centros not found');
        }
        return records;
    }

    async update(id, changes) {
        const model = await this.findOne(id);
        const record = await model.update(changes);
        if (!record) {
            throw boom.notFound('Centros not found');
        }
        return record;
    }

    async delete(id) {
        const record = await this.findOne(id);
        await record.destroy();
        return { rta: true };
    }

}

module.exports = CentrosServices;
