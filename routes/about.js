const express = require('express');
const router = express.Router();

//about page
router.get('/', (req, res) => {
    res.render('about');
});

module.exports = router;