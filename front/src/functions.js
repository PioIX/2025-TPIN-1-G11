
let scoreActual = 0;
let preguntasUsadas = [];
let preguntaActual = null;
let resultadoPartida = [];
let respuestaCorrecta = "";


function loginForm() {
    document.getElementById('signUp').innerHTML = `
                <legend>¿Nuevo aspirante a golpista? ¡Registrate acá!</legend>
                <div class="buttonContainer">
                    <button type="button" onclick="signUpForm()">Registrate</button>
                </div>`;
    document.getElementById('logIn').innerHTML = `
                    <legend>¡Bienvenido futuro dictador! Inicie sesión</legend>
                <div class="logInInput">
                    <label for="username">Nombre de Usuario</label>
                    <input type="username" id="username" placeholder="Nombre de ususario">
                </div>
                <div class="logInInput">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" placeholder="********">
                </div>
                <div class="buttonContainer">
                    <button onclick="User()" data-bs-toggle="tooltip" data-bs-placement="top" title="Login">Iniciar
                        sesión</button>
                </div>`;
}

function signUpForm() {
    document.getElementById('signUp').innerHTML = `
                <legend>¿No es tu primer golpe? ¡Inicia sesión acá!</legend>
                <div class="buttonContainer">
                    <button type="button" onclick="loginForm()">Iniciar sesión</button>
                </div>`;
    document.getElementById('logIn').innerHTML = `
    <legend>¡Bienvenido futuro dictador! Registresé</legend>
    <div class = 'logInInput'>
        <label for='newUsername'>Nombre de Usuario</label>
        <input type='text' id='newUsername' placeholder='Nombre de usuario'>
    </div>
    <div class = 'logInInput'>
        <label for='newPassword'>Contraseña</label>
        <input type='password' id='newPassword' placeholder='********'>
    </div>
    <div class = 'buttonContainer'>
        <button onclick='newUser()' data-bs-toggle='tooltip'
            data-bs-placement='top' title='SignUp'>Registrarse</button>
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        const result = await response.json();
        console.log(result.message)
        if (result.message === 'ok') {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('main-menu').style.display = 'block';
            document.getElementById('user-registered').style.display = '';
            ui.setUser(result.username);
            idLoggeado = result.userId;
            return result;
        } if (result.message === 'admin') {
            ui.adminScreen();
            ui.setUser(result.username);
            idLoggeado = result.userId;
            return result;

        } else {
            alert(result.message || 'Error al iniciar sesión');
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
        });

        let result = await response.json()
        console.log(result.message)
        if (result.message === 'ok') {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('main-menu').style.display = 'block';
            document.getElementById('user-registered').style.display = '';
            ui.setUser(result.username);
            idLoggeado = result.userId;
            alert('bienvenido dios dictador');
            return result;
        } else {
            alert(result.message || 'Error al iniciar sesión');
        }
    } catch (error) {

    }
}


async function cargarDatosPregunta() {
    try {
        const questionIdInput = document.getElementById('question-id-input').value.trim();

        if (!questionIdInput || isNaN(questionIdInput)) {
            alert('Por favor ingresa un ID válido (número)');
            return;
        }
        const response = await fetch(`http://localhost:4000/getQuestion?id=${questionIdInput}`);
        const result = await response.json();

        console.log('Respuesta del servidor:', result);

        if (result.response && result.response.id) {
            const pregunta = result.response;

            document.getElementById('edit-content').value = pregunta.content || '';
            document.getElementById('edit-answer-a').value = pregunta.answerA || '';
            document.getElementById('edit-answer-b').value = pregunta.answerB || '';
            document.getElementById('edit-answer-c').value = pregunta.answerC || '';
            document.getElementById('edit-answer-d').value = pregunta.answerD || '';
            document.getElementById('edit-correct-answer').value = pregunta.correctAnswer || '';
            document.getElementById('edit-emoji-clue').value = pregunta.emojiClue || '';
            document.getElementById('edit-text-clue').value = pregunta.textClue || '';
            document.getElementById('edit-fifty-clue').value = pregunta.fiftyClue || '';

            document.getElementById('question-info').style.display = 'block';

            document.getElementById('display-question-id').textContent = pregunta.id;
        } else {
            alert(result.message || 'No se encontró la pregunta con ese ID');
        }
    } catch (error) {
        console.error('Error completo:', error);
        alert('Error al comunicarse con el servidor. Ver consola para detalles.');
    }
}

