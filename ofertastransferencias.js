// Obtener el nombre del club guardado en localStorage
const selectedClub = localStorage.getItem("selectedClub");

// Mostrar el nombre del club
document.getElementById("nombre-club").textContent = selectedClub;

// Obtener todas las propuestas guardadas
const propuestas = JSON.parse(localStorage.getItem("propuestasTransferencias") || "[]");

// Obtener jugadores del club actual
const jugadoresDelClub = jugadores.filter(j => j.club === selectedClub);

// Mostrar solo propuestas para jugadores de este club
const propuestasDelClub = propuestas.filter(p => 
    jugadoresDelClub.some(j => j.nombre === p.jugador)
);

// Mostrar contenedor
const contenedor = document.getElementById("info-club");
contenedor.innerHTML = "";

// Título
const tituloPropuestas = document.createElement("h2");
tituloPropuestas.textContent = "Ofertas Recibidas";
contenedor.appendChild(tituloPropuestas);

// Mostrar cada propuesta
if (propuestasDelClub.length === 0) {
    const sinOfertas = document.createElement("p");
    sinOfertas.textContent = "No hay propuestas por tus jugadores.";
    contenedor.appendChild(sinOfertas);
} else {
    propuestasDelClub.forEach(propuesta => {
        const div = document.createElement("div");
        div.textContent = `${propuesta.jugador}: ${propuesta.clubComprador} ofrece $${propuesta.monto.toLocaleString()}`;
        
        // Botón para aceptar oferta
        const botonAceptar = document.createElement("button");
        botonAceptar.textContent = "Aceptar Oferta";
        botonAceptar.onclick = function() {
            aceptarOferta(propuesta.jugador);
        };
        
        div.appendChild(botonAceptar);
        contenedor.appendChild(div);
    });
}

// Función para aceptar oferta
function aceptarOferta(nombreJugador) {
    // Marcar como vendido
    let vendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
    vendidos.push(nombreJugador);
    localStorage.setItem("jugadoresVendidos", JSON.stringify(vendidos));
    
    // Filtrar la propuesta aceptada del arreglo general
    const nuevasPropuestas = propuestas.filter(p => p.jugador !== nombreJugador);
    localStorage.setItem("propuestasTransferencias", JSON.stringify(nuevasPropuestas));
    
    alert(`Has vendido a ${nombreJugador}`);
    location.reload();
}
