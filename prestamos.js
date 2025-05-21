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
    
    // Calcular sueldo mensual aproximado basado en el valor del jugador
    const sueldoMensual = Math.floor((jugador.valor * 0.05) / 12);
    
    datosJugador.innerHTML = `
        <div class="jugador-header">
            <h3>${jugador.nombre}</h3>
            <span class="posicion">${jugador.posicion} - ${jugador.edad} años</span>
        </div>
        <div class="jugador-stats">
            <div class="stat-item">General: ${jugador.general}</div>
            <div class="stat-item">Valor: $${(jugador.valor/1000000).toFixed(1)}M</div>
            <div class="stat-item">Sueldo mensual: $${(sueldoMensual/1000).toFixed(0)}K</div>
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
            <h4>Configurar términos del préstamo</h4>
        </div>
        <div class="configuracion-prestamo">
            <div class="config-item">
                <label for="duracion-prestamo">Duración (meses):</label>
                <input type="number" id="duracion-prestamo" value="6" min="3" max="24" step="1">
            </div>
            <div class="config-item">
                <label for="porcentaje-sueldo">Porcentaje del sueldo que pagaremos (%):</label>
                <input type="number" id="porcentaje-sueldo" value="50" min="0" max="100" step="10">
                <small>El club destino pagará el resto</small>
            </div>
            <div class="config-item">
                <label for="opcion-compra">¿Incluir opción de compra?</label>
                <select id="opcion-compra">
                    <option value="no">Solo préstamo</option>
                    <option value="obligatoria">Opción de compra obligatoria</option>
                    <option value="opcional">Opción de compra opcional</option>
                </select>
            </div>
            <div class="config-item" id="valor-compra-container" style="display: none;">
                <label for="valor-compra">Valor de la opción de compra:</label>
                <input type="number" id="valor-compra" min="1000000" step="100000" placeholder="Valor en dólares">
            </div>
            <button id="btn-establecer-duracion" class="btn btn-aceptar">Buscar ofertas</button>
        </div>
        <div id="resultado-negociacion" class="resultado-negociacion" style="display: none;"></div>
    `;
    
    // Insertar antes de la lista de ofertas
    const listaOfertas = document.getElementById("lista-ofertas");
    listaOfertas.parentNode.insertBefore(seccionNegociacion, listaOfertas);
    
    // Mostrar/ocultar campo de valor de compra según la opción seleccionada
    document.getElementById("opcion-compra").addEventListener("change", function() {
        const valorCompraContainer = document.getElementById("valor-compra-container");
        const valorCompraInput = document.getElementById("valor-compra");
        
        if (this.value !== "no") {
            valorCompraContainer.style.display = "block";
            // Sugerir un valor inicial basado en el valor actual del jugador
            const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
            const jugador = jugadores.find(j => j.nombre === localStorage.getItem("jugadorEnPrestamo"));
            if (jugador) {
                valorCompraInput.value = Math.floor(jugador.valor * 0.8); // 80% del valor actual
            }
        } else {
            valorCompraContainer.style.display = "none";
            valorCompraInput.value = "";
        }
    });
    
    // Añadir evento al botón
    document.getElementById("btn-establecer-duracion").addEventListener("click", function() {
        const duracionDeseada = parseInt(document.getElementById("duracion-prestamo").value);
        const porcentajeSueldo = parseInt(document.getElementById("porcentaje-sueldo").value);
        const opcionCompra = document.getElementById("opcion-compra").value;
        const valorCompra = document.getElementById("valor-compra").value ? parseInt(document.getElementById("valor-compra").value) : 0;
        
        const terminos = {
            duracion: duracionDeseada,
            porcentajeSueldo: porcentajeSueldo,
            opcionCompra: opcionCompra,
            valorCompra: valorCompra
        };
        
        negociarPrestamo(jugador, terminos);
    });
}

