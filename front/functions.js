let idLoggeado = -1;

// 6)
function checkLogged(username, password) {

    for (let i = 0; i < users.length; i++) {
        if ((users[i].username == username) && (users[i].password == password)) {
            return users[i].id;
        } else if ((users[i].username == username) && (users[i].password != password)) {
            return 0;
        }
    }

    return -1;

}

//7)
function login() {

    idLoggeado = checkLogged(ui.getUsername(), ui.getPassword());
    if (idLoggeado >= 1) {
        console.log("has ingresado!")
    }
    else {
        console.log("usuario/contraseña incorrectos o la cuenta no existe")
    }


}

//8)
function checksignup(name, username, password) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            return -1;
        }
    }

    users.push(new User(name, username, password));
    return users.length;

}

//9)
function signup() {
    if (registrar(ui.getName(), ui.getUsername(), ui.getPassword()) > 0) {
        console.log("usuario registrado con éxito")
    } else {
        console.log("usuario previamente registrado")
    }

}


function signUpForm(){
    document.getElementById("signUp").innerHTML = ``;
    document.getElementById("signUp").id = "";
    document.getElementById("logIn").innerHTML = `
    <legend>¡Bienvenido futuro dictador! Registresé</legend>
    <div class = "logInInput">
        <label for="username">Nombre de Usuario</label>
        <input type="username" id="username" placeholder="Nombre de ususario">
    </div>
    <div class = "logInInput">
        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="********">
    </div>
    <div class = "buttonContainer">
        <button onclick="logIn()" data-bs-toggle="tooltip"
            data-bs-placement="top" title="SignUp">Registrarse</button>
    </div>`
}