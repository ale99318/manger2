// ==================== SISTEMA DE CALENDARIO ====================
class AutoCalendar {
    constructor() {
        this.startDate = new Date(2025, 0, 1); // 1 de enero 2025
        this.endDate = new Date(2040, 11, 31); // 31 de diciembre 2040
        this.currentDate = new Date(this.startDate);
        this.interval = null;
        this.isPaused = false;
        this.intervalTime = 5000; // 5 segundos
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadPlayersData();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.currentDateElement = document.getElementById('current-date');
        this.yearMonthElement = document.getElementById('year-month');
        this.daysGridElement = document.getElementById('days-grid');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressText = document.getElementById('progress-text');
        this.progressFill = document.getElementById('progress-fill');
    }
    
    setupEventListeners() {
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.daysGridElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('day') && !event.target.classList.contains('other-month')) {
                const selectedDay = parseInt(event.target.textContent);
                this.jumpToDate(selectedDay);
            }
        });
    }
    
    loadPlayersData() {
        // Cargar jugadores desde localStorage si existen
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (jugadoresData) {
            this.jugadoresPorClub = JSON.parse(jugadoresData);
            this.updatePlayersStats();
        } else {
            this.jugadoresPorClub = {};
        }
    }
    
    start() {
        if (!this.isPaused) {
            this.interval = setInterval(() => {
                this.nextDay();
            }, this.intervalTime);
        }
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    togglePause() {
        if (this.isPaused) {
            this.start();
            this.pauseBtn.textContent = 'Pausar';
            this.pauseBtn.classList.remove('paused');
            this.isPaused = false;
        } else {
            this.stop();
            this.pauseBtn.textContent = 'Continuar';
            this.pauseBtn.classList.add('paused');
            this.isPaused = true;
        }
    }
    
    reset() {
        this.stop();
        this.currentDate = new Date(this.startDate);
        this.isPaused = false;
        this.pauseBtn.textContent = 'Pausar';
        this.pauseBtn.classList.remove('paused');
        this.clearEventLog();
        this.updateDisplay();
        this.start();
    }
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        // Array para almacenar todos los eventos del día
        let eventosDelDia = [];
        
        // 1. Verificar cumpleaños de jugadores
        const eventosCumpleanos = this.checkBirthdays();
        if (eventosCumpleanos.birthdayPlayers.length > 0 || 
            eventosCumpleanos.retiredPlayers.length > 0 || 
            (eventosCumpleanos.lastYearPlayers && eventosCumpleanos.lastYearPlayers.length > 0)) {
            eventosDelDia.push({
                tipo: 'cumpleanos',
                data: eventosCumpleanos
            });
        }
        
        // 2. Aplicar degradación por inactividad
        if (typeof aplicarDegradacionPorInactividad === 'function') {
            const degradacionAplicada = aplicarDegradacionPorInactividad();
            if (degradacionAplicada) {
                eventosDelDia.push({
                    tipo: 'degradacion',
                    data: degradacionAplicada
                });
            }
        }
        
        // 3. Aplicar eventos aleatorios de cansancio
        if (typeof aplicarEventosAleatoriosCansancio === 'function') {
            const eventosAleatorios = aplicarEventosAleatoriosCansancio();
            if (eventosAleatorios.length > 0) {
                eventosDelDia.push({
                    tipo: 'eventos_cansancio',
                    data: eventosAleatorios
                });
            }
        }
        
        // 4. Procesar recuperación de lesiones
        if (typeof procesarRecuperacionLesiones === 'function') {
            const recuperaciones = procesarRecuperacionLesiones();
            if (recuperaciones.length > 0) {
                eventosDelDia.push({
                    tipo: 'recuperaciones',
                    data: recuperaciones
                });
            }
        }
        
        // 5. Mostrar todos los eventos del día
        if (eventosDelDia.length > 0) {
            this.mostrarEventosDelDia(eventosDelDia);
        } else {
            this.mostrarDiaSinEventos();
        }
        
        // Actualizar estadísticas de jugadores
        this.updatePlayersStats();
        
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
        
        this.updateDisplay();
        
        // Actualizar fecha para notificaciones si la función existe
        if (typeof updateCurrentDateForNotifications === 'function') {
            updateCurrentDateForNotifications(this.currentDate);
        }
    }
    
    jumpToDate(day) {
        const month = this.currentDate.getMonth();
        const year = this.currentDate.getFullYear();
        this.currentDate = new Date(year, month, day);
        this.updateDisplay();
        if (!this.isPaused) {
            this.start(); // Reiniciar el avance desde la nueva fecha
        }
    }
    
    updateDisplay() {
        this.updateDateInfo();
        this.updateCalendar();
        this.updateProgress();
    }
    
    updateDateInfo() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        this.currentDateElement.textContent = this.currentDate.toLocaleDateString('es-ES', options);
        
        const monthYear = this.currentDate.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long' 
        });
        this.yearMonthElement.textContent = monthYear;
    }
    
    updateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = this.currentDate.getDate();
        
        // Primer día del mes
        const firstDay = new Date(year, month, 1);
        // Último día del mes
        const lastDay = new Date(year, month + 1, 0);
        
        // Ajustar el primer día para que lunes sea 0
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;
        
        // Limpiar el grid
        this.daysGridElement.innerHTML = '';
        
        // Días del mes anterior
        const prevMonth = new Date(year, month, 0);
        for (let i = startDay - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(
                prevMonth.getDate() - i, 
                'other-month'
            );
            this.daysGridElement.appendChild(dayElement);
        }
        
        // Días del mes actual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const isToday = day === today;
            const dayElement = this.createDayElement(
                day, 
                isToday ? 'current' : ''
            );
            this.daysGridElement.appendChild(dayElement);
        }
        
        // Días del mes siguiente para completar la grilla
        const totalCells = this.daysGridElement.children.length;
        const remainingCells = 42 - totalCells; // 6 semanas × 7 días
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'other-month');
            this.daysGridElement.appendChild(dayElement);
        }
    }
    
    createDayElement(day, className = '') {
        const dayElement = document.createElement('div');
        dayElement.className = `day ${className}`;
        dayElement.textContent = day;
        return dayElement;
    }
    
    updateProgress() {
        const totalDays = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
        const currentDays = Math.ceil((this.currentDate - this.startDate) / (1000 * 60 * 60 * 24));
        const percentage = (currentDays / totalDays) * 100;
        
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `Progreso: ${currentDays} de ${totalDays} días (${percentage.toFixed(2)}%)`;
    }
    
    // ==================== FUNCIONES DE JUGADORES CON CALENDARIO ====================
    
    checkBirthdays() {
        const currentMonth = this.currentDate.getMonth() + 1;
        const currentDay = this.currentDate.getDate();
        let birthdayPlayers = [];
        let lastYearPlayers = []; // Jugadores que anuncian su último año
        let totalRetirements = 0;
        const retiredPlayers = [];
        
        // Obtener el club seleccionado del usuario
        const clubSeleccionado = localStorage.getItem("selectedClub");
        let clubIdSeleccionado = null;
        
        if (clubSeleccionado && typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.nombre === clubSeleccionado);
            if (club) {
                clubIdSeleccionado = club.id;
            }
        }
        
        // Procesar cada club
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = this.jugadoresPorClub[clubId];
            
            // Verificar cumpleaños
            for (let i = jugadoresClub.length - 1; i >= 0; i--) {
                const jugador = jugadoresClub[i];
                
                // Verificar si es el cumpleaños del jugador
                if (jugador.birthdayMonth === currentMonth && jugador.birthdayDay === currentDay) {
                    jugador.edad += 1;
                    
                    // Solo mostrar cumpleaños del club seleccionado
                    if (clubId === clubIdSeleccionado) {
                        birthdayPlayers.push({
                            nombre: jugador.nombre,
                            edad: jugador.edad,
                            club: this.getClubName(clubId)
                        });
                    }
                    
                    // Verificar si debe anunciar su último año (36+ años)
                    if (jugador.edad >= 36 && !jugador.ultimoAnio) {
                        jugador.ultimoAnio = true; // Marcar que ya anunció su último año
                        lastYearPlayers.push({
                            nombre: jugador.nombre,
                            edad: jugador.edad,
                            club: this.getClubName(clubId),
                            posicion: jugador.posicion,
                            general: jugador.general
                        });
                    }
                }
            }
        });
        
        // Procesar retiros solo en diciembre (final de temporada)
        if (currentMonth === 12) {
            const retirosDelMes = this.processMonthlyRetirements();
            retiredPlayers.push(...retirosDelMes.retiredPlayers);
            totalRetirements = retirosDelMes.totalRetirements;
        }
        
        // Guardar cambios en localStorage si hubo cambios
        if (birthdayPlayers.length > 0 || lastYearPlayers.length > 0) {
            this.savePlayersData();
        }
        
        // Generar nuevos jugadores para reemplazar retirados
        if (totalRetirements > 0) {
            this.generateReplacementPlayers(totalRetirements);
        }
        
        return {
            birthdayPlayers: birthdayPlayers,
            lastYearPlayers: lastYearPlayers,
            retiredPlayers: retiredPlayers
        };
    }
    
    // Nueva función para procesar retiros mensuales con límites
    processMonthlyRetirements() {
        const maxRetirementsPerMonth = 3; // Máximo 3 retiros por mes
        let retiredPlayers = [];
        let totalRetirements = 0;
        let candidatesForRetirement = [];
        
        // Recopilar candidatos para retiro
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = this.jugadoresPorClub[clubId];
            
            jugadoresClub.forEach((jugador, index) => {
                if (jugador.ultimoAnio && this.shouldPlayerRetireThisMonth(jugador)) {
                    candidatesForRetirement.push({
                        jugador: jugador,
                        clubId: clubId,
                        index: index
                    });
                }
            });
        });
        
        // Seleccionar aleatoriamente hasta el máximo permitido
        if (candidatesForRetirement.length > 0) {
            // Mezclar array aleatoriamente
            candidatesForRetirement.sort(() => Math.random() - 0.5);
            
            // Tomar solo los primeros hasta el máximo
            const retirementsToProcess = candidatesForRetirement.slice(0, maxRetirementsPerMonth);
            
            // Procesar retiros seleccionados
            retirementsToProcess.forEach(candidate => {
                const { jugador, clubId, index } = candidate;
                
                retiredPlayers.push({
                    nombre: jugador.nombre,
                    edad: jugador.edad,
                    club: this.getClubName(clubId),
                    posicion: jugador.posicion,
                    general: jugador.general
                });
                
                // Remover jugador del array (buscar índice actualizado)
                const jugadoresClub = this.jugadoresPorClub[clubId];
                const actualIndex = jugadoresClub.findIndex(j => j.id === jugador.id);
                if (actualIndex !== -1) {
                    jugadoresClub.splice(actualIndex, 1);
                    totalRetirements++;
                }
            });
        }
        
               return {
            retiredPlayers: retiredPlayers,
            totalRetirements: totalRetirements
        };
    }
    
    // Nueva función para determinar si un jugador se retira este mes
    shouldPlayerRetireThisMonth(jugador) {
        if (!jugador.ultimoAnio) return false;
        
        // Probabilidad basada en edad (solo para jugadores que ya anunciaron su último año)
        let retirementChance = 0;
        
        if (jugador.edad >= 36) retirementChance = 0.3; // 30%
        if (jugador.edad >= 38) retirementChance = 0.5; // 50%
        if (jugador.edad >= 40) retirementChance = 0.8; // 80%
        if (jugador.edad >= 42) retirementChance = 1.0; // 100%
        
        // Jugadores con mayor habilidad tienden a retirarse más tarde
        if (jugador.general >= 80) {
            retirementChance *= 0.7; // Reducir probabilidad para jugadores elite
        }
        
        return Math.random() < retirementChance;
    }
    
    generateReplacementPlayers(count) {
        if (count === 0) return;
        
        console.log(`👶 Generando ${count} jugadores jóvenes para reemplazar retirados`);
        
        // Distribuir nuevos jugadores entre los clubes
        const clubIds = Object.keys(this.jugadoresPorClub);
        let playersGenerated = 0;
        
        while (playersGenerated < count && clubIds.length > 0) {
            clubIds.forEach(clubId => {
                if (playersGenerated >= count) return;
                
                const newPlayer = this.generateYoungPlayer(clubId);
                this.jugadoresPorClub[clubId].push(newPlayer);
                playersGenerated++;
            });
        }
        
        this.savePlayersData();
    }
    
    generateYoungPlayer(clubId) {
        const maxId = this.getMaxPlayerId() + 1;
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const config = this.getConfigForClub(clubId);
        
        const edad = 16 + Math.floor(Math.random() * 7);
        const general = this.rand(config.generalMin, config.generalMax);
        const potencial = this.rand(Math.max(general, config.generalMin + 5), Math.min(95, config.generalMax + 10));
        const valor = this.calcularValorPorHabilidad(general, potencial, config);
        const sueldo = this.calcularSueldoPorValor(valor, config);
        
        const birthdayMonth = this.rand(1, 12);
        const birthdayDay = this.rand(1, new Date(2025, birthdayMonth, 0).getDate());
        
        return {
            id: maxId,
            clubId: clubId,
            nombre: `${nombre} ${apellido}`,
            edad: edad,
            birthdayMonth: birthdayMonth,
            birthdayDay: birthdayDay,
            posicion: posiciones[Math.floor(Math.random() * posiciones.length)],
            general: general,
            potencial: potencial,
            actitud: "Joven promesa",
            estadoFisico: this.rand(80, 95),
            cansancio: this.rand(0, 10),
            valorMercado: valor,
            sueldo: sueldo,
            contratoAnios: this.rand(2, 5),
            lesion: null,
            propensionLesiones: this.rand(10, 30), // Jóvenes menos propensos a lesiones
            sprint: this.rand(50, 95),
            regate: this.rand(50, 95),
            pase: this.rand(50, 95),
            tiro: this.rand(50, 95),
            defensa: this.rand(40, 90),
            resistencia: this.rand(60, 95)
        };
    }
    
    getMaxPlayerId() {
        let maxId = 0;
        Object.values(this.jugadoresPorClub).forEach(jugadores => {
            jugadores.forEach(jugador => {
                if (jugador.id > maxId) maxId = jugador.id;
            });
        });
        return maxId;
    }
    
    getConfigForClub(clubId) {
        const configPorLiga = {
            "55": { valorMin: 25000, valorMax: 180000, sueldoMin: 1800, sueldoMax: 12000, generalMin: 75, generalMax: 82 },
            "54": { valorMin: 18000, valorMax: 150000, sueldoMin: 1200, sueldoMax: 9000, generalMin: 74, generalMax: 80 },
            "57": { valorMin: 12000, valorMax: 120000, sueldoMin: 900, sueldoMax: 7500, generalMin: 70, generalMax: 77 },
            "56": { valorMin: 10000, valorMax: 100000, sueldoMin: 800, sueldoMax: 6500, generalMin: 68, generalMax: 75 },
            "598": { valorMin: 8000, valorMax: 85000, sueldoMin: 700, sueldoMax: 5500, generalMin: 69, generalMax: 76 },
            "593": { valorMin: 7000, valorMax: 75000, sueldoMin: 600, sueldoMax: 4800, generalMin: 68, generalMax: 74 },
            "51": { valorMin: 6000, valorMax: 65000, sueldoMin: 500, sueldoMax: 4200, generalMin: 65, generalMax: 72 },
            "595": { valorMin: 5000, valorMax: 55000, sueldoMin: 450, sueldoMax: 3800, generalMin: 65, generalMax: 72 },
            "58": { valorMin: 4000, valorMax: 45000, sueldoMin: 350, sueldoMax: 3000, generalMin: 60, generalMax: 67 },
            "591": { valorMin: 3500, valorMax: 40000, sueldoMin: 300, sueldoMax: 2500, generalMin: 60, generalMax: 68 }
        };
        
        const ligaId = clubId.split('-')[0];
        return configPorLiga[ligaId] || configPorLiga["51"];
    }
    
    getClubName(clubId) {
        // Intentar obtener el nombre del club desde el sistema de clubes
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    }
    
    savePlayersData() {
        localStorage.setItem("jugadoresPorClub", JSON.stringify(this.jugadoresPorClub));
    }
    
    updatePlayersStats() {
        const statsElement = document.getElementById('players-stats');
        if (!statsElement) return;
        
        let totalPlayers = 0;
        let totalClubs = 0;
        let avgAge = 0;
        let ageSum = 0;
        
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = this.jugadoresPorClub[clubId];
            totalPlayers += jugadoresClub.length;
            totalClubs++;
            
            jugadoresClub.forEach(jugador => {
                ageSum += jugador.edad;
            });
        });
        
        avgAge = totalPlayers > 0 ? (ageSum / totalPlayers).toFixed(1) : 0;
        
        statsElement.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">👥 Total Jugadores:</span>
                    <span class="stat-value">${totalPlayers}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">🏟️ Clubes:</span>
                    <span class="stat-value">${totalClubs}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">📊 Edad Promedio:</span>
                    <span class="stat-value">${avgAge} años</span>
                </div>
            </div>
        `;
    }
    
    // ==================== FUNCIONES PARA MOSTRAR EVENTOS DEL DÍA ====================
    
    mostrarEventosDelDia(eventosDelDia) {
        const logElement = document.getElementById('event-log');
        if (!logElement) return;
        
        const currentDateStr = this.currentDate.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        let logHTML = `<div class="day-events">
            <h4>📅 ${currentDateStr}</h4>`;
        
        eventosDelDia.forEach(evento => {
            switch (evento.tipo) {
                case 'cumpleanos':
                    logHTML += this.formatearEventosCumpleanos(evento.data);
                    break;
                case 'degradacion':
                    logHTML += this.formatearEventosDegradacion();
                    break;
                case 'eventos_cansancio':
                    logHTML += this.formatearEventosCansancio(evento.data);
                    break;
                case 'recuperaciones':
                    logHTML += this.formatearEventosRecuperacion(evento.data);
                    break;
            }
        });
        
        logHTML += `</div>`;
        logElement.innerHTML = logHTML;
    }
    
    mostrarDiaSinEventos() {
        const logElement = document.getElementById('event-log');
        if (!logElement) return;
        
        const currentDateStr = this.currentDate.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        logElement.innerHTML = `
            <div class="day-events">
                <h4>📅 ${currentDateStr}</h4>
                <p class="no-events">😴 Día tranquilo. Los jugadores descansan y se mantienen en forma.</p>
                <p class="degradation-info">📉 Degradación natural aplicada por inactividad (-0.05% nivel general)</p>
            </div>
        `;
    }
    
    formatearEventosCumpleanos(data) {
        let html = '';
        
        if (data.birthdayPlayers.length > 0) {
            html += `<div class="event-section birthday-section">
                <h5>🎂 Cumpleaños en tu Club (${data.birthdayPlayers.length})</h5>
                <ul>`;
            
            data.birthdayPlayers.forEach(player => {
                html += `<li>🎉 ${player.nombre} cumple ${player.edad} años - ${player.club}</li>`;
                
                // Enviar al sistema de notificaciones si la función existe
                if (typeof addBirthdayEvent === 'function') {
                    addBirthdayEvent({
                        nombre: player.nombre,
                        edad: player.edad,
                        club: player.club
                    });
                }
            });
            
            html += `</ul></div>`;
        }
        
        if (data.lastYearPlayers && data.lastYearPlayers.length > 0) {
            html += `<div class="event-section last-year-section">
                <h5>📢 Anuncios de Último Año (${data.lastYearPlayers.length})</h5>
                <ul>`;
            
            data.lastYearPlayers.forEach(player => {
                html += `<li>📰 ${player.nombre} (${player.edad} años, ${player.posicion}) anuncia que esta será su última temporada - ${player.club}</li>`;
            });
            
            html += `</ul></div>`;
        }
        
        if (data.retiredPlayers.length > 0) {
            html += `<div class="event-section retirement-section">
                <h5>👴 Retiros Oficiales (${data.retiredPlayers.length})</h5>
                <ul>`;
            
            data.retiredPlayers.forEach(player => {
                html += `<li>👋 ${player.nombre} (${player.edad} años, ${player.posicion}, GEN: ${player.general}) se retira oficialmente del fútbol - ${player.club}</li>`;
                
                // Enviar al sistema de notificaciones si la función existe
                if (typeof addRetirementEvent === 'function') {
                    addRetirementEvent({
                        nombre: player.nombre,
                        edad: player.edad,
                        posicion: player.posicion,
                        general: player.general,
                        club: player.club
                    });
                }
            });
            
            html += `</ul></div>`;
        }
        
        return html;
    }
    
    formatearEventosDegradacion() {
        return `<div class="event-section degradation-section">
            <h5>📉 Degradación por Inactividad</h5>
            <p>Los jugadores pierden forma física gradualmente (-0.05% nivel general, -0.1 estado físico)</p>
            <p>Recuperación natural del cansancio (+2 puntos)</p>
        </div>`;
    }
    
    formatearEventosCansancio(eventos) {
        let html = `<div class="event-section fatigue-section">
            <h5>🍺 Eventos de Indisciplina (${eventos.length})</h5>
            <ul>`;
        
        eventos.forEach(evento => {
            html += `<li>😅 ${evento.jugador}: ${evento.evento} - ${evento.descripcion}</li>`;
        });
        
        html += `</ul></div>`;
        return html;
    }
    
    formatearEventosRecuperacion(recuperaciones) {
        let html = `<div class="event-section recovery-section">
            <h5>🏥 Recuperaciones de Lesiones (${recuperaciones.length})</h5>
            <ul>`;
        
        recuperaciones.forEach(recuperacion => {
            html += `<li>✅ ${recuperacion.nombre} se recupera de: ${recuperacion.lesion}</li>`;
        });
        
        html += `</ul></div>`;
        return html;
    }
    
    clearEventLog() {
        const logElement = document.getElementById('event-log');
        if (logElement) {
            logElement.innerHTML = '<p class="no-events">Reiniciando calendario...</p>';
        }
    }
    
    // Funciones auxiliares para cálculos
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
        calcularValorPorHabilidad(general, potencial, config) {
        let factorBase = 1.0;
        const rangoGeneral = config.generalMax - config.generalMin;
        const posicionEnRango = (general - config.generalMin) / rangoGeneral;
        
        if (posicionEnRango >= 0.9) factorBase = 1.4;
        else if (posicionEnRango >= 0.75) factorBase = 1.2;
        else if (posicionEnRango >= 0.6) factorBase = 1.1;
        else if (posicionEnRango >= 0.4) factorBase = 1.0;
        else if (posicionEnRango >= 0.2) factorBase = 0.9;
        else factorBase = 0.8;
        
        let factorPotencial = 1.0;
        if (potencial >= 90) factorPotencial = 1.3;
        else if (potencial >= 85) factorPotencial = 1.2;
        else if (potencial >= 80) factorPotencial = 1.1;
        
        const rangoValor = config.valorMax - config.valorMin;
        const valorBase = config.valorMin + (rangoValor * posicionEnRango);
        
        return Math.round(valorBase * factorBase * factorPotencial);
    }
    
    calcularSueldoPorValor(valor, config) {
        const porcentajeValor = (valor - config.valorMin) / (config.valorMax - config.valorMin);
        const rangoSueldo = config.sueldoMax - config.sueldoMin;
        const sueldoBase = config.sueldoMin + (rangoSueldo * porcentajeValor);
        
        const variacion = sueldoBase * 0.2;
        const sueldoFinal = sueldoBase + this.rand(-variacion, variacion);
        
        return Math.max(config.sueldoMin, Math.round(sueldoFinal));
    }
}

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AutoCalendar();
});

// Función para ir a la página de notificaciones
function goToNotifications() {
    window.location.href = "notifications.html";
}


