var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

//Pongo el servidor a escuchar
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});

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

// TRAE DATOS DE LOS USUARIOS CON O SIN ID
// app.get('/users', async function (req, res) {
//     try {
//         const { id } = req.query;
//         let name;

//         if (id) {
//             name = await realizarQuery('SELECT * FROM Users WHERE id = ?', [id]);

//         } else {
//             name = await realizarQuery('SELECT * FROM Users');
//         }

//         res.json(name);

//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// // TRAE LOS JUEGOS DE UN USUARIO 
// app.get('/games', async function (req, res) {
//     try {

//         const { idUser } = req.query;
//         let games;


//         games = await realizarQuery(
//             'SELECT * FROM Games WHERE idUser = ?',
//             [idUser]
//         );

//         res.send(games);

//     } catch (error) {
//         console.error('Error fetching games:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // TRAE TODAS LAS PREGUNTAS O UNA PREGUNTA CON EL ID
// app.get('/questions', async function (req, res) {
//     try {
//         const { id } = req.query;
//         let questions;

//         if (id) {
//             questions = await realizarQuery('SELECT * FROM Questions WHERE id = ?', [id]);

//         } else {
//             questions = await realizarQuery('SELECT * FROM Questions');
//         }

//         res.json(questions);

//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // RUTAS POST ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // SUBE UN NUEVO USUARIO
// app.post('/registerUser', async function (req, res) {
//     try {
//         const { name, password } = req.body;

//         if (!name || !password) {
//             return res.status(400).json({ 
//                 success: false,
//                 message: 'Nombre y contraseña son requeridos' 
//             });
//         }

//         const existingUser = await realizarQuery(
//         `SELECT * FROM Users WHERE name = "${name}" `,
//         );

//         if (existingUser && existingUser[0] && existingUser[0].length > 0) {
//             return res.status(409).json({ 
//                 success: false,
//                 message: 'El nombre de usuario ya existe' 
//             });
//         }

//         const result = await realizarQuery(
//             'INSERT INTO Users (name, password) VALUES (?, ?)',
//             [name, password]
//         );

//         res.status(201).json({ 
//             success: true,
//             message: 'Usuario registrado con éxito',
//             userId: result.insertId
//         });

//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({ 
//             success: false,
//             error: 'Error interno del servidor',
//             details: error.message
//         });
//     }
// });

// //INSERTA UNA NUEVA PARTIDA (PARA HISTORIAL)
// app.post('/games', async function (req, res) {
//     try {
//         const { idUser, score } = req.body;

//         await realizarQuery(
//             'INSERT INTO Games (idUser, score) VALUES (?, ?)',
//             [idUser, score]
//         );

//         res.status(201).json({
//             success: true,
//             message: 'Game saved successfully',
//             user: { idUser, score }
//         });

//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // RUTAS PUT /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //CAMBIAR NOMBRE 
// app.put("/users", async function (req, res) {
//     try {
//         const { id, newName } = req.body;

//         if (!id || !newName) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Se requieren ID y nuevo nombre"
//             });
//         }

//         const userExists = await realizarQuery(
//             "SELECT id FROM Users WHERE id = ?",
//             [id]
//         );

//         if (userExists.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Usuario no encontrado"
//             });
//         }

//         await realizarQuery(
//             "UPDATE Users SET name = ? WHERE id = ?",
//             [newName, id]
//         );

//         res.status(200).json({
//             success: true,
//             message: "Nombre actualizado correctamente",
//             userId: id,
//             newName: newName
//         });

//     } catch (error) {
//         console.error("Error al actualizar nombre:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error interno del servidor"
//         });
//     }
// });

// //CAMBIAR CONTRASEÑA 
// app.put("/users", async function (req, res) {
//     try {
//         const { id, newPassword } = req.body;

//         if (!id || !newPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Se requieren ID y nueva contraseña"
//             });
//         }

//         const userExists = await realizarQuery(
//             "SELECT id FROM Users WHERE id = ?",
//             [id]
//         );

//         if (userExists.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Usuario no encontrado"
//             });
//         }

//         await realizarQuery(
//             "UPDATE Users SET password = ? WHERE id = ?",
//             [newPassword, id]
//         );

//         res.status(200).json({
//             success: true,
//             message: "Contraseña actualizada correctamente",
//             userId: id,
//             newName: newPassword
//         });

//     } catch (error) {
//         console.error("Error al actualizar contraseña:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error interno del servidor"
//         });
//     }
// });

// // RUTAS DELETE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // ELIMINA USUARIO
// app.delete("/users", async function (req, res) {
//     try {
//         const { password } = req.body;

//         if (!password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Se requiere la contraseña del usuario"
//             });
//         }

//         const userExists = await realizarQuery(
//             "SELECT * FROM Users WHERE password = ?",
//             [password]
//         );

//         if (userExists.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Usuario no encontrado"
//             });
//         }

//         await realizarQuery(
//             "DELETE * From Users WHERE password=?",
//             [password]
//         );

//         // 4. Respuesta exitosa
//         res.status(200).json({
//             success: true,
//             message: "el usuario fue borrado exitosamente",
//             userId: id
//         });
//     }
//     catch (error) {
//         console.error("Error al eliminar usuario:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error interno al eliminar el usuario"
//         });
//     }
// });

// // Levantar servidor
// app.listen(port, function () {
//     console.log(`Server running in http://localhost:${port}`);
// });



// // Verificar datos de usuario
// // app.post('/verifyUser', async function (req, res) {
// //     try {
// //         const { username, password } = req.body;
        
// //         const user = await realizarQuery(
// //             ´SELECT * FROM Users WHERE name = "${name}" AND password = ?,
// //         );

// //         if (user.length > 0) {
// //             res.json({ success: true, userId: user[0].id, username: user[0].name });
// //         } else {
// //             res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
// //         }
// //     } catch (error) {
// //         console.error('Error verifying user:', error);
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // });

app.post("/verifyUser", async (req,res) => {
    try {
        let check = await realizarQuery(
            `Select * From Users where name = "${req.body.name}" and password = "${req.body.password}" `
        )
        if(check.length>0){
            res.send({
                message:"ok",
                username: req.body.name
            })
        }else{
            res.send({
                message:"Verifica si ambos campos fueron rellenados y si el usuario existe y coincide con la contraseña."})
        }
    } catch (error) {
        res.send(error)
    }
})

app.post("/regUser", async (req,res) => {
    try {
        let check = await realizarQuery(
            `Select * From Users where name = "${req.body.name}" `
        )
        console.log(check.length)
        console.log(req.body.name.length)
        if(check.length<1 && req.body.name.length>0){
            realizarQuery(
                `insert Users(name,password,adminUser) Values("${req.body.name}","${req.body.password}", FALSE);`
            )
            res.send({
                message:"ok",
                username: req.body.name
            })
        }else{
            res.send({message:"Verifica si ambos campos fueron rellenados. Si el error persiste es posible que el nombre ya esté en uso."})
        }
    } catch (error) {
     res.send(error)   
    }
})