async function editarPregunta() {
    try {
        const questionId = document.getElementById('question-id-input').value.trim();

        if (!questionId) {
            throw new Error('Primero debes cargar una pregunta para editar');
        }

        const camposRequeridos = [
            'edit-content', 'edit-answer-a', 'edit-answer-b',
            'edit-answer-c', 'edit-answer-d', 'edit-correct-answer',
            'edit-emoji-clue', 'edit-text-clue', 'edit-fifty-clue'
        ];

        for (const campoId of camposRequeridos) {
            const campo = document.getElementById(campoId);
            if (!campo.value.trim()) {
                campo.focus();
                throw new Error(`El campo ${campoId.replace('edit-', '')} no puede estar vacío`);
            }
        }

        const preguntaEditada = {
            id: questionId,
            content: document.getElementById('edit-content').value,
            answerA: document.getElementById('edit-answer-a').value,
            answerB: document.getElementById('edit-answer-b').value,
            answerC: document.getElementById('edit-answer-c').value,
            answerD: document.getElementById('edit-answer-d').value,
            correctAnswer: document.getElementById('edit-correct-answer').value.toUpperCase(),
            emojiClue: document.getElementById('edit-emoji-clue').value,
            textClue: document.getElementById('edit-text-clue').value,
            fiftyClue: document.getElementById('edit-fifty-clue').value.toUpperCase(),
            largeQuestion: 0,
            image: null,
            text: null
        };

        if (!['A', 'B', 'C', 'D'].includes(preguntaEditada.correctAnswer)) {
            throw new Error('La respuesta correcta debe ser A, B, C o D');
        } else if (!['AB', 'AC', 'AD', 'BA', 'BC', 'BD', 'CA', 'CB', 'CD', 'DA', 'DB', 'DC'].includes(preguntaEditada.fiftyClue)) {
            throw new Error('La respuesta correcta debe ser AB, AC, AD...');
        }



        const response = await fetch('http://localhost:4000/editQuestion', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preguntaEditada)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al actualizar la pregunta');
        }

        alert(result.message || 'Pregunta actualizada correctamente');

    } catch (error) {
        console.error('Error al editar pregunta:', error);
        alert(`Error: ${error.message}`);
    }
}

async function borrarPregunta() {
    try {
        const id = document.getElementById('question-id-input').value.trim();

        if (!id) {
            throw new Error('Ingresá un ID válido');
        }

        const response = await fetch('http://localhost:4000/deleteQuestion', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al borrar la pregunta');
        }

        alert(result.message || 'Pregunta borrada correctamente');

        document.getElementById('question-id-input').value = '';
        document.getElementById('question-info').style.display = 'none';
        document.getElementById('edit-content').value = '';
        document.getElementById('edit-answer-a').value = '';
        document.getElementById('edit-answer-b').value = '';
        document.getElementById('edit-answer-c').value = '';
        document.getElementById('edit-answer-d').value = '';
        document.getElementById('edit-correct-answer').value = '';
        document.getElementById('edit-emoji-clue').value = '';
        document.getElementById('edit-text-clue').value = '';
        document.getElementById('edit-fifty-clue').value = '';
        document.getElementById('display-question-id').textContent = '';

    } catch (error) {
        console.error('Error al borrar pregunta:', error);
        alert(`Error: ${error.message}`);
    }
}

function mostrarEditarPregunta() {
    ui.adminQuestionsScreen();
}

function mostrarAdminUsuarios() {
    ui.adminUsersScreen();
}

function mostrarAdminPartidas() {
    ui.adminGamesScreen();
}

