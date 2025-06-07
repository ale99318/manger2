// index.js
document.addEventListener("DOMContentLoaded", () => {
    const empezarBtn = document.getElementById("empezarBtn");

    // Verificar si ya hay un club seleccionado y jugadores generados
    const clubSeleccionado = localStorage.getItem("selectedClub");
    const jugadoresGenerados = localStorage.getItem("jugadoresGenerados");
    const jugadoresData = localStorage.getItem("jugadoresPorClub");

    if (clubSeleccionado && jugadoresGenerados === "true" && jugadoresData) {
        // Si ya hay datos, redirigir directamente al calendario
        console.log("Redirigiendo al calendario porque ya hay datos guardados.");
        // Ruta relativa ajustada desde la raíz de manager2/
        window.location.href = "calendar/calendar.html";
    }

    // Si no hay datos, esperar a que el usuario haga clic en el botón
    if (empezarBtn) {
        empezarBtn.addEventListener("click", () => {
            // Redirigir a la página de selección de club o creación de jugadores si no hay datos
            if (!clubSeleccionado || jugadoresGenerados !== "true" || !jugadoresData) {
                console.log("Redirigiendo a login porque no hay datos guardados.");
                // Ruta asumiendo que login.html está en la raíz de manager2/
                window.location.href = "login.html";
            } else {
                console.log("Redirigiendo al calendario desde el botón.");
                window.location.href = "calendar/calendar.html";
            }
        });
    }
});
