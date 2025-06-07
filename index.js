// index.js o login.js
document.addEventListener("DOMContentLoaded", () => {
    const empezarBtn = document.getElementById("empezarBtn"); // Ajusta este ID si tu botón tiene otro nombre

    // Verificar si ya hay un club seleccionado y jugadores generados
    const clubSeleccionado = localStorage.getItem("selectedClub");
    const jugadoresGenerados = localStorage.getItem("jugadoresGenerados");
    const jugadoresData = localStorage.getItem("jugadoresPorClub");

    if (clubSeleccionado && jugadoresGenerados === "true" && jugadoresData) {
        // Si ya hay datos, redirigir directamente al calendario
        window.location.href = "manger2/calendar/calendar.html";
    }

    // Si no hay datos, esperar a que el usuario haga clic en el botón
    if (empezarBtn) {
        empezarBtn.addEventListener("click", () => {
            // Redirigir a la página de selección de club o creación de jugadores si no hay datos
            if (!clubSeleccionado || jugadoresGenerados !== "true" || !jugadoresData) {
                window.location.href = "login.html"; // Ajusta esta ruta si la página siguiente es diferente
            } else {
                window.location.href = "manger2/calendar/calendar.html";
            }
        });
    }
});