async function crearPregunta() {
    const content = document.getElementById('new-question-text').value;
    const answerA = document.getElementById('new-question-a').value;
    const answerB = document.getElementById('new-question-b').value;
    const answerC = document.getElementById('new-question-c').value;
    const answerD = document.getElementById('new-question-d').value;
    const correctAnswer = document.getElementById('new-correct-answer').value;
    const emojiClue = document.getElementById('new-emoji-clue').value;
    const textClue = document.getElementById('new-text-clue').value;
    const fiftyClue = document.getElementById('new-fifty-clue').value;
    const largeQuestion = document.getElementById('new-question-length').value === 'true' ? 1 : 0;
    const image = document.getElementById('new-question-image').value;

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
        const res = await fetch('http://localhost:4000/addQuestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preguntaNueva)
        });

        const data = await res.json();
        alert(data.message);
    } catch (error) {
        console.error(error);
        alert('Error al crear la pregunta.');
    }
}

async function editarPregunta() {
    const getValOrNull = id => {
        const el = document.getElementById(id);
        if (!el) return null;
        const val = el.value.trim();
        return val === "" ? null : val;
    };


    const id = getValOrNull('question-id-input');
    const content = getValOrNull('edit-content');
    const answerA = getValOrNull('edit-answer-a');
    const answerB = getValOrNull('edit-answer-b');
    const answerC = getValOrNull('edit-answer-c');
    const answerD = getValOrNull('edit-answer-d');
    const correctAnswer = getValOrNull('edit-correct-answer');
    const emojiClue = getValOrNull('edit-emoji-clue');
    const textClue = getValOrNull('edit-text-clue');
    const fiftyClue = getValOrNull('edit-fifty-clue');

    const largeQuestion = getValOrNull('edit-large-question');
    const image = getValOrNull('edit-image');
    const text = getValOrNull('edit-text');

    const preguntaEditada = {
        id,
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
        image,
        text
    };

    try {
        const res = await fetch('http://localhost:4000/editQuestion', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preguntaEditada)
        });

        const data = await res.json();
        alert(data.message);
    } catch (err) {
        console.error(err);
        alert('Error al editar la pregunta.');
    }
}

async function borrarUsuario() {
    const username = document.getElementById('username-to-delete').value.trim();

    if (!username) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/deleteUser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: username })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al borrar el usuario');
        }

        alert(result.message || 'Usuario borrado correctamente');

        document.getElementById('username-to-delete').value = '';

    } catch (error) {
        console.error('Error al borrar usuario:', error);
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

            document.getElementById('display-game-id').textContent = partida.id;
            document.getElementById('display-player-id').textContent = partida.idUser;
            document.getElementById('display-game-score').textContent = partida.score;
            document.getElementById('display-game-win').textContent = partida.win ? 'Sí' : 'No';

            document.getElementById('game-info').style.display = 'block';
        } else {
            alert(result.message || 'No se encontró la partida con ese ID');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al comunicarse con el servidor. Ver consola para detalles.');
    }
}

async function borrarPartida() {
    const idInput = document.getElementById('game-id-input');
    const id = idInput.value.trim();

    if (!id) {
        alert('Por favor ingresa un ID de partida');
        idInput.focus();
        return;
    }

    try {

        const response = await fetch('http://localhost:4000/deleteGames', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al borrar la partida');
        }


        alert(result.message || 'Partida borrada correctamente');

        idInput.value = '';
        const gameInfoSection = document.getElementById('game-info');
        if (gameInfoSection) {
            gameInfoSection.style.display = 'none';
        }

    } catch (error) {
        console.error('Error al borrar partida:', error);
        alert(`Error: ${error.message}`);
    }
}

