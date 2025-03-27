const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Obtener todas las asistencias
router.get('/asistencias', (req, res) => {
    db.query('SELECT * FROM asistencias', (err, results) => {
        if (err) {
            console.error('Error al obtener asistencias:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
});

// Crear una nueva asistencia
router.post('/asistencias', (req, res) => {
    const { id_maestro, id_alumno, fecha, estado } = req.body;
    db.query('INSERT INTO asistencias (id_maestro, id_alumno, fecha, estado) VALUES (?, ?, ?, ?)',
        [id_maestro, id_alumno, fecha, estado],
        (err, result) => {
            if (err) {
                console.error('Error al crear asistencia:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.json({ id: result.insertId, id_maestro, id_alumno, fecha, estado });
        });
});

// Actualizar una asistencia
router.put('/asistencias/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    db.query('UPDATE asistencias SET estado = ? WHERE id_asistencia = ?', [estado, id],
        (err) => {
            if (err) {
                console.error('Error al actualizar asistencia:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.json({ message: 'Asistencia actualizada correctamente' });
        });
});

// Eliminar una asistencia
router.delete('/asistencias/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM asistencias WHERE id_asistencia = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar asistencia:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json({ message: 'Asistencia eliminada correctamente' });
    });
});

module.exports = router;
