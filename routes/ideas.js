const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');

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
                    res.redirect('/ideas');
                })
        });
});

//delete
router.delete('/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/ideas');
        })
});

module.exports = router;