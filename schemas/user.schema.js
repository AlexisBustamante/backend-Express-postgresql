const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(5);
const name = Joi.string();
const lastName = Joi.string();
const avatar = Joi.string();
const confirmPassword = Joi.string().min(8);

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: role.required(),
  name:name.required(),
  lastName:lastName.required(),
  avatar:avatar.required(),
  confirmPassword:confirmPassword.required(),
});


const updateUserSchema = Joi.object({
  email: email,
  role: role,
  avatar:avatar,
  lastName:lastName,
  name:name
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
