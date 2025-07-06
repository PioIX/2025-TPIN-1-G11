function signUpForm() {
    document.getElementById("signUp").innerHTML = ``;
    document.getElementById("signUp").id = "";
    document.getElementById("logIn").innerHTML = `
    <legend>¡Bienvenido futuro dictador! Registresé</legend>
    <div class = "logInInput">
        <label for="newUsername">Nombre de Usuario</label>
        <input type="text" id="newUsername" placeholder="Nombre de usuario">
    </div>
    <div class = "logInInput">
        <label for="newPassword">Contraseña</label>
        <input type="password" id="newPassword" placeholder="********">
    </div>
    <div class = "buttonContainer">
        <button onclick="newUser()" data-bs-toggle="tooltip"
            data-bs-placement="top" title="SignUp">Registrarse</button>
    </div>`;
}

function User() {
    const user = {
        name: ui.getUsername(),
        password: ui.getPassword()
    }
    userVerify(user);
}

async function userVerify(user) {
    try {
        const response = await fetch('http://localhost:4000/verifyUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });
        const result = await response.json();
        console.log(result.message)
        if (result.message === "ok") {
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("notepad").style.display = "block";
            document.getElementById("logo").style.display = "none"
            ui.setUser(result.username);
            idLoggeado = result.userId;
            return result;
        } if (result.message === "admin") {
            document.getElementById("logo").style.display = "none"
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("admin-ui").style.display = "block";
            ui.setUser(result.username);
            idLoggeado = result.userId;
            return result;

        } else {
            alert(result.message || "Error al iniciar sesión");
        }
    } catch (error) {

    }
}

function newUser() {
    const usuario = {
        name: ui.getNewUsername(),
        password: ui.getNewPassword()
    }
    registerUser(usuario);
}

async function registerUser(newUser) {
    try {
        const response = await fetch('http://localhost:4000/regUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser)
        });

        let result = await response.json()
        console.log(result.message)
        if (result.message === "ok") {
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("notepad").style.display = "block";
            ui.setUser(result.username);
            idLoggeado = result.userId;
            alert("bienvenido dios dictador");
            return result;
        } else {
            alert(result.message || "Error al iniciar sesión");
        }
    } catch (error) {

    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function cargarDatosPregunta() {
    try {
        // 1. Obtener el ID de la pregunta
        const questionIdInput = document.getElementById('question-id-input').value.trim();

        if (!questionIdInput || isNaN(questionIdInput)) {
            alert('Por favor ingresa un ID válido (número)');
            return;
        }

        // 2. Hacer la petición al servidor
        const response = await fetch(`http://localhost:4000/getQuestion?id=${questionIdInput}`);
        const result = await response.json();

        console.log("Respuesta del servidor:", result);

        // 3. Mostrar los datos directamente en los inputs
        if (result.response && result.response.id) {
            const pregunta = result.response;

            // Rellenar todos los campos del formulario con inputs
            document.getElementById('edit-text').value = pregunta.content || pregunta.text || '';
            document.getElementById('edit-answer-a').value = pregunta.answerA || '';
            document.getElementById('edit-answer-b').value = pregunta.answerB || '';
            document.getElementById('edit-answer-c').value = pregunta.answerC || '';
            document.getElementById('edit-answer-d').value = pregunta.answerD || '';
            document.getElementById('edit-correct-answer').value = pregunta.correctAnswer || '';

            // Mostrar la sección del formulario
            document.getElementById('question-info').style.display = 'block';

            // Opcional: Mostrar el ID como referencia (pero no editable)
            document.getElementById('display-question-id').textContent = pregunta.id;
        } else {
            alert(result.message || "No se encontró la pregunta con ese ID");
        }
    } catch (error) {
        console.error("Error completo:", error);
        alert("Error al comunicarse con el servidor. Ver consola para detalles.");
    }
}

async function editarPregunta() {
    try {
        // 1. Obtener el ID de la pregunta
        const questionId = document.getElementById('question-id-input').value.trim();

        if (!questionId) {
            throw new Error("Primero debes cargar una pregunta para editar");
        }

        // 2. Validar campos
        const camposRequeridos = [
            'edit-text', 'edit-answer-a', 'edit-answer-b',
            'edit-answer-c', 'edit-answer-d', 'edit-correct-answer'
        ];

        for (const campoId of camposRequeridos) {
            const campo = document.getElementById(campoId);
            if (!campo.value.trim()) {
                campo.focus();
                throw new Error(`El campo ${campoId.replace('edit-', '')} no puede estar vacío`);
            }
        }

        // 3. Preparar datos para enviar
        const preguntaEditada = {
            id: questionId,
            content: document.getElementById('edit-text').value,
            answerA: document.getElementById('edit-answer-a').value,
            answerB: document.getElementById('edit-answer-b').value,
            answerC: document.getElementById('edit-answer-c').value,
            answerD: document.getElementById('edit-answer-d').value,
            correctAnswer: document.getElementById('edit-correct-answer').value.toUpperCase(),
            emojiClue: "", // Puedes agregar campos para estos en el HTML si son necesarios
            textClue: "",
            fiftyClue: "",
            largeQuestion: 0,
            image: null,
            text: null
        };

        // 4. Validar respuesta correcta
        if (!['A', 'B', 'C', 'D'].includes(preguntaEditada.correctAnswer)) {
            throw new Error("La respuesta correcta debe ser A, B, C o D");
        }

        // 5. Enviar al servidor
        const response = await fetch('http://localhost:4000/editQuestion', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preguntaEditada)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al actualizar la pregunta");
        }

        alert(result.message || "Pregunta actualizada correctamente");

    } catch (error) {
        console.error("Error al editar pregunta:", error);
        alert(`Error: ${error.message}`);
    }
}

async function borrarPregunta() {
    try {
        // Obtener el ID de la pregunta del input correcto
        const id = document.getElementById('question-id-input').value.trim();

        if (!id) {
            throw new Error("Ingresá un ID válido");
        }

        // Enviar solicitud DELETE al servidor
        const response = await fetch('http://localhost:4000/deleteQuestion', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al borrar la pregunta");
        }

        alert(result.message || "Pregunta borrada correctamente");

        // Limpiar el formulario después de borrar
        document.getElementById('question-id-input').value = '';
        document.getElementById('question-info').style.display = 'none';
        document.getElementById('edit-text').value = '';
        document.getElementById('edit-answer-a').value = '';
        document.getElementById('edit-answer-b').value = '';
        document.getElementById('edit-answer-c').value = '';
        document.getElementById('edit-answer-d').value = '';
        document.getElementById('edit-correct-answer').value = '';
        document.getElementById('display-question-id').textContent = '';

    } catch (error) {
        console.error("Error al borrar pregunta:", error);
        alert(`Error: ${error.message}`);
    }
}

function mostrarEditarPregunta() {
    document.getElementById("admin-questions").style.display = "block"
}

function mostrarAdminUsuarios() {
    const seccion3 = document.getElementById("admin-users");
    seccion3.style.display = "";
}

function mostrarAdminPartidas() {
    const seccion4 = document.getElementById("admin-games");
    seccion4.style.display = "";
}

async function crearPregunta() {
    const content = document.getElementById("new-question-text").value;
    const answerA = document.getElementById("new-question-a").value;
    const answerB = document.getElementById("new-question-b").value;
    const answerC = document.getElementById("new-question-c").value;
    const answerD = document.getElementById("new-question-d").value;
    const correctAnswer = document.getElementById("new-correct-answer").value;
    const emojiClue = document.getElementById("new-emoji-clue").value;
    const textClue = document.getElementById("new-text-clue").value;
    const fiftyClue = document.getElementById("new-fifty-clue").value;
    const largeQuestion = document.getElementById("new-question-length").value === "true" ? 1 : 0;
    const image = document.getElementById("new-question-image").value;

    const preguntaNueva = {
        content,
        answerA,
        answerB,
        answerC,
        answerD,
        correctAnswer,
        emojiClue,
        textClue,
        fiftyClue,
        largeQuestion,
        image: largeQuestion ? image : null,
        text: largeQuestion ? content : null
    };

    try {
        const res = await fetch("http://localhost:4000/addQuestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(preguntaNueva)
        });

        const data = await res.json();
        alert(data.message);
    } catch (error) {
        console.error(error);
        alert("Error al crear la pregunta.");
    }
}

