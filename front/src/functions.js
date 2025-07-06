function signUpForm(){
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

function User(){
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
            ui.setUser(result.username);
            idLoggeado = result.userId;
            return result;
        } else {
            alert(result.message || "Error al iniciar sesión");
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
}

function newUser(){
    const usuario = {
        name: ui.getNewUsername(),
        password: ui.getNewPassword()
    }
    registerUser(usuario);
}

async function registerUser(newUser){
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
            return result;
        } else {
            alert(result.message || "Error al iniciar sesión");
        }
    } catch (error) {
        
    }
}

async function getQuestion() {
   document.getElementById("question-id").addEventListener("change", async () => {
    const id = document.getElementById("question-id").value;

    try {
        const res = await fetch(`http://localhost:4000/getQuestion?id=${id}`);
        const data = await res.json();

        if (data.response) {
            const q = data.response;
            document.getElementById("question-text").textContent = q.content;
            document.getElementById("question-a").textContent = q.answerA;
            document.getElementById("question-b").textContent = q.answerB;
            document.getElementById("question-c").textContent = q.answerC;
            document.getElementById("question-d").textContent = q.answerD;
            document.getElementById("correct-answer").textContent = q.correctAnswer;
        } else {
            alert("No se encontró la pregunta.");
        }
    } catch (err) {
        alert("Error al traer la pregunta.");
        console.error(err);
    }
});

}

async function borrarPregunta() {
    const id = document.getElementById("question-id").value;

    if (!id) return alert("Ingresá un ID válido.");

    try {
        const res = await fetch("http://localhost:4000/deleteQuestion", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const data = await res.json();
        alert(data.message);
    } catch (err) {
        alert("Error al borrar la pregunta.");
        console.error(err);
    }
}

function mostrarEditarPregunta() {
    const seccion1 = document.getElementById("admin-questions");
    const seccion2 = document.getElementById("new-question");
    seccion1.style.display = "";
    seccion2.style.display = "";
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
    const id = document.getElementById("question-id").value;
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
    const username = document.getElementById("user-id").value;

    if (!username) return alert("Ingresá el nombre de usuario.");

    try {
        const res = await fetch("http://localhost:4000/deleteUser", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username })
        });

        const data = await res.json();
        alert(data.message);
    } catch (err) {
        console.error(err);
        alert("Error al borrar el usuario.");
    }
}

async function borrarPartida() {
    const id = document.getElementById("game-id").value;

    if (!id || isNaN(id)) return alert("Ingresá un ID válido.");

    try {
        const res = await fetch("http://localhost:4000/deleteGames", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(id) })
        });

        const data = await res.json();
        alert(data.message || "Partida eliminada.");
    } catch (err) {
        console.error(err);
        alert("Error al eliminar la partida.");
    }
}
