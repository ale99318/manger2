// Obtener el nombre del club guardado en localStorage
const selectedClub = localStorage.getItem("selectedClub");
// Mostrar el nombre del club
document.getElementById("nombre-club").textContent = selectedClub;

// Verificar si hay jugadores vendidos guardados en localStorage
let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
let jugadoresCedidos = JSON.parse(localStorage.getItem("jugadoresCedidos") || "[]");

// Filtrar los jugadores que pertenecen al club, no están vendidos y no están cedidos
const jugadoresDelClub = jugadores.filter(jugador => 
    jugador.club === selectedClub && 
    !jugadoresVendidos.includes(jugador.nombre) &&
    !jugadoresCedidos.some(cedido => cedido.nombre === jugador.nombre)
);

// Crear botón de resetear ventas
const botonResetear = document.createElement("button");
botonResetear.textContent = "Resetear Transferencias";
botonResetear.onclick = resetearTransferencias;
document.querySelector(".seccion-club").appendChild(botonResetear);

// Mostrar los jugadores en el contenedor info-club
const contenedor = document.getElementById("info-club");
contenedor.innerHTML = "";

// Primero agregar título para jugadores disponibles
const tituloDisponibles = document.createElement("h2");
tituloDisponibles.textContent = "Jugadores Disponibles";
contenedor.appendChild(tituloDisponibles);

function ponerEnVenta(jugador) {
  jugador.enVenta = true;

// Agregar jugadores disponibles
jugadoresDelClub.forEach(jugador => {
    const div = document.createElement("div");
    div.textContent = jugador.nombre;
    
    // Agregar botón para poner en venta al jugador (redirige a ofertas.html)
    const botonVender = document.createElement("button");
    botonVender.textContent = "Poner en venta";
    botonVender.onclick = function() {
        ponerEnVenta(jugador);
    };
    
    div.appendChild(botonVender);
    contenedor.appendChild(div);
});

// Ahora mostrar jugadores cedidos (si existen)
const jugadoresCedidosDelClub = jugadoresCedidos.filter(cedido => {
    // Encontrar el jugador completo
    const jugadorCompleto = jugadores.find(j => j.nombre === cedido.nombre);
    return jugadorCompleto && jugadorCompleto.club === selectedClub;
});

if (jugadoresCedidosDelClub.length > 0) {
    // Agregar título para jugadores cedidos
    const tituloCedidos = document.createElement("h2");
    tituloCedidos.textContent = "Jugadores Cedidos";
    tituloCedidos.style.marginTop = "20px";
    contenedor.appendChild(tituloCedidos);
    
    // Mostrar cada jugador cedido
    jugadoresCedidosDelClub.forEach(cedido => {
        const div = document.createElement("div");
        div.textContent = `${cedido.nombre} (Cedido al ${cedido.club} hasta ${cedido.finPrestamo})`;
        contenedor.appendChild(div);
    });
}

// Función para poner en venta a un jugador (redirige a ofertas.html)
function ponerEnVenta(jugador) {
    // Marcar al jugador como en venta
    jugador.enVenta = true;
    
    // Guardar el jugador en transferencia en localStorage para acceder desde ofertas.html
    localStorage.setItem("jugadorEnTransferencia", jugador.nombre);
    
    // Redirigir a la página de ofertas
    window.location.href = "ofertas.html";
}

// Función para resetear todas las transferencias
function resetearTransferencias() {
    // Limpiar todos los datos de transferencias
    localStorage.removeItem("jugadoresVendidos");
    localStorage.removeItem("jugadoresCedidos");
    localStorage.removeItem("historialTransferencias");
    
    // Quitar el estado de "en venta" a todos los jugadores
    jugadores.forEach(jugador => {
        jugador.enVenta = false;
    });
    
    // Recargar la página para mostrar todos los jugadores de nuevo
    location.reload();
    
    console.log("Transferencias reseteadas");
}