async function editarPregunta() {
    const id = document.getElementById("question-id-input").value;
    const content = document.getElementById("edit-text").value;
    const answerA = document.getElementById("edit-answer-a").value;
    const answerB = document.getElementById("edit-answer-b").value;
    const answerC = document.getElementById("edit-answer-c").value;
    const answerD = document.getElementById("edit-answer-d").value;
    const correctAnswer = document.getElementById("edit-correct-answer").value;

    const preguntaEditada = {
        id,
        content,
        answerA,
        answerB,
        answerC,
        answerD,
        correctAnswer,
        emojiClue: "",
        textClue: "",
        fiftyClue: "",
        largeQuestion: 0,
        image: null,
        text: null
    };

    try {
        const res = await fetch("http://localhost:4000/editQuestion", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(preguntaEditada)
        });

        const data = await res.json();
        alert(data.message);
    } catch (err) {
        console.error(err);
        alert("Error al editar la pregunta.");
    }
}

async function borrarUsuario() {
    const username = document.getElementById("username-to-delete").value.trim();

    if (!username) {
        alert("Por favor ingresa un nombre de usuario");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/deleteUser", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
            },
            body: JSON.stringify({ name: username })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al borrar el usuario");
        }

        alert(result.message || "Usuario borrado correctamente");

        // Limpiar el campo después de borrar
        document.getElementById("username-to-delete").value = "";

    } catch (error) {
        console.error("Error al borrar usuario:", error);
        alert(`Error: ${error.message}`);
    }
}

