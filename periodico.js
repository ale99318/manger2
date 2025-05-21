window.addEventListener("DOMContentLoaded", () => {
  const dtNombre = localStorage.getItem("coachName");
  const clubNombre = localStorage.getItem("selectedClub");
  const imagen = localStorage.getItem("coachImage");

  if (!dtNombre || !clubNombre || !imagen) {
    alert("Faltan datos del entrenador. Redirigiendo al login...");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("dtNombre").textContent = dtNombre;
  document.getElementById("clubNombre").textContent = clubNombre;
  document.getElementById("dtImagen").src = imagen;

  document.getElementById("continuarBtn").addEventListener("click", () => {
    window.location.href = "menu.html"; // O a la página que quieras
  });
});
