
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
        if (check.length > 0) {
            res.send({
                message: "ok",
                username: req.body.name
            })

        } else if (req.body.adminUser == 1) {
            res.send({
                message: "admin",
                username: req.body.name
            })

        } else {
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
        let check = await realizarQuery(
            `SELECT * FROM Users WHERE name = "${req.body.name}"`
        )
        console.log(check.length)
        if (check.length > 0 && req.body.name.length > 0) {
            await realizarQuery(
                `DELETE FROM Users WHERE name = "${req.body.name}"`
            )
            res.send({
                message: "usuario borrado",
                username: req.body.name
            })
        } else {
            res.send({ message: "Verifica si ambos campos fueron rellenados. Si el error persiste es posible que el usuario no exista." })
        }
    } catch (error) {
        res.send(error)
    }
})

app.delete("/deleteQuestion", async (req, res) => {
    try {
        let check = await realizarQuery(
            `SELECT * FROM Questions WHERE id = "${req.body.id}"`
        )
        console.log(check.length)
        if (check.length > 0) {
            await realizarQuery(
                `DELETE FROM Questions WHERE id = "${req.body.id}"`
            )
            res.send({
                message: "Pregunta borrada",
            })
        } else {
            res.send({ message: "Verifica haber puesto bien el id y si la pregunta existe." })
        }
    } catch (error) {
        res.send(error)
    }
})

app.delete("/deleteGames", async (req, res) => {
    try {
        if (!req.body.id || isNaN(req.body.id)) {
            return res.status(400).json({
                success: false,
                message: "ID de partida no válido o faltante"
            });
        }

        const gameId = parseInt(req.body.id);
        if (isNaN(gameId)) {
            return res.status(400).json({
                success: false,
                message: "El ID debe ser un número válido"
            });
        }

        const check = await realizarQuery(
            `SELECT * FROM Games WHERE id = "${req.body.id}"`
        );

        if (check.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró una partida con ese ID"
            });
        }

        await realizarQuery(
            "DELETE FROM Games WHERE id = ?",
            [gameId]
        );

        return res.status(200).json({
            success: true,
            message: "Partida eliminada correctamente",
            gameId: gameId
        });

    } catch (error) {
        console.error("Error al eliminar partida:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor al eliminar la partida"
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
        let check = await realizarQuery(
            `SELECT * FROM Questions WHERE id = "${req.body.id}"`
        );

        console.log(check.length);

        if (check.length > 0) {
            if (req.body.largeQuestion == 0) {
                const sql = `UPDATE Questions 
             SET content = "${req.body.content}",
                 answerA = "${req.body.answerA}",
                 answerB = "${req.body.answerB}",
                 answerC = "${req.body.answerC}",
                 answerD = "${req.body.answerD}",
                 correctAnswer = "${req.body.correctAnswer}",
                 emojiClue = "${req.body.emojiClue}",
                 textClue = "${req.body.textClue}",
                 fiftyClue = "${req.body.fiftyClue}",
                 largeQuestion = "${req.body.largeQuestion}",
                 image = null,
                 text = null
             WHERE id = "${req.body.id}"`;

                await realizarQuery(sql);
            } else {
                const sql = `UPDATE Questions 
             SET content = "${req.body.content}",
                 answerA = "${req.body.answerA}",
                 answerB = "${req.body.answerB}",
                 answerC = "${req.body.answerC}",
                 answerD = "${req.body.answerD}",
                 correctAnswer = "${req.body.correctAnswer}",
                 emojiClue = "${req.body.emojiClue}",
                 textClue = "${req.body.textClue}",
                 fiftyClue = "${req.body.fiftyClue}",
                 largeQuestion = "${req.body.largeQuestion}",
                 image = "${req.body.image}",
                 text = "${req.body.text}"
             WHERE id = "${req.body.id}"`;

                await realizarQuery(sql);
            }
            res.send({
                message: "Pregunta editada correctamente",
                idQuestion: req.body.id
            });
        } else {
            res.status(400).send({
                message: "La pregunta con este ID ya existe"
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            message: "Error al insertar la pregunta",
            error: error.message
        });
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