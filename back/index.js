
var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 4000

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/verifyUser", async (req, res) => {
    try {
        let check = await realizarQuery(
            `Select * From Users where name = "${req.body.name}" and password = "${req.body.password}" `
        )
        if ((check.length > 0)&&(req.body.adminUser==1)){
            res.send({
                message: "admin",
                username: req.body.name,
                adminUser:1
            })}if(check.length > 0){
                res.send({
                message: "ok",
                username: req.body.name,})
            }else {
            res.send({
                message: "Verifica si ambos campos fueron rellenados y si el usuario existe y coincide con la contraseña."
            })
        }
    } catch (error) {
        res.send(error)
    }
})

app.post("/regUser", async (req, res) => {
    try {
        let check = await realizarQuery(
            `Select * From Users where name = "${req.body.name}" `
        )
        console.log(check.length)
        console.log(req.body.name.length)
        if (check.length < 1 && req.body.name.length > 0) {
            realizarQuery(
                `insert Users(name,password) Values("${req.body.name}","${req.body.password}");`
            )
            res.send({
                message: "ok",
                username: req.body.name
            })
        } else {
            res.send({ message: "Verifica si ambos campos fueron rellenados. Si el error persiste es posible que el nombre ya esté en uso." })
        }
    } catch (error) {
        res.send(error)
    }
})

app.delete("/deleteUser", async (req, res) => {
    try {
        // Validar que se recibió un ID
        if (!req.body.name) {
            return res.status(400).send({ message: "Se requiere el nombre de usuario" });
        }

        // Verificar si la pregunta existe
        const check = await realizarQuery(
            `SELECT * FROM Users WHERE name = "${req.body.name}"`
        );

        if (check.length === 0) {
            return res.status(404).send({ 
                message: "No se encontró ningun usuario con ese nombre" 
            });
        }

        await realizarQuery(
            `DELETE FROM Users WHERE name = "${req.body.name}"`
        );

        res.send({
            message: "Usuario borrado exitosamente",
            deletedId: req.body.name
        });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ 
            message: "Error interno al borrar el usuario",
            error: error.message 
        });
    }
});

app.delete("/deleteQuestion", async (req, res) => {
    try {
        // Validar que se recibió un ID
        if (!req.body.id) {
            return res.status(400).send({ message: "Se requiere el ID de la pregunta" });
        }

        // Verificar si la pregunta existe
        const check = await realizarQuery(
            `SELECT * FROM Questions WHERE id = ${req.body.id}`
        );

        if (check.length === 0) {
            return res.status(404).send({ 
                message: "No se encontró ninguna pregunta con ese ID" 
            });
        }

        await realizarQuery(
            `DELETE FROM Questions WHERE id = ${req.body.id}`
        );

        res.send({
            message: "Pregunta borrada exitosamente",
            deletedId: req.body.id
        });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ 
            message: "Error interno al borrar la pregunta",
            error: error.message 
        });
    }
});

app.delete("/deleteGames", async (req, res) => {
    try {
        // Validar que se recibió un ID
        if (!req.body.id) {
            return res.status(400).send({ message: "Se requiere el ID de la pregunta" });
        }

        // Verificar si la pregunta existe
        const check = await realizarQuery(
            `SELECT * FROM Games WHERE id = ${req.body.id}`
        );

        if (check.length === 0) {
            return res.status(404).send({ 
                message: "No se encontró ninguna pregunta con ese ID" 
            });
        }

        await realizarQuery(
            `DELETE FROM Games WHERE id = ${req.body.id}`
        );

        res.send({
            message: "Pregunta borrada exitosamente",
            deletedId: req.body.id
        });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ 
            message: "Error interno al borrar la pregunta",
            error: error.message 
        });
    }
});


