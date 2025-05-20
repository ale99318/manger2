// index.js

document.addEventListener("DOMContentLoaded", () => {
  const empezarBtn = document.getElementById("empezarBtn");

  empezarBtn.addEventListener("click", () => {
    // Aquí decides a dónde llevar al usuario cuando empiece
    window.location.href = "seleccion-equipo.html"; // Puedes cambiar la ruta si usas otra página inicial
  });
});
