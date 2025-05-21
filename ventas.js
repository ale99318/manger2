// Al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el jugador en transferencia desde localStorage
    const jugadorEnVenta = localStorage.getItem("jugadorEnTransferencia");
    
    if (!jugadorEnVenta) {
        alert("No hay jugador en venta seleccionado");
        window.location.href = "club.html";
        return;
    }
    
    // Obtener todos los jugadores
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    
    // Encontrar el jugador en venta
    const jugador = jugadores.find(j => j.nombre === jugadorEnVenta);
    
    if (!jugador) {
        alert("No se encontró el jugador seleccionado");
        window.location.href = "club.html";
        return;
    }
    
    // Mostrar información del jugador
    mostrarInfoJugador(jugador);
    
    // Generar ofertas de los clubes
    generarOfertas(jugador);
});

// Función para mostrar información del jugador
function mostrarInfoJugador(jugador) {
    const datosJugador = document.getElementById("datos-jugador");
    
    datosJugador.innerHTML = `
        <div class="jugador-header">
            <h3>${jugador.nombre}</h3>
            <span class="posicion">${jugador.posicion} - ${jugador.edad} años</span>
        </div>
        <div class="jugador-stats">
            <div class="stat-item">General: ${jugador.general}</div>
            <div class="stat-item">Valor: $${(jugador.valor/1000000).toFixed(1)}M</div>
            <div class="stat-item">Club actual: ${jugador.club}</div>
        </div>
    `;
}

// Función para determinar si un club está interesado en un jugador
function clubEstaInteresado(club, jugador) {
    // Un club estará interesado según:
    // - El valor del jugador está dentro de su presupuesto
    // - Para jugadores caros, la reputación del club debe ser suficiente
    // - Algo de aleatoriedad para hacer el sistema más realista
    
    const maxOferta = club.presupuesto * 0.8; // El club no gastará todo su presupuesto
    
    // Si el jugador vale más del 70% del presupuesto, el club debe tener buena reputación
    if (jugador.valor > club.presupuesto * 0.7) {
        // Solo clubes con reputación alta se interesan por jugadores caros
        if (club.reputacion < 75) {
            return false;
        }
    }
    
    // Factor de aleatoriedad (aproximadamente 70% de probabilidad de estar interesado si cumple lo anterior)
    return jugador.valor <= maxOferta && Math.random() < 0.7;
}

// Función para calcular el valor de oferta
function calcularValorOferta(club, jugador) {
    // Base: Valor del jugador
    let ofertaBase = jugador.valor;
    
    // Ajustar según la reputación del club (clubes con mejor reputación pagan un poco más)
    const factorReputacion = 0.5 + (club.reputacion / 100);
    
    // Ajustar según el presupuesto (clubes con menos presupuesto intentan pagar menos)
    const factorPresupuesto = (club.presupuesto < jugador.valor * 2) ? 0.9 : 1;
    
    // Algo de aleatoriedad (entre el 85% y 110% del valor)
    const factorAleatorio = 0.85 + (Math.random() * 0.25);
    
    // Calcular valor final
    const valorFinal = ofertaBase * factorReputacion * factorPresupuesto * factorAleatorio;
    
    // Redondear a un valor que parezca "real"
    return Math.round(valorFinal / 10000) * 10000;
}

// Función para generar las ofertas de los clubes
function generarOfertas(jugador) {
    const listaOfertas = document.getElementById("lista-ofertas");
    listaOfertas.innerHTML = "";
    
    // Seleccionar los clubes interesados
    const clubesInteresados = clubesCompradores.filter(club => clubEstaInteresado(club, jugador));
    
    // Si no hay clubes interesados
    if (clubesInteresados.length === 0) {
        listaOfertas.innerHTML = `
            <div class="sin-ofertas">
                <p>No hay ofertas por este jugador en estos momentos.</p>
                <p>Intenta más tarde o reduce el precio.</p>
            </div>
        `;
        return;
    }
    
    // Generar oferta por cada club interesado
    clubesInteresados.forEach(club => {
        const valorOferta = calcularValorOferta(club, jugador);
        
        const divOferta = document.createElement("div");
        divOferta.classList.add("oferta-item");
        
        divOferta.innerHTML = `
            <div class="oferta-info">
                <div class="club-nombre">${club.nombre}</div>
                <div class="club-pais">${club.pais}</div>
                <div class="oferta-valor">Oferta: $${(valorOferta/1000000).toFixed(1)}M</div>
            </div>
            <div class="botones-oferta">
                <button class="btn btn-aceptar" onclick="aceptarOferta('${club.nombre}', ${valorOferta})">Aceptar</button>
                <button class="btn btn-rechazar" onclick="rechazarOferta('${club.nombre}')">Rechazar</button>
            </div>
        `;
        
        listaOfertas.appendChild(divOferta);
    });
}

// Función para aceptar una oferta
function aceptarOferta(clubNombre, valorOferta) {
    const jugadorEnVenta = localStorage.getItem("jugadorEnTransferencia");
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const jugador = jugadores.find(j => j.nombre === jugadorEnVenta);
    
    if (!jugador) {
        alert("Error: No se encontró el jugador");
        return;
    }
    
    // Confirmar la venta
    if (confirm(`¿Seguro que quieres vender a ${jugador.nombre} al ${clubNombre} por $${(valorOferta/1000000).toFixed(1)}M?`)) {
        // Marcar jugador como vendido
        const jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
        jugadoresVendidos.push(jugador.nombre);
        localStorage.setItem("jugadoresVendidos", JSON.stringify(jugadoresVendidos));
        
        // Registrar la transferencia en el historial
        const historialTransferencias = JSON.parse(localStorage.getItem("historialTransferencias") || "[]");
        historialTransferencias.push({
            jugador: jugador.nombre,
            tipoTransferencia: "Venta",
            clubOrigen: jugador.club,
            clubDestino: clubNombre,
            valor: valorOferta,
            fecha: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem("historialTransferencias", JSON.stringify(historialTransferencias));
        
        // Quitar jugador de venta
        jugador.enVenta = false;
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        localStorage.removeItem("jugadorEnTransferencia");
        
        alert(`¡Transferencia completada! ${jugador.nombre} ha sido vendido al ${clubNombre} por $${(valorOferta/1000000).toFixed(1)}M.`);
        window.location.href = "club.html";
    }
}

// Función para rechazar una oferta
function rechazarOferta(clubNombre) {
    if (confirm(`¿Rechazar la oferta de ${clubNombre}?`)) {
        // Simplemente eliminar la oferta del DOM
        const ofertas = document.querySelectorAll(".oferta-item");
        ofertas.forEach(oferta => {
            if (oferta.querySelector(".club-nombre").textContent === clubNombre) {
                oferta.remove();
            }
        });
        
        // Si no quedan ofertas, mostrar mensaje
        if (document.querySelectorAll(".oferta-item").length === 0) {
            document.getElementById("lista-ofertas").innerHTML = `
                <div class="sin-ofertas">
                    <p>No hay más ofertas por este jugador.</p>
                </div>
            `;
        }
    }
}
