// Al cargar la página 
document.addEventListener("DOMContentLoaded", function() { 
    // Obtener el jugador en préstamo desde localStorage
    const jugadorEnPrestamo = localStorage.getItem("jugadorEnPrestamo");
    
    if (!jugadorEnPrestamo) {
        alert("No hay jugador seleccionado para préstamo");
        window.location.href = "club.html";
        return;
    }
    
    // Obtener todos los jugadores
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    
    // Encontrar el jugador en préstamo
    const jugador = jugadores.find(j => j.nombre === jugadorEnPrestamo);
    
    if (!jugador) {
        alert("No se encontró el jugador seleccionado");
        window.location.href = "club.html";
        return;
    }
    
    // Mostrar información del jugador
    mostrarInfoJugador(jugador);
    
    // Verificar que requierenprestados esté definido
    if (typeof requierenprestados === 'undefined') {
        console.error("Error: La variable requierenprestados no está definida");
        
        const listaOfertas = document.getElementById("lista-ofertas");
        listaOfertas.innerHTML = `
            <div class="sin-ofertas">
                <p>Error al cargar los clubes interesados.</p>
                <p>Verifica que el archivo requierenprestados.js se haya cargado correctamente.</p>
            </div>
        `;
        return;
    }
    
    // Añadir sección para establecer duración del préstamo
    agregarSeccionNegociacion(jugador);
    
    // Generar propuestas de préstamo
    generarPropuestasPrestamo(jugador);
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
            <div class="stat-item">Posición: ${jugador.posicion}</div>
        </div>
    `;
}

// Función para agregar la sección de negociación
function agregarSeccionNegociacion(jugador) {
    const seccionNegociacion = document.createElement("div");
    seccionNegociacion.id = "seccion-negociacion";
    seccionNegociacion.className = "seccion-negociacion";
    
    seccionNegociacion.innerHTML = `
        <div class="negociacion-header">
            <h4>Establecer duración del préstamo</h4>
        </div>
        <div class="duracion-input">
            <label for="duracion-prestamo">Duración (meses):</label>
            <input type="number" id="duracion-prestamo" value="6" min="3" max="24" step="1">
            <button id="btn-establecer-duracion" class="btn btn-aceptar">Buscar ofertas</button>
        </div>
        <div id="resultado-negociacion" class="resultado-negociacion" style="display: none;"></div>
    `;
    
    // Insertar antes de la lista de ofertas
    const listaOfertas = document.getElementById("lista-ofertas");
    listaOfertas.parentNode.insertBefore(seccionNegociacion, listaOfertas);
    
    // Añadir evento al botón
    document.getElementById("btn-establecer-duracion").addEventListener("click", function() {
        const duracionDeseada = parseInt(document.getElementById("duracion-prestamo").value);
        negociarPrestamo(jugador, duracionDeseada);
    });
}

// Función para negociar préstamo con clubes
function negociarPrestamo(jugador, duracionDeseada) {
    // Filtrar clubes interesados
    const clubesInteresados = requierenprestados.filter(club => clubInteresadoEnPrestamo(club, jugador));
    
    if (clubesInteresados.length === 0) {
        document.getElementById("resultado-negociacion").innerHTML = `
            <p>No hay clubes interesados en el préstamo de este jugador en este momento.</p>
        `;
        document.getElementById("resultado-negociacion").style.display = "block";
        return;
    }
    
    // Evaluar la respuesta de cada club a la duración propuesta
    const resultadosNegociacion = [];
    
    clubesInteresados.forEach(club => {
        const aceptaDuracion = Math.abs(club.duracionDeseada - duracionDeseada) <= 3; // Tolerancia de 3 meses
        
        let duracionContraoferta = 0;
        if (!aceptaDuracion) {
            // El club puede hacer una contraoferta de duración
            duracionContraoferta = club.duracionDeseada;
        }
        
        resultadosNegociacion.push({
            club: club,
            aceptaDuracion: aceptaDuracion,
            duracionContraoferta: duracionContraoferta
        });
    });
    
    // Mostrar resultados
    mostrarResultadosNegociacionPrestamo(resultadosNegociacion, jugador, duracionDeseada);
}

// Función para mostrar resultados de negociación
function mostrarResultadosNegociacionPrestamo(resultados, jugador, duracionPropuesta) {
    const divResultado = document.getElementById("resultado-negociacion");
    divResultado.style.display = "block";
    divResultado.innerHTML = "";
    
    const titulo = document.createElement("h4");
    titulo.textContent = "Resultados de la negociación";
    divResultado.appendChild(titulo);
    
    // Clubes que aceptan la duración
    const clubesAceptan = resultados.filter(r => r.aceptaDuracion);
    if (clubesAceptan.length > 0) {
        const divAceptan = document.createElement("div");
        divAceptan.className = "clubes-interesados";
        divAceptan.innerHTML = "<h5>Clubes que aceptan tu propuesta:</h5>";
        
        clubesAceptan.forEach(resultado => {
            const divClub = document.createElement("div");
            divClub.className = "club-respuesta";
            divClub.innerHTML = `
                <div>
                    <div class="club-nombre">${resultado.club.nombre} (${resultado.club.pais})</div>
                    <div class="club-duracion">Acepta: ${duracionPropuesta} meses</div>
                </div>
                <button class="btn btn-aceptar" onclick="aceptarPrestamo('${resultado.club.nombre}', ${duracionPropuesta})">Confirmar préstamo</button>
            `;
            divAceptan.appendChild(divClub);
        });
        
        divResultado.appendChild(divAceptan);
    }
    
    // Clubes que proponen otra duración
    const clubesContraoferta = resultados.filter(r => !r.aceptaDuracion && r.duracionContraoferta > 0);
    if (clubesContraoferta.length > 0) {
        const divContraoferta = document.createElement("div");
        divContraoferta.className = "clubes-interesados";
        divContraoferta.innerHTML = "<h5>Clubes que proponen otra duración:</h5>";
        
        clubesContraoferta.forEach(resultado => {
            const divClub = document.createElement("div");
            divClub.className = "club-respuesta";
            divClub.innerHTML = `
                <div>
                    <div class="club-nombre">${resultado.club.nombre} (${resultado.club.pais})</div>
                    <div class="club-duracion">Propone: ${resultado.duracionContraoferta} meses</div>
                </div>
                <div>
                    <button class="btn btn-aceptar" onclick="aceptarPrestamo('${resultado.club.nombre}', ${resultado.duracionContraoferta})">Aceptar</button>
                    <button class="btn btn-rechazar" onclick="rechazarContraofertaPrestamo('${resultado.club.nombre}')">Rechazar</button>
                </div>
            `;
            divContraoferta.appendChild(divClub);
        });
        
        divResultado.appendChild(divContraoferta);
    }
}

// Función para rechazar contraoferta de préstamo
function rechazarContraofertaPrestamo(clubNombre) {
    const clubesInteresados = document.querySelector(".clubes-interesados");
    if (clubesInteresados) {
        const respuestas = clubesInteresados.querySelectorAll(".club-respuesta");
        respuestas.forEach(respuesta => {
            if (respuesta.querySelector(".club-nombre").textContent.includes(clubNombre)) {
                respuesta.remove();
            }
        });
        
        if (clubesInteresados.querySelectorAll(".club-respuesta").length === 0) {
            clubesInteresados.style.display = "none";
        }
    }
}

// Función para determinar si un club está interesado en un préstamo
function clubInteresadoEnPrestamo(club, jugador) {
    // Verificar si el club necesita refuerzos
    if (!club.necesitaRefuerzos) return false;
    
    // Verificar si el jugador cumple con el nivel requerido
    if (jugador.general < club.nivelRequerido) return false;
    
    // Verificar si la posición coincide
    const posicionJugador = jugador.posicion.toLowerCase();
    const posicionNecesitada = club.posicionNecesitada.toLowerCase();
    
    // Mapeo de posiciones similares
    const gruposPosiciones = {
        'defensa': ['defensa central', 'lateral derecho', 'lateral izquierdo', 'defensor'],
        'mediocampo': ['mediocampista', 'mediocentro', 'medio ofensivo', 'medio defensivo'],
        'delantero': ['delantero centro', 'extremo', 'segundo delantero'],
        'arquero': ['portero', 'guardameta']
    };
    
    let posicionCompatible = false;
    
    // Verificar compatibilidad exacta o por grupo
    if (posicionJugador.includes(posicionNecesitada) || posicionNecesitada.includes(posicionJugador)) {
        posicionCompatible = true;
    } else {
        // Verificar por grupos de posiciones
        for (const [grupo, posiciones] of Object.entries(gruposPosiciones)) {
            if (posiciones.some(pos => posicionJugador.includes(pos)) && 
                posiciones.some(pos => posicionNecesitada.includes(pos))) {
                posicionCompatible = true;
                break;
            }
        }
    }
    
    // Factor de aleatoriedad (80% de probabilidad si cumple los requisitos)
    return posicionCompatible && Math.random() < 0.8;
}

// Función para generar propuestas de préstamo
function generarPropuestasPrestamo(jugador) {
    const listaOfertas = document.getElementById("lista-ofertas");
    
    if (!listaOfertas) {
        console.error("Error: No se encontró el elemento con ID 'lista-ofertas'");
        return;
    }
    
    listaOfertas.innerHTML = "";
    
    if (typeof requierenprestados === 'undefined' || !Array.isArray(requierenprestados)) {
        console.error("Error: requierenprestados no está definido o no es un array");
        listaOfertas.innerHTML = `
            <div class="sin-ofertas">
                <p>Error al cargar los clubes interesados.</p>
            </div>
        `;
        return;
    }
    
    // Filtrar clubes interesados
    const clubesInteresados = requierenprestados.filter(club => clubInteresadoEnPrestamo(club, jugador));
    
    console.log("Clubes interesados en préstamo:", clubesInteresados.length);
    
    if (clubesInteresados.length === 0) {
        listaOfertas.innerHTML = `
            <div class="sin-ofertas">
                <p>No hay propuestas de préstamo para este jugador en estos momentos.</p>
                <p>Los clubes buscan jugadores con características específicas.</p>
            </div>
        `;
        return;
    }
    
    // Generar propuesta por cada club interesado
    clubesInteresados.forEach(club => {
        const divOferta = document.createElement("div");
        divOferta.classList.add("oferta-item");
        
        divOferta.innerHTML = `
            <div class="oferta-info">
                <div class="club-info">
                    <div class="club-nombre">${club.nombre}</div>
                    <div class="club-pais">${club.pais}</div>
                </div>
                <div class="posicion-necesitada">${club.posicionNecesitada}</div>
                <div class="duracion-prestamo">${club.duracionDeseada} meses</div>
            </div>
            <div class="botones-oferta">
                <button class="btn btn-aceptar" onclick="aceptarPrestamo('${club.nombre}', ${club.duracionDeseada})">Aceptar</button>
                <button class="btn btn-rechazar" onclick="rechazarPropuestaPrestamo('${club.nombre}')">Rechazar</button>
            </div>
        `;
        
        listaOfertas.appendChild(divOferta);
    });
}

// Función para aceptar un préstamo
function aceptarPrestamo(clubNombre, duracionMeses) {
    const jugadorEnPrestamo = localStorage.getItem("jugadorEnPrestamo");
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const jugador = jugadores.find(j => j.nombre === jugadorEnPrestamo);
    
    if (!jugador) {
        alert("Error: No se encontró el jugador");
        return;
    }
    
    // Confirmar el préstamo
    if (confirm(`¿Seguro que quieres prestar a ${jugador.nombre} al ${clubNombre} por ${duracionMeses} meses?`)) {
        // Registrar el préstamo en el historial
        const historialTransferencias = JSON.parse(localStorage.getItem("historialTransferencias") || "[]");
        
        // Fecha de inicio y fin del préstamo
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + duracionMeses);
        
        historialTransferencias.push({
            jugador: jugador.nombre,
            tipoTransferencia: "Préstamo",
            clubOrigen: jugador.club,
            clubDestino: clubNombre,
            duracion: duracionMeses,
            fechaInicio: fechaInicio.toISOString().split('T')[0],
            fechaFin: fechaFin.toISOString().split('T')[0],
            valor: 0 // Los préstamos no tienen valor de transferencia
        });
        
        localStorage.setItem("historialTransferencias", JSON.stringify(historialTransferencias));
        
        // Marcar jugador como prestado
        jugador.enPrestamo = true;
        jugador.clubPrestamo = clubNombre;
        jugador.fechaFinPrestamo = fechaFin.toISOString().split('T')[0];
        
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        localStorage.removeItem("jugadorEnPrestamo");
        
        alert(`¡Préstamo confirmado! ${jugador.nombre} ha sido prestado al ${clubNombre} por ${duracionMeses} meses.`);
        window.location.href = "club.html";
    }
}

// Función para rechazar una propuesta de préstamo
function rechazarPropuestaPrestamo(clubNombre) {
    if (confirm(`¿Rechazar la propuesta de préstamo del ${clubNombre}?`)) {
        // Eliminar la propuesta del DOM
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
                    <p>No hay más propuestas de préstamo para este jugador.</p>
                </div>
            `;
        }
    }
}
