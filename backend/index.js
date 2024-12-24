const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pruebas'
});

db.connect((err) => {
    if(err) {
        console.error('Error al conectar con la base de datos', err);
        return;
    } else {
        console.log('Conexion a la base de datos MySQL establecida');
    }
});

app.post('/usuarios/add', (req, res) => {
    const { nombre, email } = req.body;

    const query = 'INSERT INTO usuarios(nombre, email) VALUES(?,?)';

    db.query(query, [nombre, email], (err, result) => {
        if(err) {
            res.status(500).send('Error al agregar usuario');
            return;
        }

        res.status(200).json({ id: result.insertId, nombre, email });
    });
});

app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, result) => {
        if(err) {
            res.status(500).send('Error al obtener los usuarios');
            return;
        }

        res.status(200).json(result);
    });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, result) => {
        if(err) {
            res.status(500).send('Error al obtener el usuario');
            return;
        }

        if(result.length === 0) {
            res.status(404).send('Usuario no encontrado');
            return;
        }

        res.status(200).json(result[0]);
    });
});

app.put('/usuarios/update/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;

    const query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
    db.query(query, [nombre, email, id], (err, result) => {
        if(err) {
            res.status(500).send('Error al actualizar el usuario');
            return;
        }

        res.status(200).send('Usuario actualizado');
    });
});

app.delete('/usuarios/delete/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if(err) {
            res.status(500).send('Error al eliminar el usuario');
            return;
        }

        res.status(200).send('Usuario eliminado');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});