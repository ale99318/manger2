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
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
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
            this.pauseBtn.textContent = 'Pausar';
            this.start();
        } else {
            this.isPaused = true;
            this.pauseBtn.textContent = 'Continuar';
            this.stop();
        }
    }
    
    reset() {
        this.stop();
        this.currentDate = new Date(this.startDate);
        this.isPaused = false;
        this.pauseBtn.textContent = 'Pausar';
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
        
        this.processBirthdays(currentMonth, currentDay);
        this.processRetirements();
        this.processRandomInjuries();
        this.processInjuryRecovery();
        this.applyDegradation();
        this.processRandomEvents();
    }

    // NUEVO MÉTODO: Obtener partidos de una fecha específica
    getMatchesForDate(fecha) {
        const partidos = [];
        
        // Verificar si ligaPeruana está disponible
        if (typeof ligaPeruana === 'undefined') {
            return partidos;
        }
        
        // Buscar en Apertura
        if (ligaPeruana.fixtures && ligaPeruana.fixtures.apertura && ligaPeruana.fixtures.apertura.fechas) {
            ligaPeruana.fixtures.apertura.fechas.forEach(fechaFixture => {
                fechaFixture.partidos.forEach(partido => {
                    if (partido.fecha === fecha) {
                        partidos.push({ ...partido, torneo: 'apertura', fechaNumero: fechaFixture.numero });
                    }
                });
            });
        }
        
        // Buscar en Clausura
        if (ligaPeruana.fixtures && ligaPeruana.fixtures.clausura && ligaPeruana.fixtures.clausura.fechas) {
            ligaPeruana.fixtures.clausura.fechas.forEach(fechaFixture => {
                fechaFixture.partidos.forEach(partido => {
                    if (partido.fecha === fecha) {
                        partidos.push({ ...partido, torneo: 'clausura', fechaNumero: fechaFixture.numero });
                    }
                });
            });
        }
        
        // Buscar en Playoffs
        if (ligaPeruana.fixtures && ligaPeruana.fixtures.playoffs) {
            const playoffs = ligaPeruana.fixtures.playoffs;
            if (playoffs.semifinales && playoffs.final) {
                [...playoffs.semifinales.partidos, ...playoffs.final.partidos].forEach(partido => {
                    if (partido.fecha === fecha && partido.local && partido.visitante) {
                        partidos.push({ ...partido, torneo: 'playoffs' });
                    }
                });
            }
        }
        
        return partidos;
    }

    // NUEVO MÉTODO: Convertir nombre de club a ID
    getClubIdFromName(clubName) {
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.nombre === clubName);
            return club ? club.id : null;
        }
        return null;
    }

    // NUEVO MÉTODO: Convertir ID de club a nombre
    getClubNameFromId(clubId) {
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    }

    // NUEVO MÉTODO: Obtener nombre del torneo
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
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        const clubSeleccionado = localStorage.getItem("selectedClub");
        let birthdayCount = 0;
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach(jugador => {
                if (jugador.birthdayMonth === month && jugador.birthdayDay === day) {
                    jugador.edad += 1;
                    birthdayCount++;
                    
                    if (this.getClubName(clubId) === clubSeleccionado) {
                        console.log(`🎂 ${jugador.nombre} cumple ${jugador.edad} años - ${clubSeleccionado}`);
                    }
                    
                    if (jugador.edad >= 36 && !jugador.ultimoAnio && jugador.general >= 80) {
                        jugador.ultimoAnio = true;
                        console.log(`📢 ${jugador.nombre} (${jugador.general} GEN) anuncia que será su última temporada - ${clubSeleccionado}`);
                    }
                }
            });
        });
        
        if (birthdayCount > 0) {
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        }
    }
    
    processRetirements() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        
        if (typeof retiroManager !== 'undefined') {
            const retiredPlayers = retiroManager.checkRetirements(this.currentDate, jugadoresPorClub);
            
            retiredPlayers.forEach(retiro => {
                console.log(`👋 ${retiro.nombre} (${retiro.edad} años, ${retiro.posicion}) se retira: ${retiro.razon} - ${retiro.club}`);
            });
            
            if (retiredPlayers.length > 0) {
                localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            }
        }
    }
    
    processRandomInjuries() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        const clubSeleccionado = localStorage.getItem("selectedClub");
        
        if (typeof lesionesManager !== 'undefined') {
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
    }
    
    processInjuryRecovery() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        const clubSeleccionado = localStorage.getItem("selectedClub");
        let recoveries = 0;
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            const clubName = this.getClubName(clubId);
            
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
        });
        
        if (recoveries > 0) {
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        }
    }
    
    applyDegradation() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach(jugador => {
                const degradacion = jugador.general * 0.0005;
                jugador.general = Math.max(jugador.general - degradacion, jugador.general * 0.8);
                
                if (jugador.cansancio > 0) {
                    jugador.cansancio = Math.max(jugador.cansancio - 1, 0);
                }
            });
        });
        
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
    }
    
    processRandomEvents() {
        if (typeof eventsManager !== 'undefined') {
            const eventosDelDia = eventsManager.procesarEventosDelDia();
            
            eventosDelDia.forEach(evento => {
                console.log(`🍺 Evento de indisciplina: ${evento.nombre}`);
            });
        }
    }
    
    getClubName(clubId) {
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
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
        
        const monthYear = this.currentDate.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long' 
        });
        this.yearMonthElement.textContent = monthYear;
    }
    
    updateWeekCalendar() {
        if (!this.weekDaysElement) return;
                
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

        // NUEVO: Verificar si hay partidos este día para mi club
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
        
        // NUEVO: Si hay partido del club, mostrar información del rival
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
            
            const horaElement = document.createElement('div');
            horaElement.className = 'match-time';
            horaElement.textContent = partidoDelClub.hora;
            
            const torneoElement = document.createElement('div');
            torneoElement.className = 'match-tournament';
            torneoElement.textContent = this.getTournamentName(partidoDelClub);
            
            matchInfoElement.appendChild(rivalElement);
            matchInfoElement.appendChild(horaElement);
            matchInfoElement.appendChild(torneoElement);
            
            dayElement.appendChild(matchInfoElement);
        }
        
        dayElement.setAttribute('data-date', date.toISOString().split('T')[0]);
        dayElement.setAttribute('data-day-name', dayName);
        
        return dayElement;
    }
    
    applyWeekTransitions() {
        const weekDays = this.weekDaysElement.querySelectorAll('.week-day');
        
        weekDays.forEach((dayElement, index) => {
            dayElement.style.transitionDelay = `${index * 0.1}s`;
            dayElement.offsetHeight;
            dayElement.classList.add('animated');
        });
        
        setTimeout(() => {
            weekDays.forEach(dayElement => {
                dayElement.style.transitionDelay = '';
            });
        }, 1000);
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
}

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AutoCalendar();
});
