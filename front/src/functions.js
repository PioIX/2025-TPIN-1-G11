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

changeScreenAdmin() 
    {
    const adminUser = document.getElementById("adminUser");
    const logIn = document.getElementById("logIn");
    if (adminUser.style.display !== "none") {
        adminUser.style.display = "none";
        logIn.style.display = "";
        this.clearAllNotes();
        this.clearSelect();
    }
    else {
        adminUser.style.display = "";
        logIn.style.display = "none";
    }
}