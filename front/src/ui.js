class UserInterface {
  constructor() { }

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

  getUsername() {
    return document.getElementById("username").value;
  }

  getNewUsername() {
    return document.getElementById("newUsername").value;
  }

  getNewPassword() {
    return document.getElementById("newPassword").value;
  }

  userScreen() {
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("main-menu-body").style.display = "flex";
    document.getElementById("user-registered").style.display = "block";
    document.getElementById("login-container").style.display = "none";

    document.getElementById("admin-ui").style.display = "none";
    document.getElementById("ranking").style.display = "none";
    document.getElementById("game").style.display = "none";
  }

  adminScreen() {

    document.getElementById("login-container").style.display = "none";
    document.getElementById("admin-ui").style.display = "block";
    document.getElementById("user-registered").style.display = "block";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("game").style.display = "none";
  }

  adminQuestionsScreen() {

    document.getElementById("login-container").style.display = "none";
    document.getElementById("admin-ui").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById('admin-questions').style.display = 'block'
  }

  adminUsersScreen() {

    document.getElementById("login-container").style.display = "none";
    document.getElementById("admin-ui").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById('admin-users').style.display = 'block'
  }

  adminGamesScreen() {

    document.getElementById("login-container").style.display = "none";
    document.getElementById("admin-ui").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById('admin-games').style.display = 'block'
  }

  loginScreen() {
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("logo").style.display = "flex";
    document.getElementById('admin-ui').style.display = "none";
    document.getElementById('main-menu').style.display = "none";
  }

  rankingScreen() {
    document.getElementById("ranking").style.display = "block";

    document.getElementById("login-container").style.display = "none";
    document.getElementById("admin-ui").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
  }

  juegoScreen() {
    document.getElementById("game").style.display = "block";
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("login-container").style.display = "none";

    document.getElementById("admin-ui").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("ranking").style.display = "none";
  }



}
const ui = new UserInterface();
