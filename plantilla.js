// Obtener el nombre del club guardado en localStorage
const selectedClub = localStorage.getItem("selectedClub");
// Mostrar el nombre del club
document.getElementById("nombre-club").textContent = selectedClub;

// Verificar si hay jugadores vendidos guardados en localStorage
let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");

// Filtrar los jugadores que pertenecen al club y que no están vendidos
const jugadoresDelClub = jugadores.filter(jugador => 
    jugador.club === selectedClub && !jugadoresVendidos.includes(jugador.nombre)
);

// Crear botón de resetear ventas
const botonResetear = document.createElement("button");
botonResetear.textContent = "Resetear Ventas";
botonResetear.onclick = resetearVentas;
document.querySelector(".seccion-club").appendChild(botonResetear);

// Mostrar los jugadores en el contenedor info-club
const contenedor = document.getElementById("info-club");
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

// Función para poner en venta a un jugador (redirige a ofertas.html)
function ponerEnVenta(jugador) {
    // Marcar al jugador como en venta
    jugador.enVenta = true;
    
    // Guardar el jugador en transferencia en localStorage para acceder desde ofertas.html
    localStorage.setItem("jugadorEnTransferencia", jugador.nombre);
    
    // Redirigir a la página de ofertas
    window.location.href = "ofertas.html";
}

// Función para resetear todas las ventas
function resetearVentas() {
    // Limpiar la lista de jugadores vendidos en localStorage
    localStorage.removeItem("jugadoresVendidos");
    jugadoresVendidos = [];
    
    // Quitar el estado de "en venta" a todos los jugadores
    jugadores.forEach(jugador => {
        jugador.enVenta = false;
    });
    
    // Recargar la página para mostrar todos los jugadores de nuevo
    location.reload();
    
    console.log("Ventas reseteadas");
}
