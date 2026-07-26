var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db/connection');
const { authenticateToken } = require('../utils/auth');

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos para esta acción' });
  }
  return next();
}

async function hasRoleColumn() {
  try {
    const [rows] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'role'"
    );
    return rows.length > 0;
  } catch (error) {
    return false;
  }
}

router.get('/', authenticateToken, async function(req, res, next) {
  try {
    const roleColumnExists = await hasRoleColumn();
    const query = roleColumnExists
      ? 'SELECT id, username, password, role FROM `user` ORDER BY id ASC'
      : 'SELECT id, username, password FROM `user` ORDER BY id ASC';
    const [rows] = await pool.query(query);
    return res.json(rows.map((row) => ({ id: row.id, username: row.username, password: row.password, role: roleColumnExists ? (row.role || 'cliente') : 'cliente' })));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

router.post('/', authenticateToken, requireAdmin, async function(req, res, next) {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleColumnExists = await hasRoleColumn();
    const roleValue = role || 'cliente';

    const [result] = roleColumnExists
      ? await pool.query('INSERT INTO `user` (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, roleValue])
      : await pool.query('INSERT INTO `user` (username, password) VALUES (?, ?)', [username, hashedPassword]);

    return res.status(201).json({ id: result.insertId, username, role: roleValue });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
});

router.post('/register', async function(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleColumnExists = await hasRoleColumn();

    const [result] = roleColumnExists
      ? await pool.query('INSERT INTO `user` (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'cliente'])
      : await pool.query('INSERT INTO `user` (username, password) VALUES (?, ?)', [username, hashedPassword]);

    return res.status(201).json({ id: result.insertId, username, role: 'cliente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async function(req, res, next) {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const updates = [];
    const values = [];

    if (username) {
      updates.push('username = ?');
      values.push(username);
    }

    if (password) {
      updates.push('password = ?');
      values.push(await bcrypt.hash(password, 10));
    }

    const roleColumnExists = await hasRoleColumn();

    if (roleColumnExists && role) {
      updates.push('role = ?');
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No hay datos para actualizar' });
    }

    values.push(id);
    await pool.query(`UPDATE \`user\` SET ${updates.join(', ')} WHERE id = ?`, values);
    return res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async function(req, res, next) {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM `user` WHERE id = ?', [id]);
    return res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
