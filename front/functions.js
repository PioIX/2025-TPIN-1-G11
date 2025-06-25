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
function ingresar() {

    idLoggeado = checkLogged(ui.getUsername(), ui.getPassword());
    if (idLoggeado >= 1) {
        console.log("has ingresado!")
    }
    else {
        console.log("usuario/contraseña incorrectos o la cuenta no existe")
    }


}

//8)
function registrar(name, username, password) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            return -1;
        }
    }

    users.push(new User(name, username, password));
    return users.length;

}

//9)
function registrarse() {
    if (registrar(ui.getName(), ui.getUsername(), ui.getPassword()) > 0) {
        console.log("usuario registrado con éxito")
    } else {
        console.log("usuario previamente registrado")
    }

}
