// Al cargar la página
document.addEventListener("DOMContentLoaded", function() { 
    // Primero debemos asegurarnos de que los jugadores del archivo  .txt
    // estén guardados en localStorage (esto es lo que faltaba en tu código)
    if (!localStorage.getItem("jugadores") && typeof window.jugadores !== 'undefined') {
        localStorage.setItem("jugadores", JSON.stringify(window.jugadores));
        console.log("Jugadores inicializados en localStorage");
    }

    // Obtener el nombre del club guardado en localStorage
    const selectedClub = localStorage.getItem("selectedClub");
    
    // Validar si hay club seleccionado
    if (!selectedClub) {
        alert("No hay club seleccionado.");
        // Opcional: redirigir o detener ejecución
        return;
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
    
    // Agregar jugadores disponibles
    jugadoresDelClub.forEach(jugador => {
        const div = document.createElement("div");
        div.classList.add("jugador-item");
        
        // Información del jugador
        const infoJugador = document.createElement("div");
        infoJugador.classList.add("info-jugador");
        infoJugador.innerHTML = `
            <strong>${jugador.nombre}</strong> - ${jugador.posicion} (${jugador.edad} años)
            <div class="stats">
                <span>General: ${jugador.general}</span>
                <span>Valor: $${(jugador.valor/1000000).toFixed(1)}M</span>
            </div>
        `;
        div.appendChild(infoJugador);
        
        // Botón de venta
        const botonVender = document.createElement("button");
        botonVender.textContent = "Poner en venta";
        botonVender.classList.add("btn-vender");
        botonVender.onclick = () => ponerEnVenta(jugador);
        div.appendChild(botonVender);
        
        // Botón de préstamo
        const botonPrestar = document.createElement("button");
        botonPrestar.textContent = "Prestar jugador";
        botonPrestar.classList.add("btn-prestar");
        botonPrestar.onclick = () => prestarJugador(jugador);
        div.appendChild(botonPrestar);
        
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
            div.classList.add("jugador-cedido");
            div.textContent = `${cedido.nombre} (Cedido al ${cedido.club} hasta ${cedido.finPrestamo})`;
            contenedor.appendChild(div);
        });
    }
});

// Función para poner en venta a un jugador
function ponerEnVenta(jugador) {
    // Obtener lista completa de jugadores
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    
    // Encontrar y marcar el jugador en venta
    const jugadorIndex = jugadores.findIndex(j => j.id === jugador.id);
    if (jugadorIndex !== -1) {
        jugadores[jugadorIndex].enVenta = true;
        
        // Guardar jugador seleccionado y lista de jugadores
        localStorage.setItem("jugadorEnTransferencia", jugador.nombre);
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        
        // Redirigir a ofertas.html
        window.location.href = "ventas.html";
    }
}

// Función para prestar un jugador
function prestarJugador(jugador) {
    // Guardar jugador seleccionado para préstamo
    localStorage.setItem("jugadorEnPrestamo", jugador.nombre);
    
    // Redirigir a página de préstamos
    window.location.href = "prestamos.html";
}

// Función para resetear transferencias
function resetearTransferencias() {
    if (confirm("¿Estás seguro de que deseas resetear todas las transferencias?")) {
        localStorage.removeItem("jugadoresVendidos");
        localStorage.removeItem("jugadoresCedidos");
        localStorage.removeItem("historialTransferencias");
        
        // Obtener y actualizar jugadores
        const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        jugadores.forEach(jugador => {
            jugador.enVenta = false;
        });
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        
        alert("Transferencias reseteadas correctamente");
        location.reload();
    }
}