// Función para negociar préstamo con clubes
function negociarPrestamo(jugador, terminosDeseados) {
    // Filtrar clubes interesados
    const clubesInteresados = requierenprestados.filter(club => clubInteresadoEnPrestamo(club, jugador));
    
    if (clubesInteresados.length === 0) {
        document.getElementById("resultado-negociacion").innerHTML = `
            <p>No hay clubes interesados en el préstamo de este jugador en este momento.</p>
        `;
        document.getElementById("resultado-negociacion").style.display = "block";
        return;
    }
    
    // Evaluar la respuesta de cada club a los términos propuestos
    const resultadosNegociacion = [];
    
    clubesInteresados.forEach(club => {
        const respuestaClub = evaluarTerminosClub(club, jugador, terminosDeseados);
        resultadosNegociacion.push({
            club: club,
            respuesta: respuestaClub
        });
    });
    
    // Mostrar resultados
    mostrarResultadosNegociacionPrestamo(resultadosNegociacion, jugador, terminosDeseados);
}

// Función para evaluar los términos desde la perspectiva del club
function evaluarTerminosClub(club, jugador, terminos) {
    const respuesta = {
        aceptaTerminos: false,
        contraoferta: {
            duracion: club.duracionDeseada,
            porcentajeSueldo: 0,
            opcionCompra: "no",
            valorCompra: 0
        }
    };
    
    // Evaluar duración
    const diferenciaDuracion = Math.abs(club.duracionDeseada - terminos.duracion);
    const aceptaDuracion = diferenciaDuracion <= 3; // Tolerancia de 3 meses
    
    // Evaluar porcentaje de sueldo (clubs prefieren pagar menos)
    let porcentajeAceptable = false;
    let porcentajeContraoferta = 0;
    
    // Clubs de mayor nivel pueden aceptar pagar más sueldo
    const nivelClub = club.nivelRequerido;
    let maxPorcentajeClub = 0;
    
    if (nivelClub >= 85) {
        maxPorcentajeClub = 80; // Clubs top pueden pagar hasta 80%
    } else if (nivelClub >= 75) {
        maxPorcentajeClub = 60; // Clubs medios pueden pagar hasta 60%
    } else {
        maxPorcentajeClub = 40; // Clubs menores pueden pagar hasta 40%
    }
    
    const porcentajeClubPagaria = 100 - terminos.porcentajeSueldo;
    
    if (porcentajeClubPagaria <= maxPorcentajeClub) {
        porcentajeAceptable = true;
    } else {
        // Contraoferta: el club propone pagar su máximo
        porcentajeContraoferta = 100 - maxPorcentajeClub;
    }
    
    // Evaluar opción de compra
    let aceptaOpcionCompra = false;
    let valorCompraContraoferta = 0;
    
    if (terminos.opcionCompra === "no") {
        aceptaOpcionCompra = true; // Siempre aceptan préstamos simples
    } else {
        // Probabilidad de aceptar opción de compra basada en el nivel del club y valor del jugador
        const factorInteres = Math.random();
        const valorJugadorM = jugador.valor / 1000000;
        
        if (factorInteres > 0.3) { // 70% de probabilidad base
            if (terminos.valorCompra <= jugador.valor * 0.9) {
                aceptaOpcionCompra = true;
            } else {
                // Contraoferta con un valor menor
                valorCompraContraoferta = Math.floor(jugador.valor * (0.7 + Math.random() * 0.2));
            }
        }
    }
    
    // Determinar si acepta todos los términos
    if (aceptaDuracion && porcentajeAceptable && aceptaOpcionCompra) {
        respuesta.aceptaTerminos = true;
    } else {
        // Generar contraoferta
        respuesta.contraoferta = {
            duracion: aceptaDuracion ? terminos.duracion : club.duracionDeseada,
            porcentajeSueldo: porcentajeAceptable ? terminos.porcentajeSueldo : porcentajeContraoferta,
            opcionCompra: aceptaOpcionCompra ? terminos.opcionCompra : (valorCompraContraoferta > 0 ? terminos.opcionCompra : "no"),
            valorCompra: aceptaOpcionCompra ? terminos.valorCompra : valorCompraContraoferta
        };
    }
    
    return respuesta;
}

