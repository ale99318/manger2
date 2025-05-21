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
    // Asegúrate de que clubesCompradores esté definido y disponible aquí
    if (typeof clubesCompradores === 'undefined') {
        console.error("Error: La variable clubesCompradores no está definida");
        
        // Mostrar el mensaje de error directamente en la interfaz
        const listaOfertas = document.getElementById("lista-ofertas");
        listaOfertas.innerHTML = `
            <div class="sin-ofertas">
                <p>Error al cargar los clubes interesados.</p>
                <p>Verifica que el archivo con los clubes se haya cargado correctamente.</p>
            </div>
        `;
        return;
    }
    
    // Añadir sección para establecer precio
    agregarSeccionPrecio(jugador);
    
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

// Nueva función para agregar la sección de precio
function agregarSeccionPrecio(jugador) {
    // Crear el elemento para la sección de precio
    const seccionPrecio = document.createElement("div");
    seccionPrecio.id = "seccion-precio";
    seccionPrecio.className = "seccion-precio";
    
    // Valor sugerido (valor del jugador)
    const valorSugerido = jugador.valor;
    
    // Contenido HTML para la sección de precio
    seccionPrecio.innerHTML = `
        <div class="precio-header">
            <h4>Establecer precio de venta</h4>
        </div>
        <div class="precio-input">
            <label for="precio-venta">Precio (en millones): $</label>
            <input type="number" id="precio-venta" value="${(valorSugerido/1000000).toFixed(1)}" step="0.1" min="0.1">
            <button id="btn-establecer-precio" class="btn">Establecer precio</button>
        </div>
        <div id="resultado-negociacion" class="resultado-negociacion" style="display: none;"></div>
    `;
    
    // Insertar la sección de precio antes de la lista de ofertas
    const listaOfertas = document.getElementById("lista-ofertas");
    listaOfertas.parentNode.insertBefore(seccionPrecio, listaOfertas);
    
    // Añadir evento al botón de establecer precio
    document.getElementById("btn-establecer-precio").addEventListener("click", function() {
        const precioVenta = parseFloat(document.getElementById("precio-venta").value) * 1000000;
        negociarConClubes(jugador, precioVenta);
    });
}

// Función para negociar con los clubes
function negociarConClubes(jugador, precioVenta) {
    // Obtener los clubes interesados
    const clubesInteresados = clubesCompradores.filter(club => clubEstaInteresado(club, jugador));
    
    // Verificar si hay clubes interesados
    if (clubesInteresados.length === 0) {
        document.getElementById("resultado-negociacion").innerHTML = `
            <p>No hay clubes interesados en el jugador en este momento.</p>
        `;
        document.getElementById("resultado-negociacion").style.display = "block";
        return;
    }
    
    // Evaluar para cada club si aceptaría el precio propuesto
    const resultadosNegociacion = [];
    
    clubesInteresados.forEach(club => {
        const ofertaOriginal = calcularValorOferta(club, jugador);
        const maxOfertaClub = ofertaOriginal * 1.2; // El club podría pagar hasta un 20% más
        
        // El club aceptará si el precio está dentro de lo que puede pagar
        const aceptaria = precioVenta <= maxOfertaClub;
        
        // El club podría hacer una contraoferta
        let contraoferta = 0;
        if (!aceptaria && precioVenta <= maxOfertaClub * 1.3) {
            // Contraoferta entre su máximo y su oferta original
            contraoferta = Math.round(
                (ofertaOriginal + (maxOfertaClub - ofertaOriginal) * Math.random()) / 100000
            ) * 100000;
        }
        
        resultadosNegociacion.push({
            club: club,
            aceptaria: aceptaria,
            contraoferta: contraoferta,
            ofertaOriginal: ofertaOriginal
        });
    });
    
    // Mostrar resultados
    mostrarResultadosNegociacion(resultadosNegociacion, jugador, precioVenta);
}

