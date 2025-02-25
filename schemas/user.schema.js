const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(5);
const name = Joi.string();
const lastName = Joi.string();
const avatar = Joi.string();
const confirmPassword = Joi.string().min(8);
const centro_id = Joi.number().integer();
const cargo_id = Joi.number().integer();
const rut = Joi.string();
const lastName2 = Joi.string();
const horas_servicio = Joi.string();

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: role.required(),
  name:name.required(),
  lastName:lastName.required(),
  lastName2:lastName2.required(),
  rut:rut.required(),
  avatar:avatar.required(),
  confirmPassword:confirmPassword.required(),
  cargo_id:cargo_id.required(),
  centro_id:centro_id.required(),
  horas_servicio:horas_servicio.required()
});


const updateUserSchema = Joi.object({
  email: email,
  role: role,
  avatar:avatar,
  lastName:lastName,
  name:name,
  lastName2:lastName2,
  rut:rut,
  cargo_id:cargo_id,
  centro_id:centro_id,
  horas_servicio:horas_servicio
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
