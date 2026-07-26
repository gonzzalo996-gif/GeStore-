var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ message: 'Ruta protegida', user: req.user });
});

module.exports = router;
