var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

// RUTAS GET   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TRAE EL NOMBRE DE LOS USUARIOS CON O SIN ID
app.get('/users', async function (req, res) {
    try {
        const { id } = req.query;
        let name;

        if (id) {
            name = await realizarQuery('SELECT name FROM Users WHERE id = ?', [id]);

        } else {
            name = await realizarQuery('SELECT name FROM Users');
        }

        res.json(name);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// TRAE EL MAIL DE LOS USUARIOS CON O SIN ID
app.get('/users', async function (req, res) {
    try {
        const { id } = req.query;
        let email;

        if (id) {
            email = await realizarQuery('SELECT email FROM Users WHERE id = ?', [id]);

        } else {
            email = await realizarQuery('SELECT email FROM Users');
        }

        res.json(email);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// TRAE LA CONTRASEÑA DE LOS USUARIOS CON O SIN ID
app.get('/users', async function (req, res) {
    try {
        const { id } = req.query;
        let password;

        if (id) {
            password = await realizarQuery('SELECT password FROM Users WHERE id = ?', [id]);

        } else {
            email = await realizarQuery('SELECT password FROM Users');
        }

        res.json(password);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// TRAE LOS JUEGOS DE UN USUARIO 
app.get('/games', async function (req, res) {
    try {

        const { idUser } = req.query;
        let games;


        games = await realizarQuery(
            'SELECT * FROM Games WHERE idUser = ?',
            [idUser]
        );

        res.send(games);

    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).send('Internal Server Error');
    }
});

// TRAE TODAS LAS MEJORES JUGADAS
app.get('/bestScore', async function (req, res) {
    try {
        const { id } = req.query;
        let bestScore;

        if (id) {
            bestScore = await realizarQuery('SELECT * FROM bestScore WHERE idUser = ?', [id]);

        } else {
            bestScore = await realizarQuery('SELECT * FROM bestScore');
        }

        res.json(bestScore);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// TRAE TODAS LAS PREGUNTAS O UNA PREGUNTA CON EL ID
app.get('/questions', async function (req, res) {
    try {
        const { id } = req.query;
        let questions;

        if (id) {
            questions = await realizarQuery('SELECT * FROM Questions WHERE id = ?', [id]);

        } else {
            questions = await realizarQuery('SELECT * FROM Questions');
        }

        res.json(bestScore);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// RUTAS POST ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SUBE UN NUEVO USUARIO
app.post('/users', async function (req, res) {
    try {
        const { idBestScore, name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await realizarQuery(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        await realizarQuery(
            'INSERT INTO Users (idBestScore, name, email, password) VALUES (?, ?, ?, ?)',
            [idBestScore, name, email, password]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: { name, email, idBestScore }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// INSERTAR UNA NUEVA MEJOR JUGADA
app.post('/bestScore', async function (req, res) {
    try {
        const { idUser, score, win } = req.body;

        await realizarQuery(
            'INSERT INTO bestScore (idUser, score, win) VALUES (?, ?, ?)',
            [idUser, score, win]
        );

        res.status(201).json({
            success: true,
            message: 'Game saved successfully into Best Scores',
            user: { idUser, score, win }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//INSERTA UNA NUEVA PARTIDA (PARA HISTORIAL)
app.post('/games', async function (req, res) {
    try {
        const { idUser, score } = req.body;

        await realizarQuery(
            'INSERT INTO bestScore (idUser, score) VALUES (?, ?)',
            [idUser, score]
        );

        res.status(201).json({
            success: true,
            message: 'Game saved successfully',
            user: { idUser, score }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// RUTAS PUT /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//CAMBIAR MAIL 
app.put("/users", async function (req, res) {
    try {
        const { id, newMail } = req.body;

        if (!id || !newMail) {
            return res.status(400).json({
                success: false,
                message: "Se requieren ID y nuevo mail"
            });
        }

        const userExists = await realizarQuery(
            "SELECT id FROM Users WHERE id = ?",
            [id]
        );

        if (userExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        await realizarQuery(
            "UPDATE Users SET email = ? WHERE id = ?",
            [newMail, id]
        );

        res.status(200).json({
            success: true,
            message: "email actualizado correctamente",
            userId: id,
            newName: newMail
        });

    } catch (error) {
        console.error("Error al actualizar email:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
});

//CAMBIAR NOMBRE 
app.put("/users", async function (req, res) {
    try {
        const { id, newName } = req.body;

        if (!id || !newName) {
            return res.status(400).json({
                success: false,
                message: "Se requieren ID y nuevo nombre"
            });
        }

        const userExists = await realizarQuery(
            "SELECT id FROM Users WHERE id = ?",
            [id]
        );

        if (userExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        await realizarQuery(
            "UPDATE Users SET name = ? WHERE id = ?",
            [newName, id]
        );

        res.status(200).json({
            success: true,
            message: "Nombre actualizado correctamente",
            userId: id,
            newName: newName
        });

    } catch (error) {
        console.error("Error al actualizar nombre:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
});

//CAMBIAR CONTRASEÑA 
app.put("/users", async function (req, res) {
    try {
        const { id, newPassword } = req.body;

        if (!id || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Se requieren ID y nueva contraseña"
            });
        }

        const userExists = await realizarQuery(
            "SELECT id FROM Users WHERE id = ?",
            [id]
        );

        if (userExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        await realizarQuery(
            "UPDATE Users SET password = ? WHERE id = ?",
            [newPassword, id]
        );

        res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente",
            userId: id,
            newName: newPassword
        });

    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
});

// ACTUALIAR MEJOR JUGADA 
app.put("/users", async function (req, res) {
    try {
        const { id, idNewBestScore } = req.body;

        if (!id || !idNewBestScore) {
            return res.status(400).json({
                success: false,
                message: "Se requieren ID y el id de la nueva mejor partida"
            });
        }

        const userExists = await realizarQuery(
            "SELECT id FROM Users WHERE id = ?",
            [id]
        );

        if (userExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        await realizarQuery(
            "UPDATE Users SET  idBestScore = ? WHERE id = ?",
            [idNewBestScore, id]
        );

        res.status(200).json({
            success: true,
            message: "Mejor Partida actualizada correctamente",
            userId: id,
            newName: idNewBestScore
        });

    } catch (error) {
        console.error("Error al actualizar la mejor partida:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
});

// RUTAS DELETE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ELIMINA USUARIO
app.delete("/users", async function (req, res) {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Se requiere la contraseña del usuario"
            });
        }

        const userExists = await realizarQuery(
            "SELECT * FROM Users WHERE password = ?",
            [password]
        );

        if (userExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        await realizarQuery(
            "DELETE * From Users WHERE password=?",
            [password]
        );

        // 4. Respuesta exitosa
        res.status(200).json({
            success: true,
            message: "el usuario fue borrado exitosamente",
            userId: id
        });
    }
    catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al eliminar el usuario"
        });
    }
});

// Levantar servidor
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});
