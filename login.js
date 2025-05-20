// Comprobar si ya existe una sesión al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay datos de sesión guardados
  const nombreDT = localStorage.getItem("coachName");
  const clubFavorito = localStorage.getItem("selectedClub");
  const imagenSeleccionada = localStorage.getItem("coachImage");
  
  // Si ya existen todos los datos necesarios, redirigir directamente
  if (nombreDT && clubFavorito && imagenSeleccionada) {
    console.log("Sesión encontrada, redirigiendo automáticamente...");
    window.location.href = "periodico.html";
    return;
  }
  
  // Si no hay datos guardados, continuar con el formulario de registro
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
  window.location.href = "periodico.html";
});

// Función para cerrar sesión (puedes agregarla a un botón de logout en tu juego)
function cerrarSesion() {
  // Eliminar los datos de la sesión
  localStorage.removeItem("coachName");
  localStorage.removeItem("selectedClub");
  localStorage.removeItem("coachImage");
  // Opcional: redirigir a la página de login
  window.location.href = "login.html";
}