async function cargarDatosPartida() {
    try {
        const gameIdInput = document.getElementById('game-id-input').value.trim();

        if (!gameIdInput || isNaN(gameIdInput)) {
            alert('Por favor ingresa un ID válido (número)');
            return;
        }

        const response = await fetch(`http://localhost:4000/getGame?id=${gameIdInput}`);
        const result = await response.json();

        if (result.response && result.response.id) {
            const partida = result.response;

            // Mostrar los datos en los spans (no en inputs)
            document.getElementById('display-game-id').textContent = partida.id;
            document.getElementById('display-player-id').textContent = partida.idUser;
            document.getElementById('display-game-score').textContent = partida.score;
            document.getElementById('display-game-win').textContent = partida.win ? 'Sí' : 'No';

            // Mostrar la sección de información
            document.getElementById('game-info').style.display = 'block';
        } else {
            alert(result.message || "No se encontró la partida con ese ID");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al comunicarse con el servidor. Ver consola para detalles.");
    }
}

async function borrarPartida() {
    const idInput = document.getElementById("game-id-input");
    const id = idInput.value.trim();

    // Validación básica
    if (!id) {
        alert("Por favor ingresa un ID de partida");
        idInput.focus();
        return;
    }

    try {
        // Petición DELETE con el ID en el body como TÚ lo tienes configurado
        const response = await fetch("http://localhost:4000/deleteGames", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id }) // Envía exactamente como espera tu backend
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al borrar la partida");
        }

        alert(result.message || "Partida borrada correctamente");
        
        // Limpiar el campo después de borrar
        idInput.value = "";
        const gameInfoSection = document.getElementById("game-info");
        if (gameInfoSection) {
            gameInfoSection.style.display = "none";
        }

    } catch (error) {
        console.error("Error al borrar partida:", error);
        alert(`Error: ${error.message}`);
    }
}