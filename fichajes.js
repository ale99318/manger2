// Configuración inicial 
const dtNombre = localStorage.getItem("coachName") || "Entrenador";
const clubNombre = localStorage.getItem("selectedClub") || "Mi Equipo";

// Obtener datos de clubes desde window.clubes (definido en tu JS de clubes)
const clubes = window.clubes || [];
