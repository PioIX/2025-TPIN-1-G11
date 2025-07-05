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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        
        }else if(req.body.adminUser == 1){
            res.send({
                message:"admin",
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
                `insert Users(name,password) Values("${req.body.name}","${req.body.password}");`
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

app.delete("/deleteUSer", async (req,res) =>{
    try{
        let check = await realizarQuery(
            `SELECT * FROM Users WHERE name = "${req.body.name}"`
        )
        console.log(check.length)
        if(check.length>0 && req.body.name.length>0){
            realizarQuery(
                `DELETE FROM Users WHERE name = "${req.body.name}"`
            )
            res.send({
                message:"usuario borrado",
                username: req.body.name
            })
        }else{
             res.send({message:"Verifica si ambos campos fueron rellenados. Si el error persiste es posible que el usuario no exista."})
        }
    }catch (error){
        res.send(error)   
    }
})

app.delete("/deleteQuestion", async (req,res) =>{
    try{
        let check = await realizarQuery(
            `SELECT * FROM Questions WHERE name = "${req.body.name}"`
        )
        console.log(check.length)
        if(check.length>0 && req.body.name.length>0){
            realizarQuery(
                `DELETE FROM Users WHERE name = "${req.body.name}"`
            )
            res.send({
                message:"usuario borrado",
                username: req.body.name
            })
        }else{
             res.send({message:"Verifica si ambos campos fueron rellenados. Si el error persiste es posible que el usuario no exista."})
        }
    }catch (error){
        res.send(error)   
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// app.delete("/deleteUsers", async function (req, res) {
//     try {
//         const name = String(req.body.name).trim(); // ✅ Asegura que sea string

//         console.log("BODY RECIBIDO:", req.body);

//         if (!name) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Se requiere el nombre de usuario"
//             });
//         }

//         const userExists = await realizarQuery(
//             "SELECT * FROM Users WHERE name = ?",
//             [name] // ✅ Asegurarse que esto es un array con un string
//         );

//         if (userExists.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Usuario no encontrado"
//             });
//         }

//         await realizarQuery(
//             "DELETE FROM Users WHERE name = ?",
//             [name]
//         );

//         res.status(200).json({
//             success: true,
//             message: "El usuario fue borrado exitosamente",
//             userId: name
//         });

//     } catch (error) {
//         console.error("Error en la consulta SQL:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error interno al eliminar el usuario"
//         });
//     }
// });


// app.post("/addQuestion", async (req, res) => {
//     try {
//         let check = await realizarQuery(
//             `Select * From Questions where id = "${req.body.id}" `
//         )
//         console.log(check.length)
//         console.log(req.body.id.length)
//         if(check.length<1 && req.body.id.length>0){
//             realizarQuery(
//                 `insert Questions(id, content, answerA, answerB, answerC, answerD, correctAnswer, emojiClue, textClue, fiftyClue, largeQuestion, image, text) Values("${req.body.id}","${req.body.content}","${req.body.answerA}","${req.body.answerB}","${req.body.answerC}","${req.body.answerD}","${req.body.correctAnswer}","${req.body.emojiClue}","${req.body.textClue}","${req.body.fiftyClue}","${req.body.image}","${req.body.text}");`
//             )
//             res.send({
//                 message:"ok",
//                 id: req.body.id,
//                 content: req.body.content
//             })
//         }else{
//             res.send({message:"Verifica que todos los campos hayan sido completados o que la pregunta no exista dentro de la base de datos."})
//         }
//     }
//     catch (error){
//         res.send(error)
//     }
// })

// app.delete("/deleteQuestion", async function (req, res) {
//     try {
//         const { id } = req.body;

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Se requiere el id de la pregunta"
//             })
//         }
//         const userExists = await realizarQuery(
//             "SELECT * FROM Questions WHERE id = ?",
//             [id]
//         )

//         if (userExists.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Pregunta no encontrada"
//             })
//         }
//         await realizarQuery(
//             "DELETE * From Questions WHERE id=?",
//             [id]
//         )
//         res.status(200).json({
//             success: true,
//             message: "la pregunta fue borrada exitosamente",
//             userId: id
//         })
//     }
//     catch (error) {
//         console.error("Error al eliminar pregunta:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error interno al eliminar la pregunta"
//         })
//     }
// })


// app.put("/addAdminUser", async function (req, res) {
//     try {
//         const { id } = req.body;

//         if (!id ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Se requiere el ID del usuario"
//             })
//         }

//         const userExists = await realizarQuery(
//             "SELECT id FROM Users WHERE id = ?",
//             [id]
//         )
//          if (userExists.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Usuario no encontrado"
//             })
//         }

//         await realizarQuery(
//             "UPDATE Users SET adminUser = True WHERE id = ?",
//             [id]
//         )

//         res.status(200).json({
//            success: true,
//             message: "Usuario agregado como administrador",
//             userId: id
//         })
//     } catch (error) {
//         console.error("Error al actualizar contraseña:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error interno del servidor"
//         })
//     }
// })

