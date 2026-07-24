var express = require('express');
var router = express.Router();

/* POST users listing. */
router.post('/', function(req, res, next) {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.send('Inicio de sesión exitoso');
  } else {
    res.status(401).send('Nombre de usuario o contraseña incorrectos');
  }
});

module.exports = router;
