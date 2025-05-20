// Llenar la lista de clubes
window.addEventListener("DOMContentLoaded", () => {
  const selectClub = document.getElementById("clubFavorito");

  clubes.forEach(club => {
    const option = document.createElement("option");
    option.value = club.nombre;
    option.textContent = club.nombre;
    selectClub.appendChild(option);
  });
});

// Guardar los datos y redirigir
document.getElementById("empezarBtn").addEventListener("click", () => {
  const nombreDT = document.getElementById("nombreDT").value.trim();
  const clubFavorito = document.getElementById("clubFavorito").value.trim();
  const imagenSeleccionada = document.querySelector("input[name='face']:checked")?.value;

  if (!nombreDT || !clubFavorito || !imagenSeleccionada) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Guardar los datos en localStorage
  localStorage.setItem("coachName", nombreDT);
  localStorage.setItem("selectedClub", clubFavorito);
  localStorage.setItem("coachImage", imagenSeleccionada);

  // Redirigir a la página principal del simulador
  window.location.href = "index.html";
});

