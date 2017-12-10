var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
//const passport = require('passport');

router.use(flash());

//load user model
require('../models/User');
const User = mongoose.model('users');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
    res.render("users/login");
});

router.get('/register', function(req, res, next) {
    res.render('users/register');
});

//register post
router.post('/register', (req, res) =>{
    let errors = [];

    if(req.body.password !== req.body.password2)
    {
        errors.push({text: 'Passwords do not match'});
    }

    if(req.body.password.length < 4)
    {
        errors.push({text: 'Password must be at least 4 characters long'});
    }

    if(errors.length > 0)
    {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }
    else
    {
        User.findOne({email: req.body.email})
            .then(user => {
                if(user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/login');
                }
                else
                {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'hi '+newUser.name+' you are now registered and can login');
                                    res.redirect('/users/register');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        })
                    });
                    console.log(newUser);
                }
            })

    }
});
module.exports = router;
