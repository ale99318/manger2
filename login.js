// login.js

document.getElementById("empezarBtn").addEventListener("click", () => {
  const nombreDT = document.getElementById("nombreDT").value.trim();
  const clubFavorito = document.getElementById("clubFavorito").value.trim();
  const imagenSeleccionada = document.querySelector("input[name='face']:checked").value;

  if (!nombreDT || !clubFavorito) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Guardar los datos localmente
  localStorage.setItem("coachName", nombreDT);
  localStorage.setItem("selectedClub", clubFavorito);
  localStorage.setItem("coachImage", imagenSeleccionada);

  // Redirigir al index o a la siguiente página
  window.location.href = "index.html";
});