// Función para mostrar los resultados de la negociación
function mostrarResultadosNegociacion(resultados, jugador, precioVenta) {
    const divResultado = document.getElementById("resultado-negociacion");
    divResultado.style.display = "block";
    
    // Limpiar resultados anteriores
    divResultado.innerHTML = "";
    
    // Título
    const titulo = document.createElement("h4");
    titulo.textContent = "Resultados de la negociación";
    divResultado.appendChild(titulo);
    
    // Mostrar clubes que aceptan directamente
    const clubesAceptan = resultados.filter(r => r.aceptaria);
    if (clubesAceptan.length > 0) {
        const divAceptan = document.createElement("div");
        divAceptan.className = "clubes-aceptan";
        divAceptan.innerHTML = "<h5>Clubes que aceptan tu precio:</h5>";
        
        clubesAceptan.forEach(resultado => {
            const divClub = document.createElement("div");
            divClub.className = "club-respuesta";
            divClub.innerHTML = `
                <div class="club-nombre">${resultado.club.nombre}</div>
                <div class="club-oferta">Acepta: $${(precioVenta/1000000).toFixed(1)}M</div>
                <button class="btn btn-aceptar" onclick="aceptarOferta('${resultado.club.nombre}', ${precioVenta})">Cerrar trato</button>
            `;
            divAceptan.appendChild(divClub);
        });
        
        divResultado.appendChild(divAceptan);
    }
    
    // Mostrar clubes que hacen contraoferta
    const clubesContraoferta = resultados.filter(r => !r.aceptaria && r.contraoferta > 0);
    if (clubesContraoferta.length > 0) {
        const divContraoferta = document.createElement("div");
        divContraoferta.className = "clubes-contraoferta";
        divContraoferta.innerHTML = "<h5>Clubes que hacen contraoferta:</h5>";
        
        clubesContraoferta.forEach(resultado => {
            const divClub = document.createElement("div");
            divClub.className = "club-respuesta";
            divClub.innerHTML = `
                <div class="club-nombre">${resultado.club.nombre}</div>
                <div class="club-oferta">Contraoferta: $${(resultado.contraoferta/1000000).toFixed(1)}M</div>
                <button class="btn btn-aceptar" onclick="aceptarOferta('${resultado.club.nombre}', ${resultado.contraoferta})">Aceptar</button>
                <button class="btn btn-rechazar" onclick="rechazarContraoferta('${resultado.club.nombre}')">Rechazar</button>
            `;
            divContraoferta.appendChild(divClub);
        });
        
        divResultado.appendChild(divContraoferta);
    }
    
    // Mostrar clubes que rechazan
    const clubesRechazan = resultados.filter(r => !r.aceptaria && r.contraoferta === 0);
    if (clubesRechazan.length > 0) {
        const divRechazan = document.createElement("div");
        divRechazan.className = "clubes-rechazan";
        divRechazan.innerHTML = "<h5>Clubes que rechazan tu precio:</h5>";
        
        clubesRechazan.forEach(resultado => {
            const divClub = document.createElement("div");
            divClub.className = "club-respuesta";
            divClub.innerHTML = `
                <div class="club-nombre">${resultado.club.nombre}</div>
                <div class="club-oferta">Oferta original: $${(resultado.ofertaOriginal/1000000).toFixed(1)}M</div>
                <button class="btn btn-aceptar" onclick="aceptarOferta('${resultado.club.nombre}', ${resultado.ofertaOriginal})">Aceptar oferta original</button>
            `;
            divRechazan.appendChild(divClub);
        });
        
        divResultado.appendChild(divRechazan);
    }
}

// Función para rechazar una contraoferta
function rechazarContraoferta(clubNombre) {
    // Simplemente eliminar la respuesta del club
    const clubesContraoferta = document.querySelector(".clubes-contraoferta");
    if (clubesContraoferta) {
        const respuestas = clubesContraoferta.querySelectorAll(".club-respuesta");
        respuestas.forEach(respuesta => {
            if (respuesta.querySelector(".club-nombre").textContent === clubNombre) {
                respuesta.remove();
            }
        });
        
        // Si no quedan respuestas, ocultar la sección
        if (clubesContraoferta.querySelectorAll(".club-respuesta").length === 0) {
            clubesContraoferta.style.display = "none";
        }
    }
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
    
    // Asegurarse de que el elemento existe
    if (!listaOfertas) {
        console.error("Error: No se encontró el elemento con ID 'lista-ofertas'");
        return;
    }
    
    // Limpiar cualquier contenido previo
    listaOfertas.innerHTML = "";
    
    // Verificar nuevamente que clubesCompradores esté disponible
    if (typeof clubesCompradores === 'undefined' || !Array.isArray(clubesCompradores)) {
        console.error("Error: clubesCompradores no está definido o no es un array");
        listaOfertas.innerHTML = `
            <div class="sin-ofertas">
                <p>Error al cargar los clubes interesados.</p>
            </div>
        `;
        return;
    }
    
    // Seleccionar los clubes interesados
    const clubesInteresados = clubesCompradores.filter(club => clubEstaInteresado(club, jugador));
    
    console.log("Clubes interesados:", clubesInteresados.length);
    
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
