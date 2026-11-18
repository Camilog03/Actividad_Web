// Se carga en el <head> para aplicar el tema guardado antes de pintar la página
// y evitar el parpadeo de claro a oscuro.
(function () {
  try {
    var guardado = localStorage.getItem("unimetas-tema");
    if (guardado === "light" || guardado === "dark") {
      document.documentElement.setAttribute("data-theme", guardado);
    }
  } catch (e) { /* sin almacenamiento: se usa el tema del dispositivo */ }
})();
