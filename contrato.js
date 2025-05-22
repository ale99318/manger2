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
                <p><strong>Club Anterior:</strong> ${jugador.club}</p>
                <p><strong>OVR:</strong> ${jugador.general} | <strong>POT:</strong> ${jugador.potencial}</p>
                <p><strong>Edad:</strong> ${jugador.edad || 25} años</p>
            </div>
        `;
    }
    
    // Mostrar detalles de la transferencia
    function mostrarDetallesTransferencia() {
        transferDetails.innerHTML = `
            <div class="transfer-details">
                <div class="transfer-item">
                    <strong>Precio de Transferencia:</strong><br>
                    ${formatearPrecio(transferencia.precioFinal)}
                </div>
                <div class="transfer-item">
                    <strong>Bonus de Firma:</strong><br>
                    ${formatearPrecio(jugador.bonusFirma)}
                </div>
                <div class="transfer-item">
                    <strong>Costo Total de Transferencia:</strong><br>
                    ${formatearPrecio(transferencia.costoTotal)}
                </div>
            </div>
        `;
    }
    
    // Configurar sliders y mostrar grupos relevantes
    function configurarFormulario() {
        // Configurar rango de salario basado en el jugador
        weeklySalary.min = Math.floor(jugadorPreferencias.salarioMinimo * 0.7);
        weeklySalary.max = Math.floor(jugadorPreferencias.salarioDeseado * 1.5);
        weeklySalary.value = Math.floor((parseInt(weeklySalary.min) + parseInt(weeklySalary.max)) / 2);
        
        // Mostrar grupos de bonus según la posición
        const posicion = jugador.posicion.toLowerCase();
        if (posicion.includes('delantero') || posicion.includes('mediocampista') || posicion.includes('extremo')) {
            document.getElementById('goalBonusGroup').style.display = 'block';
            
            // Si tiene stats altos de gol, mostrar bonus de goleador
            if (jugador.general >= 80) {
                document.getElementById('topScorerBonusGroup').style.display = 'block';
            }
        }
        
        if (posicion.includes('portero') || posicion.includes('defensa')) {
            document.getElementById('cleanSheetBonusGroup').style.display = 'block';
        }
        
        // Event listeners para sliders
        contractYears.addEventListener('input', actualizarDisplays);
        weeklySalary.addEventListener('input', actualizarDisplays);
        goalBonus.addEventListener('input', actualizarDisplays);
        cleanSheetBonus.addEventListener('input', actualizarDisplays);
        topScorerBonus.addEventListener('input', actualizarDisplays);
        
        actualizarDisplays();
    }
    
    // Actualizar displays y preferencias
    function actualizarDisplays() {
        const anos = parseInt(contractYears.value);
        const salario = parseInt(weeklySalary.value);
        
        yearsDisplay.textContent = `${anos} año${anos > 1 ? 's' : ''}`;
        salaryDisplay.textContent = formatearPrecio(salario);
        goalBonusDisplay.textContent = formatearPrecio(parseInt(goalBonus.value));
        cleanSheetBonusDisplay.textContent = formatearPrecio(parseInt(cleanSheetBonus.value));
        topScorerBonusDisplay.textContent = formatearPrecio(parseInt(topScorerBonus.value));
        
        // Mostrar preferencias del jugador
        mostrarPreferenciasJugador(anos, salario);
        actualizarResumenContrato();
    }
    
    // Mostrar preferencias del jugador
    function mostrarPreferenciasJugador(anos, salario) {
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
            playerSalaryPreference.className = 'player-preference';
            playerSalaryPreference.textContent = `${jugador.nombre} está muy satisfecho con el salario ofrecido.`;
        } else {
            playerSalaryPreference.className = 'player-preference';
            playerSalaryPreference.textContent = `El salario es aceptable para ${jugador.nombre}.`;
        }
    }
    
    // Actualizar resumen del contrato
    function actualizarResumenContrato() {
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
            statusText.textContent = '¡Contrato acordado!';
        }
    }
    
    // Evaluar oferta del contrato
    function evaluarOferta() {
        const anos = parseInt(contractYears.value);
        const salario = parseInt(weeklySalary.value);
        
        let puntuacion = 0;
        
        // Evaluar años (30% del peso)
        if (anos >= jugadorPreferencias.aniosMinimos && anos <= jugadorPreferencias.aniosMaximos) {
            puntuacion += 30;
        } else if (anos === jugadorPreferencias.aniosMinimos - 1 || anos === jugadorPreferencias.aniosMaximos + 1