async function abrirRanking() {
    ui.rankingScreen();

    try {
        const response = await fetch('http://localhost:4000/getAllGames', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        console.log(result);
        const games = result.response;

        if (!Array.isArray(games) || games.length === 0) {
            alert("No hay partidas registradas.");
            return;
        }
        const mejoresPartidas = new Map();

        for (let game of games) {
            if (!mejoresPartidas.has(game.idUser) || game.score > mejoresPartidas.get(game.idUser).score) {
                mejoresPartidas.set(game.idUser, game);
            }
        }

        const rankingOrdenado = Array.from(mejoresPartidas.values()).sort((a, b) => b.score - a.score);

        const contenedor = document.getElementById("ranking-data");
        contenedor.innerHTML = "";

        rankingOrdenado.forEach((game, index) => {
            const div = document.createElement("div");
            div.className = "ranking-user";
            div.innerHTML = `
                <p>#${index + 1}</p>
                <div class="vertical-line"></div>
                <p>Jugador ID: ${game.idUser}</p>
                <div class="vertical-line"></div>
                <p>${game.score} pts.</p>
            `;
            contenedor.appendChild(div);

            const linea = document.createElement("div");
            linea.className = "horizontal-line";
            contenedor.appendChild(linea);
        });

    } catch (error) {
        console.error("Error al cargar el ranking:", error);
        alert("Hubo un problema al cargar el ranking.");
    }
}

function logOut() {
    console.log("hola");
    ui.loginScreen();
}

async function cargarPreguntaRandom() {
    try {
        document.getElementById("text-clue").disabled = false;
        document.getElementById("emoji-clue").disabled = false;
        document.getElementById("fifty-clue").disabled = false;

        const response = await fetch('http://localhost:4000/randomQuestion', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ excludedIds: preguntasUsadas })
        });

        const result = await response.json();

        if (!result.response) {
            if (preguntasUsadas.length > 0) {
                preguntasUsadas = [];
                return cargarPreguntaRandom();
            }
            alert("No hay preguntas disponibles en la base de datos.");
            return;
        }

        const pregunta = result.response;
        preguntaActual = pregunta;
        preguntasUsadas.push(pregunta.id);

        document.getElementById("question-number").textContent = preguntasUsadas.length;
        document.getElementById("question-text").textContent = pregunta.content;

        document.getElementById("answer-a-text").textContent = pregunta.answerA;
        document.getElementById("answer-b-text").textContent = pregunta.answerB;
        document.getElementById("answer-c-text").textContent = pregunta.answerC;
        document.getElementById("answer-d-text").textContent = pregunta.answerD;
        document.getElementById("volverEnunciado").style.display = "none";

        if (pregunta.largeQuestion) {
            document.getElementById("question-text").textContent = pregunta.text;

        }
        if (pregunta.image) {
            const img = document.createElement("img");
            img.src = pregunta.image;
            document.getElementById("question-container").appendChild(img);
        }

        ["a", "b", "c", "d"].forEach(letra => {
            const texto = document.getElementById(`answer-${letra}-text`);
            texto.innerHTML = "";

            switch (letra) {
                case 'a': texto.textContent = pregunta.answerA; break;
                case 'b': texto.textContent = pregunta.answerB; break;
                case 'c': texto.textContent = pregunta.answerC; break;
                case 'd': texto.textContent = pregunta.answerD; break;
            }

            document.getElementById(`answer-${letra}`).style.display = "inline-block";
        });

        document.getElementById("fifty-clue").disabled = false;


    } catch (error) {
        console.error("Error al traer pregunta aleatoria:", error);
        alert("Error al traer pregunta.");
    }
}


function mostrarPistaTexto() {
    const textImage = document.getElementById("text-clue");
    if (!preguntaActual?.textClue) {
        alert("No hay pista de texto disponible.");
        return;
    }

    document.getElementById("text-clue-span").textContent = preguntaActual.textClue;
    abrirModal("text-clue-modal");
    
    textImage.style.backgroundImage = `url('../public/images/clues/cluesUsadas/text-gris.png')`;
    textImage.style.backgroundSize = 'cover';
    textImage.style.backgroundRepeat = 'no-repeat';
    textImage.style.backgroundPosition = 'center';
    textImage.disabled = true;
}

function mostrarPistaEmoji() {
    const emojiClueButton = document.getElementById("emoji-clue");
    if (!preguntaActual?.emojiClue) {
        alert("No hay pista de emojis disponible.");
        return;
    }
    document.getElementById("emoji-clue-span").textContent = preguntaActual.emojiClue;
    abrirModal("emoji-clue-modal");
    
    emojiClueButton.style.backgroundImage = `url('../public/images/clues/cluesUsadas/emoji-gris.png')`;
    emojiClueButton.style.backgroundSize = 'cover';
    emojiClueButton.style.backgroundRepeat = 'no-repeat';
    emojiClueButton.style.backgroundPosition = 'center';
    emojiClueButton.disabled = true;
}



