var express = require('express');
var router = express.Router();
const pool = require('../db/connection');

/* POST users listing. */
router.post('/', async function(req, res, next) {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.send('Inicio de sesión exitoso');
    } else {
      res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
