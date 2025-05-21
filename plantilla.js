// Obtener el nombre del club guardado en localStorage
const selectedClub = localStorage.getItem("selectedClub");

// Validar si hay club seleccionado
if (!selectedClub) {
    alert("No hay club seleccionado.");
    // Opcional: redirigir o detener ejecución
}

// Mostrar el nombre del club
document.getElementById("nombre-club").textContent = selectedClub;

// Obtener la lista de jugadores
const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");

// Obtener jugadores vendidos y cedidos
let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
let jugadoresCedidos = JSON.parse(localStorage.getItem("jugadoresCedidos") || "[]");

// Filtrar jugadores del club que no están vendidos ni cedidos
const jugadoresDelClub = jugadores.filter(jugador => 
    jugador.club === selectedClub && 
    !jugadoresVendidos.includes(jugador.nombre) &&
    !jugadoresCedidos.some(cedido => cedido.nombre === jugador.nombre)
);

// Crear botón de resetear ventas
const botonResetear = document.createElement("button");
botonResetear.textContent = "Resetear Transferencias";
botonResetear.classList.add("btn-reset");
botonResetear.onclick = resetearTransferencias;
document.querySelector(".seccion-club").appendChild(botonResetear);

// Contenedor para mostrar info del club
const contenedor = document.getElementById("info-club");
contenedor.innerHTML = "";

// Título jugadores disponibles
const tituloDisponibles = document.createElement("h2");
tituloDisponibles.textContent = "Jugadores Disponibles";
contenedor.appendChild(tituloDisponibles);

// Función para poner en venta a un jugador
function ponerEnVenta(jugador) {
    jugador.enVenta = true;

    // Guardar jugador seleccionado y lista de jugadores
    localStorage.setItem("jugadorEnTransferencia", jugador.nombre);
    localStorage.setItem("jugadores", JSON.stringify(jugadores));

    // Redirigir a ofertas.html
    window.location.href = "ofertas.html";
}

// Agregar jugadores disponibles
jugadoresDelClub.forEach(jugador => {
    const div = document.createElement("div");
    div.textContent = jugador.nombre;

    const botonVender = document.createElement("button");
    botonVender.textContent = "Poner en venta";
    botonVender.onclick = () => ponerEnVenta(jugador);

    div.appendChild(botonVender);
    contenedor.appendChild(div);
});

// Mostrar jugadores cedidos si hay
const jugadoresCedidosDelClub = jugadoresCedidos.filter(cedido => {
    const jugadorCompleto = jugadores.find(j => j.nombre === cedido.nombre);
    return jugadorCompleto && jugadorCompleto.club === selectedClub;
});

if (jugadoresCedidosDelClub.length > 0) {
    const tituloCedidos = document.createElement("h2");
    tituloCedidos.textContent = "Jugadores Cedidos";
    tituloCedidos.style.marginTop = "20px";
    contenedor.appendChild(tituloCedidos);

    jugadoresCedidosDelClub.forEach(cedido => {
        const div = document.createElement("div");
        div.textContent = `${cedido.nombre} (Cedido al ${cedido.club} hasta ${cedido.finPrestamo})`;
        contenedor.appendChild(div);
    });
}

// Función para resetear transferencias
function resetearTransferencias() {
    localStorage.removeItem("jugadoresVendidos");
    localStorage.removeItem("jugadoresCedidos");
    localStorage.removeItem("historialTransferencias");

    jugadores.forEach(jugador => {
        jugador.enVenta = false;
    });

    localStorage.setItem("jugadores", JSON.stringify(jugadores));

    location.reload();
    console.log("Transferencias reseteadas");
}