function mostrarPistaCincuenta() {
    const fiftyClue = document.getElementById("fifty-clue");
    if (!preguntaActual || !preguntaActual.fiftyClue) {
        alert("No hay pista 50/50 disponible.");
        return;
    }

    const letrasDisponibles = preguntaActual.fiftyClue.toUpperCase().split('');

    ["A", "B", "C", "D"].forEach(letra => {
        const boton = document.getElementById(`answer-${letra.toLowerCase()}`);
        const texto = document.getElementById(`answer-${letra.toLowerCase()}-text`);

        if (!letrasDisponibles.includes(letra)) {
            texto.textContent = "";

            boton.style.backgroundImage = `url('../public/images/answers/fifty-fifty/50-50-${letra}.png')`;
            boton.style.backgroundSize = 'cover';
            boton.style.backgroundRepeat = 'no-repeat';
            boton.style.backgroundPosition = 'center';

            boton.disabled = true;
        }
    });

    fiftyClue.style.backgroundImage = `url('../public/images/clues/cluesUsadas/fifty-fifty-gris.png')`;
    fiftyClue.style.backgroundSize = 'cover';
    fiftyClue.style.backgroundRepeat = 'no-repeat';
    fiftyClue.style.backgroundPosition = 'center';
    fiftyClue.disabled = true;
}


async function cambiarAPregunta() {
    try {
        const response = await fetch('http://localhost:4000/randomQuestion', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ excludedIds: preguntasUsadas })
        });

        const result = await response.json();
        if (!result.response) {
            alert("¡No hay más preguntas! ");
            finalizarJuego(true);
            return;
        }

        const pregunta = result.response;
        preguntaActual = pregunta;
        preguntasUsadas.push(pregunta.id);
        respuestaCorrecta = pregunta.correctAnswer;

        document.getElementById("question-number").textContent = preguntasUsadas.length;

        const textoPregunta = pregunta.largeQuestion
            ? pregunta.text || pregunta.content
            : pregunta.content;
        document.getElementById("question-text").textContent = textoPregunta;

        ["A", "B", "C", "D"].forEach(letra => {
            const boton = document.getElementById(`answer-${letra.toLowerCase()}`);
            const texto = document.getElementById(`answer-${letra.toLowerCase()}-text`);

            boton.disabled = false;
            boton.style.backgroundImage = "";
            boton.style.backgroundColor = "";
            texto.textContent = pregunta[`answer${letra}`];
        });

        const botonEnunciado = document.querySelector(".return-button:nth-child(2)");
        botonEnunciado.style.display = pregunta.largeQuestion ? "inline-block" : "none";


        ["text-clue", "emoji-clue", "fifty-clue"].forEach(id => {
            document.getElementById(id).disabled = false;
        });

    } catch (error) {
        console.error("Error al cambiar pregunta:", error);
    }
}


function verificarRespuesta(letraSeleccionada) {
    if (!preguntaActual) return;

    const esCorrecta = letraSeleccionada === preguntaActual.correctAnswer;

    resultadoPartida.push({
        idPregunta: preguntaActual.id,
        respuestaUsuario: letraSeleccionada,
        respuestaCorrecta: preguntaActual.correctAnswer,
        fueCorrecta: esCorrecta
    });

    if (esCorrecta) {
        scoreActual += preguntaActual.largeQuestion ? 10 : 5;
        alert(`¡Muy bien! Acertaste`);
    } else {
        alert(`Lo siento, la respuesta correcta era: '${preguntaActual.correctAnswer}'`);
    }

    ["A", "B", "C", "D"].forEach(letra => {
        const boton = document.getElementById(`answer-${letra.toLowerCase()}`);
        boton.disabled = true;

        if (letra === preguntaActual.correctAnswer) {
            boton.style.backgroundImage = `url('../public/images/answers/correct/correcta-${letra}.png')`;
        } else {
            boton.style.backgroundImage = `url('../public/images/answers/incorrect/incorrecta-${letra}.png')`;
        }
    });

    setTimeout(() => {
        if (resultadoPartida.length >= 20) {
            finalizarJuego();
        } else {
            cambiarAPregunta();
        }
    }, 1500);
}

