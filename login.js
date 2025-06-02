// Lista de URLs de imágenes para los entrenadores (puedes agregar más o cambiarlas)
const coachImages = [
    { id: "face1", url: "https://randomuser.me/api/portraits/men/32.jpg", alt: "Entrenador 1" },
    { id: "face2", url: "https://randomuser.me/api/portraits/men/68.jpg", alt: "Entrenador 2" },
    { id: "face3", url: "https://randomuser.me/api/portraits/men/75.jpg", alt: "Entrenador 3" },
    { id: "face4", url: "https://randomuser.me/api/portraits/women/44.jpg", alt: "Entrenador 4" },
    { id: "face5", url: "https://randomuser.me/api/portraits/women/65.jpg", alt: "Entrenador 5" }
];

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
    // Asegurarse de que clubes está definido (cargado desde clubes.js)
    if (typeof clubes !== 'undefined') {
        clubes.forEach(club => {
            const option = document.createElement("option");
            option.value = club.nombre;
            option.textContent = club.nombre;
            selectClub.appendChild(option);
        });
    } else {
        console.error("Error: la variable 'clubes' no está definida. Asegúrate de que clubes.js se haya cargado correctamente.");
        alert("Error al cargar los clubes. Por favor, recarga la página.");
    }
    
    // Llenar el selector de imágenes
    const faceSelector = document.getElementById("faceSelector");
    coachImages.forEach(image => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "face-option";
        optionDiv.innerHTML = `
            <input type="radio" name="face" id="${image.id}" value="${image.url}" required>
            <img src="${image.url}" alt="${image.alt}" title="${image.alt}">
        `;
        faceSelector.appendChild(optionDiv);
    });
    
    // Manejar la selección visual de la imagen
    const faceOptions = document.querySelectorAll(".face-option");
    faceOptions.forEach(option => {
        option.addEventListener("click", () => {
            faceOptions.forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");
            const radio = option.querySelector("input");
            radio.checked = true;
        });
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
