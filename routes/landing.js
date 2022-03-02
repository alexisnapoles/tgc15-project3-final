const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Aye! This is you doing the best you can! Failure is just a stepping stone to becoming great; Go on lad, Keep going!')
});

module.exports = router;