function finalizarJuego() {
    document.getElementById("game-screen").style.display = "none";
    const gameDiv = document.getElementById("game");
    subirPartida(scoreActual, 1);
}

function cambiarAJuego() {
    reiniciarEstadoJuego();
    ui.juegoScreen();
    cargarPreguntaRandom();
    document.getElementById("main-menu-body").style.display = "none";
}

function reiniciarEstadoJuego() {
    scoreActual = 0;
    preguntasUsadas = [];
    preguntaActual = null;
    resultadoPartida = [];
    respuestaCorrecta = "";

    document.getElementById("text-clue").disabled = false;
    document.getElementById("emoji-clue").disabled = false;
    document.getElementById("fifty-clue").disabled = false;

    document.getElementById("question-number").textContent = "0";
}

function nuevojuego() {

    reiniciarEstadoJuego();

    document.getElementById("win").style.display = "none";
    document.getElementById("game-screen").style.display = "block";

    ["a", "b", "c", "d"].forEach(letra => {
        const boton = document.getElementById(`answer-${letra}`);
        boton.style.backgroundImage = `url('../public/images/answers/normal/respuesta-${letra}.png')`;
        boton.disabled = false;
        document.getElementById(`answer-${letra}-text`).textContent = "";
    });

    document.getElementById("question-text").textContent = "";
    const questionContainer = document.getElementById("question-container");
    const img = questionContainer.querySelector("img");
    if (img) {
        questionContainer.removeChild(img);
    }

    ui.juegoScreen();
    cargarPreguntaRandom();
}

function reiniciarJuego() {
    scoreActual = 0;
    preguntasUsadas = [];
    preguntaActual = null;
    resultadoPartida = [];

    document.getElementById("win").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    ["a", "b", "c", "d"].forEach(letra => {
        const boton = document.getElementById(`answer-${letra}`);
        boton.disabled = false;
        boton.style.backgroundImage = "";
    });
    document.getElementById("text-clue").disabled = false;
    document.getElementById("emoji-clue").disabled = false;
    document.getElementById("fifty-clue").disabled = false;
    cargarPreguntaRandom();
}

async function subirPartida(score, win) {
    try {

        console.log("Subiendo partida con:", { idUser: idLoggeado, score, win });

        const response = await fetch("http://localhost:4000/addGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idUser: idUser,
                score: score,
                win: win
            })
        });

        const result = await response.json();
        console.log(result.message);
        return result;
    } catch (error) {
        console.error("Error al subir partida:", error);
        throw error;
    }
}

async function back() {
    const res = await fetch(`http://localhost:4000/checkAdminStatus/${idLoggeado}`);
    const data = await res.json();

    reiniciarEstadoJuego();

    document.getElementById("win").style.display = "none";
    document.getElementById("game-screen").style.display = "none";

    ["a", "b", "c", "d"].forEach(letra => {
        const boton = document.getElementById(`answer-${letra}`);
        boton.style.backgroundImage = `url('../public/images/answers/normal/respuesta-${letra}.png')`;
        boton.disabled = false;
    });

    if (data.isAdmin) {
        ui.adminScreen();
    } else {
        ui.userScreen();
    }
}

function logOut() {
    document.getElementById('username').value = ''
    document.getElementById('password').value = ''
    document.getElementById('admin-ui').style.display = 'none'
    document.getElementById('main-menu').style.display = 'none'
    document.getElementById('user-registered').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
}

function abrirModal(idModal) {
    document.getElementById(idModal).style.display = "block";
    document.getElementById("modal-blur").style.display = "block";
}

function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = "none";
    document.getElementById("modal-blur").style.display = "none";
}

if (preguntaActual.largeQuestion) {
    document.getElementById("long-question-text").textContent = preguntaActual.text;
    if (preguntaActual.image) {
        document.getElementById("long-question-image").src = preguntaActual.image;
    }
    abrirModal("long-question-modal");
}