app.post("/addQuestion", async (req, res) => {
    try {
        if (req.body.largeQuestion == 0) {
            let sql = `INSERT INTO Questions (content, answerA, answerB, answerC, answerD, correctAnswer, emojiClue, textClue, fiftyClue, largeQuestion, image, text) 
                         VALUES ("${req.body.content}", "${req.body.answerA}", "${req.body.answerB}", "${req.body.answerC}", "${req.body.answerD}", 
                         "${req.body.correctAnswer}", "${req.body.emojiClue}", "${req.body.textClue}", "${req.body.fiftyClue}", "${req.body.largeQuestion}", 
                         null, null)`;
            await realizarQuery(sql);
        } else {
            let sql = `INSERT INTO Questions (content, answerA, answerB, answerC, answerD, correctAnswer, emojiClue, textClue, fiftyClue, largeQuestion, image, text) 
                         VALUES ("${req.body.content}", "${req.body.answerA}", "${req.body.answerB}", "${req.body.answerC}", "${req.body.answerD}", 
                         "${req.body.correctAnswer}", "${req.body.emojiClue}", "${req.body.textClue}", "${req.body.fiftyClue}", "${req.body.largeQuestion}", 
                         "${req.body.image}", "${req.body.text}")`;
            await realizarQuery(sql);
        }

        res.send({
            message: "Pregunta insertada correctamente",
            idQuestion: req.body.id
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            message: "Error al insertar la pregunta",
            error: error.message
        });
    }
});



app.put("/editQuestion", async (req, res) => {
    try {
        const check = await realizarQuery(
            `SELECT * FROM Questions WHERE id = "${req.body.id}"`
        );

        if (check.length === 0) {
            return res.status(404).send({ message: "Pregunta no encontrada" });
        }

        // Construir la consulta SQL correctamente
        let sql = `UPDATE Questions SET 
            content = "${req.body.content}", 
            answerA = "${req.body.answerA}", 
            answerB = "${req.body.answerB}", 
            answerC = "${req.body.answerC}", 
            answerD = "${req.body.answerD}", 
            correctAnswer = "${req.body.correctAnswer}",
            emojiClue = "${req.body.emojiClue || ''}",
            textClue = "${req.body.textClue || ''}",
            fiftyClue = "${req.body.fiftyClue || ''}",
            largeQuestion = ${req.body.largeQuestion || 0},
            image = ${req.body.image ? `"${req.body.image}"` : 'NULL'},
            text = ${req.body.text ? `"${req.body.text}"` : 'NULL'}
            WHERE id = "${req.body.id}"`;

        await realizarQuery(sql);

        res.send({ message: "Pregunta editada correctamente", idQuestion: req.body.id });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Error al editar la pregunta", error: error.message });
    }
});

app.get('/getQuestion', async function (req, res) {
    try {
        let respuesta;
        if (req.query.id != undefined) {
            [respuesta] = await realizarQuery(`SELECT * FROM Questions WHERE id=${req.query.id}`)
        } else {
            res.send({ message: "Verifica haber puesto bien el id y si la pregunta existe." });
        }
        let response = {
            message: "Pregunta traída correctamente.",
            id: respuesta.id,
            content: respuesta.content,
            answerA: respuesta.answerA,
            answerB: respuesta.answerB,
            answerC: respuesta.answerC,
            answerD: respuesta.answerD,
            correctAnswer: respuesta.correctAnswer,
            emojiClue: respuesta.emojiClue,
            textClue: respuesta.textClue,
            fiftyClue: respuesta.fiftyClue,
            largeQuestion: respuesta.largeQuestion,
            image: respuesta.image,
            text: respuesta.text

        }
        res.send({
            response
        });
    } catch (error) {
        res.send({ mensaje: "Tuviste un error", error: error.message });
    }
})

app.get('/getGame', async function (req, res) {
    try {
        let respuesta;
        if (req.query.id != undefined) {
            [respuesta] = await realizarQuery(`SELECT * FROM Games WHERE id=${req.query.id}`)
        } else {
            res.send({ message: "Verifica haber puesto bien el id y si la pregunta existe." });
        }
        let response = {
            message: "Jugada traída correctamente.",
            id: respuesta.id,
            idUser: respuesta.idUser,
            score: respuesta.score,
            win: respuesta.win,

        }
        res.send({
            response
        });
    } catch (error) {
        res.send({ mensaje: "Tuviste un error", error: error.message });
    }
})

app.get('/getAllGames', async function (req, res) {
    try {
        let [respuesta] = await realizarQuery(`SELECT * FROM Games`);
        
        res.send({
            message: "partidas",
            data: respuesta 
        });
    } catch (error) {
        res.send({ mensaje: "Tuviste un error", error: error.message });
    }
});
