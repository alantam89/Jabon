const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

//Map Global Promise - getes rid of mongoose warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//method override middlemware
router.use(methodOverride('_method'));

//Express session middleware
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

router.use(flash());

//Global Variables
router.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//ideas index
router.get('/', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
});
//ideas add
router.get('/add', (req, res) => {
    res.render('ideas/add');
});
//idea edit
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    })
        .catch((error) => res.send('error: '+error));
});

//idea add post request
router.post('/', (req, res) => {
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }

    if(errors.length > 0)
    {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else
    {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video successfully added');
                res.redirect('/ideas');
            })
    }
});

//edit form process
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then( () => {
                    req.flash('success_msg', 'Video successfully edited');
                    res.redirect('/ideas');
                })
        });
});

//delete
router.delete('/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        })
});

module.exports = router;