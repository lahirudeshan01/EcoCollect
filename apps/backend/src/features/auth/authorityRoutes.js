const express = require('express');
const router = express.Router();
const { loginAuthority } = require('./authorityController');

router.post('/login', loginAuthority);

module.exports = router;
