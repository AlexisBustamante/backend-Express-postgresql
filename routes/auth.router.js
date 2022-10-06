const express = require('express');
const passport = require('passport');

const router = express.Router();
//passport se utiliza como un middlewares
router.post('/login',
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {

        try {
            res.json(req.user);//el usuer que entrega el middelware de passport
        } catch (error) {
            next(error);
        }

    })

module.exports = router;