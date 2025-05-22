document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos de la negociación exitosa
    const negociacionData = localStorage.getItem('negociacionExitosa');
    if (!negociacionData) {
        alert('Error: No se encontraron datos de la transferencia');
        history.back();
        return;
    }
    
    const transferencia = JSON.parse(negociacionData);
    const jugador = transferencia.jugador;
    
    // Elementos del DOM
    const playerInfo = document.getElementById('playerInfo');
    const transferDetails = document.getElementById('transferDetails');
    const chatContainer = document.getElementById('chatContainer');
    const responseOptions = document.getElementById('responseOptions');
    const progressFill = document.getElementById('progressFill');
    const statusText = document.getElementById('statusText');
    const successModal = document.getElementById('successModal');
    const failModal = document.getElementById('failModal');
    const finalContractTerms = document.getElementById('finalContractTerms');
    const contractSummary = document.getElementById('contractSummary');
    
    // Sliders
    const contractYears = document.getElementById('contractYears');
    const weeklySalary = document.getElementById('weeklySalary');
    const goalBonus = document.getElementById('goalBonus');
    const cleanSheetBonus = document.getElementById('cleanSheetBonus');
    const topScorerBonus = document.getElementById('topScorerBonus');
    
    // Displays
    const yearsDisplay = document.getElementById('yearsDisplay');
    const salaryDisplay = document.getElementById('salaryDisplay');
    const goalBonusDisplay = document.getElementById('goalBonusDisplay');
    const cleanSheetBonusDisplay = document.getElementById('cleanSheetBonusDisplay');
    const topScorerBonusDisplay = document.getElementById('topScorerBonusDisplay');
    
    // Preferencias del jugador
    const playerYearsPreference = document.getElementById('playerYearsPreference');
    const playerSalaryPreference = document.getElementById('playerSalaryPreference');
    
    // Variables de negociación
    let negociacionProgreso = 0;
    let rondaActual = 0;
    let negociacionActiva = true;
    
    // Preferencias del jugador (generadas aleatoriamente basadas en sus stats)
    const jugadorPreferencias = {
        aniosMinimos: Math.max(2, Math.floor(jugador.general / 25)), // Mínimo 2 años, más si es mejor
        aniosMaximos: Math.min(5, Math.floor(jugador.general / 15)), // Máximo basado en calidad
        salarioMinimo: Math.floor(jugador.general * 1000 + jugador.potencial * 500), // Basado en stats
        salarioDeseado: Math.floor(jugador.general * 1500 + jugador.potencial * 750),
        flexibilidadSalario: Math.random() * 0.3 + 0.1 // 10-40% de flexibilidad
    };
    
    // CORRECCIÓN: Verificar que los elementos existen antes de usarlos
    function verificarElementos() {
        const elementos = [
            contractYears, weeklySalary, goalBonus, cleanSheetBonus, topScorerBonus,
            yearsDisplay, salaryDisplay, goalBonusDisplay, cleanSheetBonusDisplay, topScorerBonusDisplay,
            playerYearsPreference, playerSalaryPreference, contractSummary
        ];
        
        for (let elemento of elementos) {
            if (!elemento) {
                console.error('Elemento faltante en el DOM:', elemento);
                return false;
            }
        }
        return true;
    }
    
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
        if (playerInfo) {
            playerInfo.innerHTML = `
                <div class="player-photo">
                    <img src="/api/placeholder/80/80" alt="${jugador.nombre}">
                </div>
                <div class="player-details">
                    <h3>${jugador.nombre}</h3>
                    <p><strong>Posición:</strong> ${jugador.posicion}</p>
                    <p><strong>Club Anterior:</strong> ${jugador.club}</p>
                    <p><strong>OVR:</strong> ${jugador.general} | <strong>POT:</strong> ${jugador.potencial}</p>
                    <p><strong>Edad:</strong> ${jugador.edad || 25} años</p>
                </div>
            `;
        }
    }
    
    // Mostrar detalles de la transferencia
    function mostrarDetallesTransferencia() {
        if (transferDetails) {
            transferDetails.innerHTML = `
                <div class="transfer-details">
                    <div class="transfer-item">
                        <strong>Precio de Transferencia:</strong><br>
                        ${formatearPrecio(transferencia.precioFinal)}
                    </div>
                    <div class="transfer-item">
                        <strong>Bonus de Firma:</strong><br>
                        ${formatearPrecio(jugador.bonusFirma || 0)}
                    </div>
                    <div class="transfer-item">
                        <strong>Costo Total de Transferencia:</strong><br>
                        ${formatearPrecio(transferencia.costoTotal)}
                    </div>
                </div>
            `;
        }
    }
    
    // Configurar sliders y mostrar grupos relevantes
    function configurarFormulario() {
        if (!contractYears || !weeklySalary) {
            console.error('Elementos del formulario no encontrados');
            return;
        }
        
        // Configurar rango de salario basado en el jugador
        weeklySalary.min = Math.floor(jugadorPreferencias.salarioMinimo * 0.7);
        weeklySalary.max = Math.floor(jugadorPreferencias.salarioDeseado * 1.5);
        weeklySalary.value = Math.floor((parseInt(weeklySalary.min) + parseInt(weeklySalary.max)) / 2);
        
        // CORRECCIÓN: Configurar años también
        contractYears.min = 1;
        contractYears.max = 6;
        contractYears.value = 3; // Valor por defecto
        
        // Mostrar grupos de bonus según la posición
        const posicion = jugador.posicion.toLowerCase();
        if (posicion.includes('delantero') || posicion.includes('mediocampista') || posicion.includes('extremo')) {
            const goalBonusGroup = document.getElementById('goalBonusGroup');
            if (goalBonusGroup) goalBonusGroup.style.display = 'block';
            
            // Si tiene stats altos de gol, mostrar bonus de goleador
            if (jugador.general >= 80) {
                const topScorerBonusGroup = document.getElementById('topScorerBonusGroup');
                if (topScorerBonusGroup) topScorerBonusGroup.style.display = 'block';
            }
        }
        
        if (posicion.includes('portero') || posicion.includes('defensa')) {
            const cleanSheetBonusGroup = document.getElementById('cleanSheetBonusGroup');
            if (cleanSheetBonusGroup) cleanSheetBonusGroup.style.display = 'block';
        }
        
        // Event listeners para sliders
        contractYears.addEventListener('input', actualizarDisplays);
        weeklySalary.addEventListener('input', actualizarDisplays);
        
        if (goalBonus) goalBonus.addEventListener('input', actualizarDisplays);
        if (cleanSheetBonus) cleanSheetBonus.addEventListener('input', actualizarDisplays);
        if (topScorerBonus) topScorerBonus.addEventListener('input', actualizarDisplays);
        
        // Llamar inmediatamente para mostrar valores iniciales
        actualizarDisplays();
        
        console.log('Configuración completada:', {
            salarioMin: weeklySalary.min,
            salarioMax: weeklySalary.max,
            salarioActual: weeklySalary.value,
            añosActuales: contractYears.value
        });
    }
    
    // Actualizar displays y preferencias
    function actualizarDisplays() {
        if (!contractYears || !weeklySalary) return;
        
        const anos = parseInt(contractYears.value);
        const salario = parseInt(weeklySalary.value);
        
        // Actualizar displays
        if (yearsDisplay) yearsDisplay.textContent = `${anos} año${anos > 1 ? 's' : ''}`;
        if (salaryDisplay) salaryDisplay.textContent = formatearPrecio(salario);
        
        if (goalBonusDisplay && goalBonus) {
            goalBonusDisplay.textContent = formatearPrecio(parseInt(goalBonus.value));
        }
        if (cleanSheetBonusDisplay && cleanSheetBonus) {
            cleanSheetBonusDisplay.textContent = formatearPrecio(parseInt(cleanSheetBonus.value));
        }
        if (topScorerBonusDisplay && topScorerBonus) {
            topScorerBonusDisplay.textContent = formatearPrecio(parseInt(topScorerBonus.value));
        }
        
        // Mostrar preferencias del jugador
        mostrarPreferenciasJugador(anos, salario);
        actualizarResumenContrato();
        
        console.log('Displays actualizados:', { anos, salario });
    }
    
    // Mostrar preferencias del jugador
    function mostrarPreferenciasJugador(anos, salario) {
        if (!playerYearsPreference || !playerSalaryPreference) return;
        
        // Preferencia de años
        if (anos < jugadorPreferencias.aniosMinimos) {
            playerYearsPreference.className = 'player-preference negative';
            playerYearsPreference.textContent = `${jugador.nombre} prefiere un contrato de al menos ${jugadorPreferencias.aniosMinimos} años.`;
        } else if (anos > jugadorPreferencias.aniosMaximos) {
            playerYearsPreference.className = 'player-preference negative';
            playerYearsPreference.textContent = `${jugador.nombre} considera ${anos} años demasiado tiempo.`;
        } else {
            playerYearsPreference.className = 'player-preference';
            playerYearsPreference.textContent = `${jugador.nombre} está conforme con la duración del contrato.`;
        }
        
        // Preferencia de salario
        if (salario < jugadorPreferencias.salarioMinimo) {
            playerSalaryPreference.className = 'player-preference negative';
            playerSalaryPreference.textContent = `El salario está por debajo de las expectativas de ${jugador.nombre}.`;
        } else if (salario >= jugadorPreferencias.salarioDeseado) {
            playerSalaryPreference.className = 'player-preference positive';
            playerSalaryPreference.textContent = `${jugador.nombre} está muy satisfecho con el salario ofrecido.`;
        } else {
            playerSalaryPreference.className = 'player-preference';
            playerSalaryPreference.textContent = `El salario es aceptable para ${jugador.nombre}.`;
        }
    }
    
    // Actualizar resumen del contrato
    function actualizarResumenContrato() {
        if (!contractSummary || !contractYears || !weeklySalary) return;
        
        const anos = parseInt(contractYears.value);
        const salario = parseInt(weeklySalary.value);
        const salarioAnual = salario * 52;
        const costoTotal = salarioAnual * anos;
        
        contractSummary.innerHTML = `
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Duración</h4>
                    <p>${anos} año${anos > 1 ? 's' : ''}</p>
                </div>
                <div class="summary-item">
                    <h4>Salario Semanal</h4>
                    <p>${formatearPrecio(salario)}</p>
                </div>
                <div class="summary-item">
                    <h4>Salario Anual</h4>
                    <p>${formatearPrecio(salarioAnual)}</p>
                </div>
                <div class="summary-item">
                    <h4>Costo Total del Contrato</h4>
                    <p>${formatearPrecio(costoTotal)}</p>
                </div>
            </div>
        `;
    }
    
    // Agregar mensaje al chat
    function agregarMensaje(texto, tipo) {
        if (!chatContainer) return;
        
        const mensaje = document.createElement('div');
        mensaje.className = `message ${tipo}`;
        mensaje.textContent = texto;
        chatContainer.appendChild(mensaje);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Actualizar barra de progreso
    function actualizarProgreso() {
        if (!progressFill || !statusText) return;
        
        const porcentaje = (negociacionProgreso / 100) * 100;
        progressFill.style.width = porcentaje + '%';
        
        if (porcentaje < 30) {
            statusText.textContent = 'Negociación difícil...';
        } else if (porcentaje < 70) {
            statusText.textContent = 'Progresando...';
        } else if (porcentaje < 100) {
            statusText.textContent = 'Cerca del acuerdo...';
        } else {
            statusText.textContent = '¡Contrato acordado!';
        }
    }
    
    // FUNCIÓN COMPLETADA - Evaluar oferta del contrato
    function evaluarOferta() {
        const anos = parseInt(contractYears.value);
        const salario = parseInt(weeklySalary.value);
        
        let puntuacion = 0;
        
        // Evaluar años (30% del peso)
        if (anos >= jugadorPreferencias.aniosMinimos && anos <= jugadorPreferencias.aniosMaximos) {
            puntuacion += 30;
        } else if (anos === jugadorPreferencias.aniosMinimos - 1 || anos === jugadorPreferencias.aniosMaximos + 1) {
            puntuacion += 20; // Penalización menor
        } else {
            puntuacion += 5; // Penalización mayor
        }
        
        // Evaluar salario (50% del peso)
        if (salario >= jugadorPreferencias.salarioDeseado) {
            puntuacion += 50;
        } else if (salario >= jugadorPreferencias.salarioMinimo) {
            const ratio = (salario - jugadorPreferencias.salarioMinimo) / 
                         (jugadorPreferencias.salarioDeseado - jugadorPreferencias.salarioMinimo);
            puntuacion += 25 + (ratio * 25);
        } else {
            puntuacion += 10; // Salario muy bajo
        }
        
        // Evaluar bonus (20% del peso)
        const bonusTotal = (goalBonus ? parseInt(goalBonus.value) : 0) + 
                          (cleanSheetBonus ? parseInt(cleanSheetBonus.value) : 0) + 
                          (topScorerBonus ? parseInt(topScorerBonus.value) : 0);
        
        if (bonusTotal > salario * 0.1) { // Si los bonus son > 10% del salario
            puntuacion += 20;
        } else if (bonusTotal > 0) {
            puntuacion += 10;
        }
        
        return Math.min(100, puntuacion);
    }
    
    // Función para procesar la oferta de contrato
    function procesarOferta() {
        if (!negociacionActiva) return;
        
        const puntuacion = evaluarOferta();
        negociacionProgreso = puntuacion;
        rondaActual++;
        
        actualizarProgreso();
        
        const anos = parseInt(contractYears.value);
        const salario = parseInt(weeklySalary.value);
        
        agregarMensaje(`Oferta ${rondaActual}: ${anos} años, ${formatearPrecio(salario)}/semana`, 'user');
        
        setTimeout(() => {
            if (puntuacion >= 80) {
                // Éxito
                agregarMensaje(`¡Excelente! ${jugador.nombre} está muy satisfecho con la oferta. ¡Contrato acordado!`, 'agent');
                finalizarNegociacion(true);
            } else if (puntuacion >= 60) {
                // Cerca pero necesita ajustes
                const sugerencia = generarSugerencia();
                agregarMensaje(`${jugador.nombre}: "La oferta es interesante, pero ${sugerencia}"`, 'agent');
            } else if (puntuacion >= 40) {
                // Necesita mejoras significativas
                agregarMensaje(`${jugador.nombre}: "Necesito una mejor oferta para considerar firmar."`, 'agent');
            } else {
                // Oferta muy pobre
                agregarMensaje(`${jugador.nombre}: "Esta oferta está muy lejos de mis expectativas."`, 'agent');
            }
            
            if (rondaActual >= 5 && puntuacion < 80) {
                // Fracaso después de muchas rondas
                agregarMensaje(`${jugador.nombre} ha decidido buscar otras opciones. Negociación fallida.`, 'agent');
                finalizarNegociacion(false);
            }
        }, 1000);
    }
    
    // Generar sugerencia basada en las preferencias
    function generarSugerencia() {
        const anos = parseInt(contractYears.value);
        const salario = parseInt(weeklySalary.value);
        const sugerencias = [];
        
        if (anos < jugadorPreferencias.aniosMinimos) {
            sugerencias.push(`prefiero al menos ${jugadorPreferencias.aniosMinimos} años`);
        } else if (anos > jugadorPreferencias.aniosMaximos) {
            sugerencias.push(`${anos} años es demasiado tiempo`);
        }
        
        if (salario < jugadorPreferencias.salarioMinimo) {
            sugerencias.push(`necesito un salario de al menos ${formatearPrecio(jugadorPreferencias.salarioMinimo)}`);
        }
        
        return sugerencias.length > 0 ? sugerencias.join(' y ') : 'podríamos ajustar algunos detalles';
    }
    
    // Actualizar botones según el estado de la negociación
    function actualizarBotones(estado) {
        const makeOfferBtn = document.getElementById('makeOfferBtn');
        const backToSquadBtn = document.getElementById('backToSquadBtn');
        
        if (estado === 'negociando') {
            // Durante la negociación
            if (makeOfferBtn) {
                makeOfferBtn.style.display = 'inline-block';
                makeOfferBtn.disabled = false;
            }
            if (backToSquadBtn) {
                backToSquadBtn.textContent = 'Cancelar Negociación';
                backToSquadBtn.className = 'btn btn-warning';
            }
        } else if (estado === 'exitosa') {
            // Negociación exitosa
            if (makeOfferBtn) {
                makeOfferBtn.style.display = 'none'; // Ocultar botón de oferta
            }
            if (backToSquadBtn) {
                backToSquadBtn.textContent = 'Ir a Plantilla';
                backToSquadBtn.className = 'btn btn-success';
            }
        } else if (estado === 'fallida') {
            // Negociación fallida
            if (makeOfferBtn) {
                makeOfferBtn.style.display = 'none'; // Ocultar botón de oferta
            }
            if (backToSquadBtn) {
                backToSquadBtn.textContent = 'Volver a Plantilla';
                backToSquadBtn.className = 'btn btn-danger';
            }
        }
    }
    
    // Finalizar negociación
    function finalizarNegociacion(exitosa) {
        negociacionActiva = false;
        
        if (exitosa) {
            // Guardar datos del contrato
            const contratoFinal = {
                jugador: jugador,
                anos: parseInt(contractYears.value),
                salarioSemanal: parseInt(weeklySalary.value),
                bonusGol: goalBonus ? parseInt(goalBonus.value) : 0,
                bonusPorteriaLimpia: cleanSheetBonus ? parseInt(cleanSheetBonus.value) : 0,
                bonusGoleador: topScorerBonus ? parseInt(topScorerBonus.value) : 0,
                fechaFirma: new Date().toISOString()
            };
            
            localStorage.setItem('contratoFirmado', JSON.stringify(contratoFinal));
            
            // Actualizar botones para estado exitoso
            actualizarBotones('exitosa');
            
            if (successModal) {
                if (finalContractTerms) {
                    finalContractTerms.innerHTML = `
                        <h3>Contrato Firmado - ${jugador.nombre}</h3>
                        <p><strong>Duración:</strong> ${contratoFinal.anos} años</p>
                        <p><strong>Salario:</strong> ${formatearPrecio(contratoFinal.salarioSemanal)}/semana</p>
                        <p><strong>Salario Anual:</strong> ${formatearPrecio(contratoFinal.salarioSemanal * 52)}</p>
                        <p><strong>Costo Total:</strong> ${formatearPrecio(contratoFinal.salarioSemanal * 52 * contratoFinal.anos)}</p>
                    `;
                }
                successModal.style.display = 'block';
            }
        } else {
            // Actualizar botones para estado fallido
            actualizarBotones('fallida');
            
            if (failModal) {
                failModal.style.display = 'block';
            }
        }
    }
    
    // Inicializar todo
    function inicializar() {
        console.log('Iniciando negociación de contrato para:', jugador.nombre);
        console.log('Preferencias calculadas:', jugadorPreferencias);
        
        mostrarInfoJugador();
        mostrarDetallesTransferencia();
        configurarFormulario();
        
        // Agregar botones para hacer oferta y volver a plantilla
        if (responseOptions && !document.getElementById('makeOfferBtn')) {
            // Botón para hacer oferta
            const botonOferta = document.createElement('button');
            botonOferta.id = 'makeOfferBtn';
            botonOferta.textContent = 'Hacer Oferta';
            botonOferta.className = 'btn btn-primary';
            botonOferta.addEventListener('click', procesarOferta);
            responseOptions.appendChild(botonOferta);
            
            // Botón para volver a plantilla
            const botonPlantilla = document.createElement('button');
            botonPlantilla.id = 'backToSquadBtn';
            botonPlantilla.textContent = 'Cancelar Negociación';
            botonPlantilla.className = 'btn btn-warning';
            botonPlantilla.style.marginLeft = '10px';
            botonPlantilla.addEventListener('click', function() {
                let mensaje = '¿Estás seguro de que quieres ';
                let destino = ''; // Variable para el destino
                
                if (!negociacionActiva) {
                    // Después de terminar la negociación
                    if (negociacionProgreso >= 80) {
                        // Negociación exitosa
                        mensaje += 'ir a ver tu plantilla con el nuevo fichaje?';
                        destino = 'plantilla.html'; // ← AQUÍ CAMBIAS A DÓNDE VA DESPUÉS DEL ÉXITO
                    } else {
                        // Negociación fallida
                        mensaje += 'volver a la plantilla?';
                        destino = 'plantilla.html'; // ← AQUÍ CAMBIAS A DÓNDE VA DESPUÉS DEL FRACASO
                    }
                } else {
                    // Durante la negociación activa
                    mensaje += 'cancelar la negociación? Se perderá todo el progreso.';
                    destino = 'menu.html'; // ← AQUÍ CAMBIAS A DÓNDE VA AL CANCELAR
                }
                
                if (confirm(mensaje)) {
                    window.location.href = destino;
                }
            });
            responseOptions.appendChild(botonPlantilla);
        }
        
        // Establecer estado inicial de botones
        actualizarBotones('negociando');
        
        // Mensaje inicial
        agregarMensaje(`Negociando contrato con ${jugador.nombre}. Ajusta los términos y haz tu oferta.`, 'system');
    }
    
    // Verificar que todo esté listo e inicializar
    if (verificarElementos()) {
        inicializar();
    } else {
        console.error('Faltan elementos del DOM. Verifica tu HTML.');
        alert('Error: Faltan elementos en la página. Verifica que todos los IDs estén correctos.');
    }
});
