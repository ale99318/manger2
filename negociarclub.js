document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos del jugador desde localStorage
    const jugadorData = localStorage.getItem('jugadorSeleccionado');
    if (!jugadorData) {
        alert('Error: No se encontraron datos del jugador');
        history.back();
        return;
    }
    
    const jugador = JSON.parse(jugadorData);
    
    // Elementos del DOM
    const playerInfo = document.getElementById('playerInfo');
    const chatContainer = document.getElementById('chatContainer');
    const responseOptions = document.getElementById('responseOptions');
    const progressFill = document.getElementById('progressFill');
    const statusText = document.getElementById('statusText');
    const successModal = document.getElementById('successModal');
    const failModal = document.getElementById('failModal');
    const btnContinue = document.getElementById('btnContinue');
    const finalTerms = document.getElementById('finalTerms');
    
    // Variables de negociación
    let negociacionProgreso = 0;
    let rondaActual = 0;
    let precioOfrecido = Math.floor(jugador.precioTransferencia * 0.7); // Empezamos con 70%
    let precioMinimo = Math.floor(jugador.precioTransferencia * 0.85); // Club acepta mínimo 85%
    let negociacionActiva = true;
    
    // Función para formatear precios
    function formatearPrecio(precio) {
        if (precio >= 1000000) {
            return `$${(precio / 1000000).toFixed(1)}M`;
        } else if (precio >= 1000) {
            return `$${(precio / 1000).toFixed(0)}K`;
        } else {
            return `$${precio}`;
        }
    }
    
    // Mostrar información del jugador
    function mostrarInfoJugador() {
        playerInfo.innerHTML = `
            <div class="player-photo">
                <img src="/api/placeholder/80/80" alt="${jugador.nombre}">
            </div>
            <div class="player-details">
                <h3>${jugador.nombre}</h3>
                <p><strong>Posición:</strong> ${jugador.posicion}</p>
                <p><strong>Club Actual:</strong> ${jugador.club}</p>
                <p><strong>OVR:</strong> ${jugador.general} | <strong>POT:</strong> ${jugador.potencial}</p>
                <p class="transfer-price"><strong>Precio solicitado:</strong> ${formatearPrecio(jugador.precioTransferencia)}</p>
            </div>
        `;
    }
    
    // Agregar mensaje al chat
    function agregarMensaje(texto, tipo) {
        const mensaje = document.createElement('div');
        mensaje.className = `message ${tipo}`;
        mensaje.textContent = texto;
        chatContainer.appendChild(mensaje);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Actualizar barra de progreso
    function actualizarProgreso() {
        const porcentaje = (negociacionProgreso / 100) * 100;
        progressFill.style.width = porcentaje + '%';
        
        if (porcentaje < 30) {
            statusText.textContent = 'Negociación difícil...';
        } else if (porcentaje < 70) {
            statusText.textContent = 'Progresando...';
        } else if (porcentaje < 100) {
            statusText.textContent = 'Cerca del acuerdo...';
        } else {
            statusText.textContent = '¡Acuerdo alcanzado!';
        }
    }
    
    // Generar respuesta del club
    function generarRespuestaClub(tipoRespuesta) {
        const respuestasClub = {
            rechazo_bajo: [
                `Esa oferta de ${formatearPrecio(precioOfrecido)} es muy baja para un jugador de la calidad de ${jugador.nombre}.`,
                `No podemos aceptar menos de ${formatearPrecio(Math.floor(jugador.precioTransferencia * 0.9))} por ${jugador.nombre}.`,
                `${jugador.nombre} vale mucho más que esa cantidad. Necesitamos una oferta seria.`
            ],
            rechazo_medio: [
                `Estamos más cerca, pero ${formatearPrecio(precioOfrecido)} aún no es suficiente.`,
                `Apreciamos su interés, pero necesitamos ${formatearPrecio(precioMinimo)} como mínimo.`,
                `Su oferta ha mejorado, pero no podemos aceptar menos de ${formatearPrecio(precioMinimo)}.`
            ],
            aceptacion: [
                `¡Perfecto! Aceptamos su oferta de ${formatearPrecio(precioOfrecido)} por ${jugador.nombre}.`,
                `Tenemos un trato. ${formatearPrecio(precioOfrecido)} es una oferta justa por nuestro jugador.`,
                `Excelente. Podemos proceder con la transferencia por ${formatearPrecio(precioOfrecido)}.`
            ],
            ultimatum: [
                `Esta es nuestra última oferta: ${formatearPrecio(precioMinimo)}. Tómelo o déjelo.`,
                `No podemos continuar así. ${formatearPrecio(precioMinimo)} o terminamos las negociaciones.`,
                `Final de las negociaciones: ${formatearPrecio(precioMinimo)} es nuestro precio final.`
            ]
        };
        
        const respuestas = respuestasClub[tipoRespuesta];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    
    // Mostrar opciones de respuesta
    function mostrarOpciones() {
        if (!negociacionActiva) return;
        
        responseOptions.innerHTML = '';
        
        const opciones = [];
        
        if (precioOfrecido < jugador.precioTransferencia) {
            // Opciones para aumentar oferta
            opciones.push({
                texto: `Ofrecer ${formatearPrecio(precioOfrecido + Math.floor(jugador.precioTransferencia * 0.05))} (+5%)`,
                accion: () => manejarOferta(precioOfrecido + Math.floor(jugador.precioTransferencia * 0.05))
            });
            
            opciones.push({
                texto: `Ofrecer ${formatearPrecio(precioOfrecido + Math.floor(jugador.precioTransferencia * 0.1))} (+10%)`,
                accion: () => manejarOferta(precioOfrecido + Math.floor(jugador.precioTransferencia * 0.1))
            });
        }
        
        if (rondaActual > 2) {
            opciones.push({
                texto: 'Aceptar su precio final',
                accion: () => manejarOferta(precioMinimo)
            });
        }
        
        opciones.push({
            texto: 'Mantener oferta actual',
            accion: () => manejarMantenerOferta()
        });
        
        opciones.push({
            texto: 'Terminar negociación',
            accion: () => terminarNegociacion(false)
        });
        
        // Crear botones
        opciones.forEach(opcion => {
            const btn = document.createElement('button');
            btn.className = 'response-btn';
            btn.textContent = opcion.texto;
            btn.addEventListener('click', opcion.accion);
            responseOptions.appendChild(btn);
        });
    }
    
    // Manejar nueva oferta
    function manejarOferta(nuevoPrecio) {
        precioOfrecido = nuevoPrecio;
        rondaActual++;
        
        agregarMensaje(`Ofrecemos ${formatearPrecio(precioOfrecido)} por ${jugador.nombre}`, 'manager');
        
        setTimeout(() => {
            if (precioOfrecido >= precioMinimo) {
                // Éxito
                negociacionProgreso = 100;
                actualizarProgreso();
                agregarMensaje(generarRespuestaClub('aceptacion'), 'club');
                setTimeout(() => terminarNegociacion(true), 1000);
            } else if (precioOfrecido >= jugador.precioTransferencia * 0.8) {
                // Cerca del objetivo
                negociacionProgreso += 20;
                actualizarProgreso();
                if (rondaActual >= 4) {
                    agregarMensaje(generarRespuestaClub('ultimatum'), 'club');
                } else {
                    agregarMensaje(generarRespuestaClub('rechazo_medio'), 'club');
                }
                setTimeout(mostrarOpciones, 1000);
            } else {
                // Muy bajo
                negociacionProgreso += 10;
                actualizarProgreso();
                agregarMensaje(generarRespuestaClub('rechazo_bajo'), 'club');
                
                if (rondaActual >= 5) {
                    setTimeout(() => {
                        agregarMensaje('El club ha terminado las negociaciones.', 'system');
                        terminarNegociacion(false);
                    }, 2000);
                } else {
                    setTimeout(mostrarOpciones, 1000);
                }
            }
        }, 1500);
    }
    
    // Mantener oferta actual
    function manejarMantenerOferta() {
        rondaActual++;
        agregarMensaje(`Mantenemos nuestra oferta de ${formatearPrecio(precioOfrecido)}`, 'manager');
        
        setTimeout(() => {
            if (rondaActual >= 3) {
                negociacionProgreso -= 10;
                actualizarProgreso();
                agregarMensaje('El club está perdiendo la paciencia...', 'system');
                
                if (rondaActual >= 5) {
                    setTimeout(() => terminarNegociacion(false), 1000);
                } else {
                    setTimeout(mostrarOpciones, 1000);
                }
            } else {
                agregarMensaje('El club insiste en un precio mayor.', 'club');
                setTimeout(mostrarOpciones, 1000);
            }
        }, 1500);
    }
    
    // Terminar negociación
    function terminarNegociacion(exito) {
        negociacionActiva = false;
        responseOptions.innerHTML = '';
        
        if (exito) {
            // Mostrar términos finales
            finalTerms.innerHTML = `
                <h4>Términos del Acuerdo:</h4>
                <ul>
                    <li><strong>Jugador:</strong> ${jugador.nombre}</li>
                    <li><strong>Precio de transferencia:</strong> ${formatearPrecio(precioOfrecido)}</li>
                    <li><strong>Club vendedor:</strong> ${jugador.club}</li>
                    <li><strong>Bonus por firma:</strong> ${formatearPrecio(jugador.bonusFirma)}</li>
                    <li><strong>Costo total:</strong> ${formatearPrecio(precioOfrecido + jugador.bonusFirma)}</li>
                </ul>
            `;
            
            // Guardar resultado en localStorage
            localStorage.setItem('negociacionExitosa', JSON.stringify({
                jugador: jugador,
                precioFinal: precioOfrecido,
                costoTotal: precioOfrecido + jugador.bonusFirma
            }));
            
            successModal.style.display = 'block';
        } else {
            failModal.style.display = 'block';
        }
    }
    
    // Event listener para botón continuar
    btnContinue.addEventListener('click', function() {
        // Aquí redirigirás al siguiente HTML más adelante
        alert('Funcionalidad de continuar será implementada próximamente');
        // window.location.href = 'siguiente-pagina.html';
    });
    
    // Inicializar la negociación
    function iniciarNegociacion() {
        mostrarInfoJugador();
        agregarMensaje(`Bienvenido a las negociaciones por ${jugador.nombre}. Su club solicita ${formatearPrecio(jugador.precioTransferencia)}.`, 'system');
        
        setTimeout(() => {
            agregarMensaje(`Estamos interesados en ${jugador.nombre}. ¿Cuál es su oferta inicial?`, 'club');
            setTimeout(mostrarOpciones, 1000);
        }, 1000);
    }
    
    // Inicializar
    iniciarNegociacion();
    actualizarProgreso();
});
