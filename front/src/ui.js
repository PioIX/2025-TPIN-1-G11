class UserInterface {
  constructor() {}

  /**
   * Obtiene el texto ingresado en el input "Correo electrónico", sección "Login".
   * @returns String que contiene el correo electrónico ingresado por el usuario.
   */
  getUsername() {
    return document.getElementById("username").value;
  }

  /**
   * Modifica el nombre de usuario logueado presentado en pantalla.
   * @param {String} username Nombre del usuario logueado.
   */
  setUser(name) {
    document.getElementById(
      "loggedUsername"
    ).textContent = `¡Bienvenido ${name}!`;
  }

  /**
   * Obtiene el texto ingresado en el input "Contraseña", sección "Login".
   * @returns String que contiene la contraseña ingresada por el usuario.
   */
  getPassword() {
    return document.getElementById("password").value;
  }

  getUsername(){
    return document.getElementById("username").value;
  }

  getNewUsername() {
    return document.getElementById("newUsername").value;
  }

  getNewPassword() {
    return document.getElementById("newPassword").value;
  }
}

/**
 * Objeto para manejar la UI en este TP, provisto por los docentes Nico Facón y Mati Marchesi.
 */
const ui = new UserInterface();
