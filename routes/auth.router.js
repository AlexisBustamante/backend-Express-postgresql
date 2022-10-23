const express = require('express');
const {config} = require('./../config/config');///tengo la config para tener secret
const passport = require('passport');
const router = express.Router();
const AuthService = require('./../services/auth.services')
const service = new AuthService();
const bcrypt = require('bcrypt');

//passport se utiliza como un middlewares

router.post('/login',
    passport.authenticate('local', { session: false }),

    async (req, res, next) => {
        try {
            res.json(service.signToken(req.user));//el usuer que entrega el middelware de passport
        } catch (error) {
            next(error);
        }

    })

router.post('/recovery',
    async (req, res, next) => {

        try {
            const {email} = req.body;
            const token = jwt.sign(payload,config.jwtSecret);
            
            res.json({
                user,
                token
            });//el usuer que entrega el middelware de passport
        } catch (error) {
            next(error);
        }

    })


module.exports = router;