// Función para mostrar resultados de negociación
function mostrarResultadosNegociacionPrestamo(resultados, jugador, terminosOriginales) {
    const divResultado = document.getElementById("resultado-negociacion");
    divResultado.style.display = "block";
    divResultado.innerHTML = "";
    
    const titulo = document.createElement("h4");
    titulo.textContent = "Resultados de la negociación";
    divResultado.appendChild(titulo);
    
    // Clubes que aceptan todos los términos
    const clubesAceptan = resultados.filter(r => r.respuesta.aceptaTerminos);
    if (clubesAceptan.length > 0) {
        const divAceptan = document.createElement("div");
        divAceptan.className = "clubes-interesados";
        divAceptan.innerHTML = "<h5>Clubes que aceptan tu propuesta:</h5>";
        
        clubesAceptan.forEach(resultado => {
            const divClub = document.createElement("div");
            divClub.className = "club-respuesta";
            
            const terminosTexto = generarTextoTerminos(terminosOriginales);
            
            divClub.innerHTML = `
                <div>
                    <div class="club-nombre">${resultado.club.nombre} (${resultado.club.pais})</div>
                    <div class="terminos-aceptados">${terminosTexto}</div>
                </div>
                <button class="btn btn-aceptar" onclick="aceptarPrestamoConTerminos('${resultado.club.nombre}', '${JSON.stringify(terminosOriginales).replace(/'/g, "\\'")}')">Confirmar préstamo</button>
            `;
            divAceptan.appendChild(divClub);
        });
        
        divResultado.appendChild(divAceptan);
    }
    
    // Clubes que hacen contraofertas
    const clubesContraoferta = resultados.filter(r => !r.respuesta.aceptaTerminos);
    if (clubesContraoferta.length > 0) {
        const divContraoferta = document.createElement("div");
        divContraoferta.className = "clubes-interesados";
        divContraoferta.innerHTML = "<h5>Clubes que proponen términos diferentes:</h5>";
        
        clubesContraoferta.forEach(resultado => {
            const divClub = document.createElement("div");
            divClub.className = "club-respuesta";
            
            const contraofertaTexto = generarTextoTerminos(resultado.respuesta.contraoferta);
            
            divClub.innerHTML = `
                <div>
                    <div class="club-nombre">${resultado.club.nombre} (${resultado.club.pais})</div>
                    <div class="contraoferta">Propone: ${contraofertaTexto}</div>
                </div>
                <div>
                    <button class="btn btn-aceptar" onclick="aceptarPrestamoConTerminos('${resultado.club.nombre}', '${JSON.stringify(resultado.respuesta.contraoferta).replace(/'/g, "\\'")}')">Aceptar</button>
                    <button class="btn btn-rechazar" onclick="rechazarContraofertaPrestamo('${resultado.club.nombre}')">Rechazar</button>
                </div>
            `;
            divContraoferta.appendChild(divClub);
        });
        
        divResultado.appendChild(divContraoferta);
    }
}

// Función para generar texto descriptivo de los términos
function generarTextoTerminos(terminos) {
    let texto = `${terminos.duracion} meses`;
    
    if (terminos.porcentajeSueldo > 0) {
        texto += ` - Pagaremos ${terminos.porcentajeSueldo}% del sueldo`;
    } else {
        texto += ` - Ellos pagan todo el sueldo`;
    }
    
    if (terminos.opcionCompra === "obligatoria") {
        texto += ` - Compra obligatoria por $${(terminos.valorCompra/1000000).toFixed(1)}M`;
    } else if (terminos.opcionCompra === "opcional") {
        texto += ` - Opción de compra por $${(terminos.valorCompra/1000000).toFixed(1)}M`;
    } else {
        texto += ` - Solo préstamo`;
    }
    
    return texto;
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
        
        // Generar términos iniciales del club
        const terminosClub = generarTerminosIniciales(club, jugador);
        const terminosTexto = generarTextoTerminos(terminosClub);
        
        divOferta.innerHTML = `
            <div class="oferta-info">
                <div class="club-info">
                    <div class="club-nombre">${club.nombre}</div>
                    <div class="club-pais">${club.pais}</div>
                </div>
                <div class="posicion-necesitada">${club.posicionNecesitada}</div>
                <div class="terminos-iniciales">${terminosTexto}</div>
            </div>
            <div class="botones-oferta">
                <button class="btn btn-aceptar" onclick="aceptarPrestamoConTerminos('${club.nombre}', '${JSON.stringify(terminosClub).replace(/'/g, "\\'")}')">Aceptar</button>
                <button class="btn btn-rechazar" onclick="rechazarPropuestaPrestamo('${club.nombre}')">Rechazar</button>
            </div>
        `;
        
        listaOfertas.appendChild(divOferta);
    });
}

