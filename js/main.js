// ===== main.js =====
document.addEventListener("DOMContentLoaded", function () {
  // Componentes de Materialize presentes en todas las páginas
  M.Sidenav.init(document.querySelectorAll(".sidenav"));
  M.Modal.init(document.querySelectorAll(".modal"));
  M.Tooltip.init(document.querySelectorAll(".tooltipped"));

  iniciarTema();
  iniciarObjetivos();
  iniciarAvances();
  iniciarContacto();
  iniciarIdentidad();
  iniciarWireframes();
});

/* ---------- TEMA CLARO / OSCURO ---------- */
function temaActual() {
  var forzado = document.documentElement.getAttribute("data-theme");
  if (forzado) return forzado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function iniciarTema() {
  var botones = document.querySelectorAll(".btn-tema");

  function pintarIconos() {
    var oscuro = temaActual() === "dark";
    botones.forEach(function (b) {
      b.querySelector(".material-icons").textContent = oscuro ? "light_mode" : "dark_mode";
      b.setAttribute("aria-label", oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
      b.setAttribute("title", oscuro ? "Tema claro" : "Tema oscuro");
    });
  }

  botones.forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var nuevo = temaActual() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nuevo);
      try { localStorage.setItem("unimetas-tema", nuevo); } catch (err) { /* ignorar */ }
      pintarIconos();
    });
  });

  pintarIconos();
}

/* ---------- OBJETIVOS ---------- */
function iniciarObjetivos() {
  var lista = document.getElementById("lista-objetivos");
  if (!lista) return;

  // accordion:false permite tener varios objetivos abiertos a la vez
  var instancia = M.Collapsible.init(lista, { accordion: false });

  var boton = document.getElementById("btn-expandir");
  if (!boton) return;
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
      btnColor.setAttribute("aria-pressed", activo ? "true" : "false");
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

/* ---------- IDENTIDAD VISUAL ---------- */
function iniciarIdentidad() {
  // Copiar el código hexadecimal de cada color
  document.querySelectorAll(".btn-copiar").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var hex = btn.dataset.hex;
      var aviso = function () {
        M.toast({ html: "Copiado " + hex, classes: "toast-unimetas" });
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(aviso, function () {
          M.toast({ html: "No se pudo copiar " + hex, classes: "toast-error" });
        });
      } else {
        M.toast({ html: "Tu navegador no permite copiar: " + hex, classes: "toast-error" });
      }
    });
  });
}

/* ---------- WIREFRAMES: visor de imagen completa ---------- */
function iniciarWireframes() {
  var modalEl = document.getElementById("modal-wireframe");
  if (!modalEl) return;

  var modal = M.Modal.getInstance(modalEl);
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll(".wf-card"));
  var imagen = document.getElementById("wf-imagen");
  var titulo = document.getElementById("wf-titulo");
  var original = document.getElementById("wf-original");
  var actual = 0;

  function mostrar(i) {
    actual = (i + tarjetas.length) % tarjetas.length; // da la vuelta en los extremos
    var img = tarjetas[actual].querySelector("img");
    var nombre = tarjetas[actual].querySelector("figcaption").textContent;
    imagen.src = img.getAttribute("src");
    imagen.alt = img.getAttribute("alt");
    titulo.textContent = nombre;
    original.href = img.getAttribute("src");
  }

  tarjetas.forEach(function (tarjeta, i) {
    tarjeta.querySelector(".wf-abrir").addEventListener("click", function () {
      mostrar(i);
      modal.open();
    });
  });

  document.getElementById("wf-anterior").addEventListener("click", function () { mostrar(actual - 1); });
  document.getElementById("wf-siguiente").addEventListener("click", function () { mostrar(actual + 1); });

  // Flechas del teclado mientras el visor está abierto (Esc lo cierra Materialize)
  document.addEventListener("keydown", function (e) {
    if (!modal.isOpen) return;
    if (e.key === "ArrowLeft") mostrar(actual - 1);
    if (e.key === "ArrowRight") mostrar(actual + 1);
  });
}
