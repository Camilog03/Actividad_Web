// ===== main.js =====
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar componentes de Materialize
  M.Sidenav.init(document.querySelectorAll(".sidenav"));
  M.Modal.init(document.querySelectorAll(".modal"));
  M.Collapsible.init(document.querySelectorAll(".collapsible"));
  M.Tooltip.init(document.querySelectorAll(".tooltipped"));

  iniciarObjetivos();
  iniciarAvances();
  iniciarContacto();
});

/* ---------- OBJETIVOS ---------- */
function iniciarObjetivos() {
  var boton = document.getElementById("btn-expandir");
  var lista = document.getElementById("lista-objetivos");
  if (!boton || !lista) return;

  // accordion:false permite tener varios objetivos abiertos a la vez
  var instancia = M.Collapsible.init(lista, { accordion: false });
  var items = lista.querySelectorAll(":scope > li");
  var todosAbiertos = false;

  boton.addEventListener("click", function () {
    todosAbiertos = !todosAbiertos;
    items.forEach(function (_, i) {
      if (todosAbiertos) { instancia.open(i); } else { instancia.close(i); }
    });
    boton.innerHTML = todosAbiertos
      ? '<i class="material-icons left">unfold_less</i>Contraer todos'
      : '<i class="material-icons left">unfold_more</i>Expandir todos';
  });
}

/* ---------- AVANCES ---------- */
function iniciarAvances() {
  // 1. Mostrar / ocultar detalle de cada avance
  document.querySelectorAll(".btn-detalle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var detalle = document.getElementById(btn.dataset.target);
      var visible = detalle.classList.toggle("visible");
      btn.textContent = visible ? "Ocultar detalle" : "Ver detalle";
      btn.setAttribute("aria-expanded", visible ? "true" : "false");
    });
  });

  // 2. Filtrar avances por estado
  var filtros = document.querySelectorAll(".filtro");
  filtros.forEach(function (filtro) {
    filtro.addEventListener("click", function () {
      filtros.forEach(function (f) {
        f.classList.remove("activo");
        f.setAttribute("aria-pressed", "false");
      });
      filtro.classList.add("activo");
      filtro.setAttribute("aria-pressed", "true");

      var estado = filtro.dataset.estado;
      document.querySelectorAll(".avance-col").forEach(function (col) {
        var mostrar = estado === "todos" || col.dataset.estado === estado;
        col.style.display = mostrar ? "" : "none";
      });
    });
  });

  // 3. Cambiar color de fondo de la página
  var btnColor = document.getElementById("btn-color");
  if (btnColor) {
    btnColor.addEventListener("click", function () {
      var activo = document.body.classList.toggle("fondo-alterno");
      M.toast({ html: activo ? "Fondo cambiado" : "Fondo restaurado", classes: "toast-unimetas" });
    });
  }
}

/* ---------- CONTACTO ---------- */
function iniciarContacto() {
  var form = document.getElementById("form-contacto");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validarFormulario()) {
      var nombre = document.getElementById("nombre").value.trim();
      document.getElementById("modal-nombre").textContent = nombre;
      M.Modal.getInstance(document.getElementById("modal-confirmacion")).open();
      form.reset();
      M.updateTextFields();
      M.textareaAutoResize(document.getElementById("mensaje"));
    } else {
      M.toast({ html: "Revisa los campos marcados", classes: "toast-error" });
    }
  });
}

function validarFormulario() {
  var valido = true;

  var nombre = document.getElementById("nombre");
  var correo = document.getElementById("correo");
  var mensaje = document.getElementById("mensaje");

  var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  valido = marcar(nombre, nombre.value.trim().length >= 3,
    "Escribe tu nombre (mínimo 3 caracteres).") && valido;
  valido = marcar(correo, regexCorreo.test(correo.value.trim()),
    "Escribe un correo válido, por ejemplo nombre@correo.com.") && valido;
  valido = marcar(mensaje, mensaje.value.trim().length >= 10,
    "El mensaje debe tener al menos 10 caracteres.") && valido;

  return valido;
}

function marcar(campo, ok, texto) {
  var error = document.getElementById("error-" + campo.id);
  campo.classList.toggle("invalid", !ok);
  campo.classList.toggle("valid", ok);
  error.textContent = ok ? "" : texto;
  return ok;
}