// Función para generar términos iniciales que propone cada club
function generarTerminosIniciales(club, jugador) {
    const nivelClub = club.nivelRequerido;
    
    // Determinar cuánto está dispuesto a pagar el club del sueldo
    let maxPorcentajeClub = 0;
    if (nivelClub >= 85) {
        maxPorcentajeClub = 60 + Math.floor(Math.random() * 20); // 60-80%
    } else if (nivelClub >= 75) {
        maxPorcentajeClub = 40 + Math.floor(Math.random() * 20); // 40-60%
    } else {
        maxPorcentajeClub = 20 + Math.floor(Math.random() * 20); // 20-40%
    }
    
    // El porcentaje que nosotros pagaríamos
    const porcentajePagamos = 100 - maxPorcentajeClub;
    
    // Determinar si incluyen opción de compra
    let opcionCompra = "no";
    let valorCompra = 0;
    
    const probabilidadCompra = Math.random();
    if (probabilidadCompra > 0.6) { // 40% de probabilidad
        if (probabilidadCompra > 0.8) {
            opcionCompra = "obligatoria";
        } else {
            opcionCompra = "opcional";
        }
        // Valor entre 70% y 90% del valor actual
        valorCompra = Math.floor(jugador.valor * (0.7 + Math.random() * 0.2));
    }
    
    return {
        duracion: club.duracionDeseada,
        porcentajeSueldo: porcentajePagamos,
        opcionCompra: opcionCompra,
        valorCompra: valorCompra
    };
}

// Función mejorada para aceptar un préstamo con términos específicos
function aceptarPrestamoConTerminos(clubNombre, terminosJson) {
    const jugadorEnPrestamo = localStorage.getItem("jugadorEnPrestamo");
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const jugador = jugadores.find(j => j.nombre === jugadorEnPrestamo);
    
    if (!jugador) {
        alert("Error: No se encontró el jugador");
        return;
    }
    
    // Parsear los términos
    const terminos = JSON.parse(terminosJson);
    
    // Crear texto descriptivo de los términos
    const terminosTexto = generarTextoTerminos(terminos);
    
    // Confirmar el préstamo
    if (confirm(`¿Seguro que quieres prestar a ${jugador.nombre} al ${clubNombre}?\n\nTérminos: ${terminosTexto}`)) {
        // Registrar el préstamo en el historial
        const historialTransferencias = JSON.parse(localStorage.getItem("historialTransferencias") || "[]");
        
        // Fecha de inicio y fin del préstamo
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + terminos.duracion);
        
        historialTransferencias.push({
            jugador: jugador.nombre,
            tipoTransferencia: "Préstamo",
            clubOrigen: jugador.club,
            clubDestino: clubNombre,
            duracion: terminos.duracion,
            porcentajeSueldo: terminos.porcentajeSueldo,
            opcionCompra: terminos.opcionCompra,
            valorCompra: terminos.valorCompra,
            fechaInicio: fechaInicio.toISOString().split('T')[0],
            fechaFin: fechaFin.toISOString().split('T')[0],
            valor: 0 // Los préstamos no tienen valor de transferencia inicial
        });
        
        localStorage.setItem("historialTransferencias", JSON.stringify(historialTransferencias));
        
        // Marcar jugador como prestado con todos los términos
        jugador.enPrestamo = true;
        jugador.clubPrestamo = clubNombre;
        jugador.fechaFinPrestamo = fechaFin.toISOString().split('T')[0];
        jugador.terminosPrestamo = terminos;
        
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        localStorage.removeItem("jugadorEnPrestamo");
        
        alert(`¡Préstamo confirmado! ${jugador.nombre} ha sido prestado al ${clubNombre}.\n\nTérminos: ${terminosTexto}`);
        window.location.href = "club.html";
    }
}

// Función para aceptar un préstamo (mantener compatibilidad con llamadas anteriores)
function aceptarPrestamo(clubNombre, duracionMeses) {
    const terminos = {
        duracion: duracionMeses,
        porcentajeSueldo: 50,
        opcionCompra: "no",
        valorCompra: 0
    };
    
    aceptarPrestamoConTerminos(clubNombre, JSON.stringify(terminos));
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
