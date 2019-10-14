const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//LOGIN
router.get(
    '/abc',
    passport.authenticate('jwt', { session: false }),
    (_req, res) => res.status(200).json({ result: 'No elo, mordo.' })
);

//REGISTER
router.get('/register', (req,res) => res.json({ message: "WELCOME FROM REGISTER" }));

//REGISTER USER
router.post('/register', (req,res) => {
    const { name, surname, login, password } = req.body;
    const newUser = new User({ name,surname,login,password });

    //hash user password
    bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password, salt, (error,hash) => {
        if(error) throw error;
        newUser.password = hash;
        newUser.save()
            .then(user => res.json({ message: 'user added', user }))
            .catch(err => console.log(err));
    }));
});

//LOGIN USER
router.post('/login', (req,res) => {
    const { login,password } = req.body;
    User.findOne({login})
        .then(user => {
            if(user == null) {
                res.status(401).json({ message: 'error' });
                return
            }
            //check password
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if(error) throw error;
                if(isMatch) {
                    const payload = { login: user.login };
                    const token = jwt.sign(payload,'user');
                    res.json({ message: 'Succes', token });
                }else {
                    res.json({message: 'Wrong password'});
                }
            })
        })
        .catch(err => console.log(err));
});

module.exports = router;