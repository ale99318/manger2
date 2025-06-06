// ==================== CALENDARIO AUTOMÁTICO ====================

class AutoCalendar {
    constructor() {
        this.startDate = new Date(2025, 0, 1); // 1 de enero 2025
        this.endDate = new Date(2040, 11, 31); // 31 de diciembre 2040
        this.currentDate = new Date(this.startDate);
        this.interval = null;
        this.isPaused = false;
        this.intervalTime = 3000; // 3 segundos por día
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.start(); // Iniciar automáticamente
    }
    
    initializeElements() {
        this.currentDateFullElement = document.getElementById('current-date-full');
        this.yearMonthElement = document.getElementById('year-month');
        this.weekDaysElement = document.getElementById('week-days');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
    }
    
    setupEventListeners() {
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.togglePause());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.reset());
        }
    }
    
    start() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
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
            this.isPaused = false;
            if (this.pauseBtn) this.pauseBtn.textContent = 'Pausar';
            this.start();
        } else {
            this.isPaused = true;
            if (this.pauseBtn) this.pauseBtn.textContent = 'Continuar';
            this.stop();
        }
    }
    
    reset() {
        this.stop();
        this.currentDate = new Date(this.startDate);
        this.isPaused = false;
        if (this.pauseBtn) this.pauseBtn.textContent = 'Pausar';
        this.updateDisplay();
        this.start();
    }
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.processDay();
        this.updateDisplay();
        
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
    }
    
    processDay() {
        const currentMonth = this.currentDate.getMonth() + 1;
        const currentDay = this.currentDate.getDate();
        const currentYear = this.currentDate.getFullYear();
        
        console.log(`📅 ${currentDay}/${currentMonth}/${currentYear}`);
        
        // Validar que existan los datos antes de procesar
        try {
            this.processBirthdays(currentMonth, currentDay);
            this.processRetirements();
            this.processRandomInjuries();
            this.processInjuryRecovery();
            this.applyDegradation();
            this.processRandomEvents();
        } catch (error) {
            console.error('Error procesando el día:', error);
        }
    }

    // CORREGIDO: Obtener partidos de una fecha específica
    getMatchesForDate(fecha) {
        const partidos = [];
        
        // CORREGIDO: Verificar si ligaPeruana está disponible
        if (typeof ligaPeruana === 'undefined' || !ligaPeruana) {
            return partidos;
        }
        
        try {
            // Buscar en Apertura
            if (ligaPeruana.fixtures?.apertura?.fechas) {
                ligaPeruana.fixtures.apertura.fechas.forEach(fechaFixture => {
                    if (fechaFixture.partidos) {
                        fechaFixture.partidos.forEach(partido => {
                            if (partido.fecha === fecha) {
                                partidos.push({ 
                                    ...partido, 
                                    torneo: 'apertura', 
                                    fechaNumero: fechaFixture.numero 
                                });
                            }
                        });
                    }
                });
            }
            
            // Buscar en Clausura
            if (ligaPeruana.fixtures?.clausura?.fechas) {
                ligaPeruana.fixtures.clausura.fechas.forEach(fechaFixture => {
                    if (fechaFixture.partidos) {
                        fechaFixture.partidos.forEach(partido => {
                            if (partido.fecha === fecha) {
                                partidos.push({ 
                                    ...partido, 
                                    torneo: 'clausura', 
                                    fechaNumero: fechaFixture.numero 
                                });
                            }
                        });
                    }
                });
            }
            
            // Buscar en Playoffs
            if (ligaPeruana.fixtures?.playoffs) {
                const playoffs = ligaPeruana.fixtures.playoffs;
                if (playoffs.semifinales?.partidos) {
                    playoffs.semifinales.partidos.forEach(partido => {
                        if (partido.fecha === fecha && partido.local && partido.visitante) {
                            partidos.push({ ...partido, torneo: 'playoffs' });
                        }
                    });
                }
                if (playoffs.final?.partidos) {
                    playoffs.final.partidos.forEach(partido => {
                        if (partido.fecha === fecha && partido.local && partido.visitante) {
                            partidos.push({ ...partido, torneo: 'playoffs' });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error obteniendo partidos:', error);
        }
        
        return partidos;
    }

    // Convertir nombre de club a ID
    getClubIdFromName(clubName) {
        if (typeof clubes !== 'undefined' && clubes) {
            const club = clubes.find(c => c.nombre === clubName);
            return club ? club.id : null;
        }
        return null;
    }

    // UNIFICADO: Convertir ID de club a nombre
    getClubNameFromId(clubId) {
        if (typeof clubes !== 'undefined' && clubes) {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    }

    // Obtener nombre del torneo
    getTournamentName(partido) {
        switch(partido.torneo) {
            case 'apertura': return `Apertura - Fecha ${partido.fechaNumero}`;
            case 'clausura': return `Clausura - Fecha ${partido.fechaNumero}`;
            case 'playoffs': 
                if (partido.fase === 'semifinal') {
                    return `Semifinal ${partido.semifinal} - ${partido.partido}`;
                } else if (partido.fase === 'final') {
                    return `Final - ${partido.partido}`;
                }
                return 'Playoffs';
            default: return 'Liga1';
        }
    }
    
    processBirthdays(month, day) {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            let birthdayCount = 0;
            
            Object.keys(jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = jugadoresPorClub[clubId];
                
                if (Array.isArray(jugadoresClub)) {
                    jugadoresClub.forEach(jugador => {
                        if (jugador.birthdayMonth === month && jugador.birthdayDay === day) {
                            jugador.edad += 1;
                            birthdayCount++;
                            
                            if (this.getClubNameFromId(clubId) === clubSeleccionado) {
                                console.log(`🎂 ${jugador.nombre} cumple ${jugador.edad} años - ${clubSeleccionado}`);
                            }
                            
                            if (jugador.edad >= 36 && !jugador.ultimoAnio && jugador.general >= 80) {
                                jugador.ultimoAnio = true;
                                console.log(`📢 ${jugador.nombre} (${jugador.general} GEN) anuncia que será su última temporada - ${clubSeleccionado}`);
                            }
                        }
                    });
                }
            });
            
            if (birthdayCount > 0) {
                localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            }
        } catch (error) {
            console.error('Error procesando cumpleaños:', error);
        }
    }
    
    processRetirements() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            
            if (typeof retiroManager !== 'undefined' && retiroManager) {
                const retiredPlayers = retiroManager.checkRetirements(this.currentDate, jugadoresPorClub);
                
                retiredPlayers.forEach(retiro => {
                    console.log(`👋 ${retiro.nombre} (${retiro.edad} años, ${retiro.posicion}) se retira: ${retiro.razon} - ${retiro.club}`);
                });
                
                if (retiredPlayers.length > 0) {
                    localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
                }
            }
        } catch (error) {
            console.error('Error procesando retiros:', error);
        }
    }
    
    processRandomInjuries() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            
            if (typeof lesionesManager !== 'undefined' && lesionesManager) {
                const lesionesDelDia = lesionesManager.procesarLesionesDelDia(jugadoresPorClub);
                
                lesionesDelDia.forEach(lesionData => {
                    let mostrarLesion = false;
                    
                    if (lesionData.club === clubSeleccionado) {
                        mostrarLesion = true;
                    } else if (lesionData.general >= 80) {
                        mostrarLesion = true;
                    } else if (lesionData.gravedad === 'grave' || lesionData.gravedad === 'crítica') {
                        mostrarLesion = true;
                    }
                    
                    if (mostrarLesion) {
                        if (lesionData.club === clubSeleccionado) {
                            console.log(`🚑 ${lesionData.jugador} se lesiona: ${lesionData.lesion} (${lesionData.dias} días)`);
                        } else {
                            const detalles = lesionData.general >= 80 ? ` (${lesionData.general} GEN)` : '';
                            console.log(`🚑 ${lesionData.jugador}${detalles} se lesiona: ${lesionData.lesion} (${lesionData.dias} días) - ${lesionData.club}`);
                        }
                    }
                });
                
                if (lesionesDelDia.length > 0) {
                    localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
                }
            }
        } catch (error) {
            console.error('Error procesando lesiones:', error);
        }
    }
    
    processInjuryRecovery() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            let recoveries = 0;
            
            Object.keys(jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = jugadoresPorClub[clubId];
                const clubName = this.getClubNameFromId(clubId);
                
                if (Array.isArray(jugadoresClub)) {
                    jugadoresClub.forEach(jugador => {
                        if (jugador.lesion && jugador.lesion.diasRestantes > 0) {
                            jugador.lesion.diasRestantes--;
                            
                            if (jugador.lesion.diasRestantes <= 0) {
                                let mostrarRecuperacion = false;
                                
                                if (clubName === clubSeleccionado) {
                                    mostrarRecuperacion = true;
                                } else if (jugador.general >= 80) {
                                    mostrarRecuperacion = true;
                                } else if (jugador.lesion.gravedad === 'grave' || jugador.lesion.gravedad === 'crítica') {
                                    mostrarRecuperacion = true;
                                }
                                
                                if (mostrarRecuperacion) {
                                    if (clubName === clubSeleccionado) {
                                        console.log(`🏥 ${jugador.nombre} se recupera de: ${jugador.lesion.nombre}`);
                                    } else {
                                        const detalles = jugador.general >= 80 ? ` (${jugador.general} GEN)` : '';
                                        console.log(`🏥 ${jugador.nombre}${detalles} se recupera de: ${jugador.lesion.nombre} - ${clubName}`);
                                    }
                                }
                                
                                jugador.lesion = null;
                                recoveries++;
                            }
                        }
                    });
                }
            });
            
            if (recoveries > 0) {
                localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            }
                    } catch (error) {
            console.error('Error procesando recuperaciones:', error);
        }
    }
    
    applyDegradation() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            
            Object.keys(jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = jugadoresPorClub[clubId];
                
                if (Array.isArray(jugadoresClub)) {
                    jugadoresClub.forEach(jugador => {
                        const degradacion = jugador.general * 0.0005;
                        jugador.general = Math.max(jugador.general - degradacion, jugador.general * 0.8);
                        
                        if (jugador.cansancio > 0) {
                            jugador.cansancio = Math.max(jugador.cansancio - 1, 0);
                        }
                    });
                }
            });
            
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        } catch (error) {
            console.error('Error aplicando degradación:', error);
        }
    }
    
    processRandomEvents() {
        try {
            if (typeof eventsManager !== 'undefined' && eventsManager) {
                const eventosDelDia = eventsManager.procesarEventosDelDia();
                
                eventosDelDia.forEach(evento => {
                    console.log(`🍺 Evento de indisciplina: ${evento.nombre}`);
                });
            }
        } catch (error) {
            console.error('Error procesando eventos:', error);
        }
    }
    
    updateDisplay() {
        this.updateDateInfo();
        this.updateWeekCalendar();
    }
    
    updateDateInfo() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        if (this.currentDateFullElement) {
            this.currentDateFullElement.textContent = this.currentDate.toLocaleDateString('es-ES', options);
        }
        
        if (this.yearMonthElement) {
            const monthYear = this.currentDate.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long' 
            });
            this.yearMonthElement.textContent = monthYear;
        }
    }
    
    updateWeekCalendar() {
        if (!this.weekDaysElement) return;
        
        try {
            const currentDate = new Date(this.currentDate);
            const dayOfWeek = currentDate.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            
            const monday = new Date(currentDate);
            monday.setDate(currentDate.getDate() + mondayOffset);
            
            const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            
            this.weekDaysElement.innerHTML = '';
            
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(monday);
                dayDate.setDate(monday.getDate() + i);
                
                const dayElement = this.createWeekDayElement(dayDate, dayNames[i]);
                this.weekDaysElement.appendChild(dayElement);
            }
            
            setTimeout(() => {
                this.applyWeekTransitions();
            }, 50);
        } catch (error) {
            console.error('Error actualizando calendario semanal:', error);
        }
    }
    
    createWeekDayElement(date, dayName) {
        const dayElement = document.createElement('div');
        dayElement.className = 'week-day';
        
        const today = new Date(this.currentDate);
        const isToday = this.isSameDay(date, today);
        const isPast = date < today;
        const isFuture = date > today;
        
        if (isToday) {
            dayElement.classList.add('current');
        } else if (isPast) {
            dayElement.classList.add('past');
        } else if (isFuture) {
            dayElement.classList.add('future');
        }

        // CORREGIDO: Verificar si hay partidos este día para mi club
        try {
            const fechaStr = date.toISOString().split('T')[0];
            const partidosDelDia = this.getMatchesForDate(fechaStr);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            const clubSeleccionadoId = this.getClubIdFromName(clubSeleccionado);
            
            const partidoDelClub = partidosDelDia.find(partido => 
                partido.local === clubSeleccionadoId || partido.visitante === clubSeleccionadoId
            );
            
            const dayNameElement = document.createElement('div');
            dayNameElement.className = 'week-day-name';
            dayNameElement.textContent = dayName;
            
            const dayNumberElement = document.createElement('div');
            dayNumberElement.className = 'week-day-number';
            dayNumberElement.textContent = date.getDate();
            
            dayElement.appendChild(dayNameElement);
            dayElement.appendChild(dayNumberElement);
            
            // CORREGIDO: Si hay partido del club, mostrar información del rival
            if (partidoDelClub) {
                dayElement.classList.add('match-day');
                
                const rivalId = partidoDelClub.local === clubSeleccionadoId 
                    ? partidoDelClub.visitante 
                    : partidoDelClub.local;
                
                const rivalNombre = this.getClubNameFromId(rivalId);
                const esLocal = partidoDelClub.local === clubSeleccionadoId;
                
                const matchInfoElement = document.createElement('div');
                matchInfoElement.className = 'match-info';
                
                const rivalElement = document.createElement('div');
                rivalElement.className = 'rival-name';
                rivalElement.textContent = `${esLocal ? 'vs' : '@'} ${rivalNombre}`;
                
                // CORREGIDO: Validar que existe la hora
                if (partidoDelClub.hora) {
                    const horaElement = document.createElement('div');
                    horaElement.className = 'match-time';
                    horaElement.textContent = partidoDelClub.hora;
                    matchInfoElement.appendChild(horaElement);
                }
                
                const torneoElement = document.createElement('div');
                torneoElement.className = 'match-tournament';
                torneoElement.textContent = this.getTournamentName(partidoDelClub);
                
                matchInfoElement.appendChild(rivalElement);
                matchInfoElement.appendChild(torneoElement);
                
                dayElement.appendChild(matchInfoElement);
            }
            
            dayElement.setAttribute('data-date', date.toISOString().split('T')[0]);
            dayElement.setAttribute('data-day-name', dayName);
            
        } catch (error) {
            console.error('Error creando elemento del día:', error);
            
            // Fallback: crear elemento básico sin información de partidos
            const dayNameElement = document.createElement('div');
            dayNameElement.className = 'week-day-name';
            dayNameElement.textContent = dayName;
            
            const dayNumberElement = document.createElement('div');
            dayNumberElement.className = 'week-day-number';
            dayNumberElement.textContent = date.getDate();
            
            dayElement.appendChild(dayNameElement);
            dayElement.appendChild(dayNumberElement);
        }
        
        return dayElement;
    }
    
    applyWeekTransitions() {
        if (!this.weekDaysElement) return;
        
        try {
            const weekDays = this.weekDaysElement.querySelectorAll('.week-day');
            
            weekDays.forEach((dayElement, index) => {
                dayElement.style.transitionDelay = `${index * 0.1}s`;
                dayElement.offsetHeight; // Force reflow
                dayElement.classList.add('animated');
            });
            
            setTimeout(() => {
                weekDays.forEach(dayElement => {
                    dayElement.style.transitionDelay = '';
                });
            }, 1000);
        } catch (error) {
            console.error('Error aplicando transiciones:', error);
        }
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // NUEVO MÉTODO: Destructor para limpiar intervalos
    destroy() {
        this.stop();
        if (this.pauseBtn) {
            this.pauseBtn.removeEventListener('click', this.togglePause);
        }
        if (this.resetBtn) {
            this.resetBtn.removeEventListener('click', this.reset);
        }
    }
}

// CORREGIDO: Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que existen los elementos necesarios
    const requiredElements = [
        'current-date-full',
        'year-month', 
        'week-days'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('Elementos faltantes para el calendario:', missingElements);
        // Aún así inicializar, pero con advertencia
    }
    
    try {
        window.autoCalendar = new AutoCalendar();
    } catch (error) {
        console.error('Error inicializando AutoCalendar:', error);
    }
});

// AÑADIDO: Limpiar cuando se cierre la página
window.addEventListener('beforeunload', () => {
    if (window.autoCalendar) {
        window.autoCalendar.destroy();
    }
});
