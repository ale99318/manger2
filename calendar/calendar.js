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
        this.currentDateElement = document.getElementById('current-date');
        this.yearMonthElement = document.getElementById('year-month');
        this.daysGridElement = document.getElementById('days-grid');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
    }
    
    setupEventListeners() {
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
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
            this.isPaused = false;
        } else {
            this.stop();
            this.pauseBtn.textContent = 'Continuar';
            this.isPaused = true;
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
        // Avanzar un día
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        // Procesar eventos del día automáticamente
        this.processDay();
        
        // Actualizar la visualización
        this.updateDisplay();
        
        // Reiniciar si llegamos al final
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
    }
    
    processDay() {
        const currentMonth = this.currentDate.getMonth() + 1;
        const currentDay = this.currentDate.getDate();
        const currentYear = this.currentDate.getFullYear();
        
        console.log(`📅 ${currentDay}/${currentMonth}/${currentYear}`);
        
        // 1. Procesar cumpleaños automáticamente
        this.processBirthdays(currentMonth, currentDay);
        
        // 2. Procesar retiros usando el módulo especializado
        this.processRetirements();
        
        // 3. Procesar lesiones aleatorias del día
        this.processRandomInjuries();
        
        // 4. Procesar recuperación de lesiones
        this.processInjuryRecovery();
        
        // 5. Aplicar degradación por inactividad
        this.applyDegradation();
        
        // 6. Eventos aleatorios de indisciplina
        this.processRandomEvents();
    }
    
    processBirthdays(month, day) {
        // Obtener jugadores del localStorage
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        const clubSeleccionado = localStorage.getItem("selectedClub");
        let birthdayCount = 0;
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach(jugador => {
                if (jugador.birthdayMonth === month && jugador.birthdayDay === day) {
                    jugador.edad += 1; // Aumentar edad automáticamente
                    birthdayCount++;
                    
                    // Solo mostrar cumpleaños del club seleccionado
                    if (this.getClubName(clubId) === clubSeleccionado) {
                        console.log(`🎂 ${jugador.nombre} cumple ${jugador.edad} años - ${clubSeleccionado}`);
                    }
                    
                    // Marcar para posible retiro si tiene 36+ años y es de nivel 80+
                    if (jugador.edad >= 36 && !jugador.ultimoAnio && jugador.general >= 80) {
                        jugador.ultimoAnio = true;
                        console.log(`📢 ${jugador.nombre} (${jugador.general} GEN) anuncia que será su última temporada - ${clubSeleccionado}`);
                    }
                }
            });
        });
        
        // Guardar cambios si hubo cumpleaños
        if (birthdayCount > 0) {
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        }
    }
    
    processRetirements() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        
        // Usar el módulo de retiros
        const retiredPlayers = retiroManager.checkRetirements(this.currentDate, jugadoresPorClub);
        
        // Mostrar retiros en consola
        retiredPlayers.forEach(retiro => {
            console.log(`👋 ${retiro.nombre} (${retiro.edad} años, ${retiro.posicion}) se retira: ${retiro.razon} - ${retiro.club}`);
        });
        
        // Guardar cambios si hubo retiros
        if (retiredPlayers.length > 0) {
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        }
    }
    
    // ==================== NUEVO: PROCESAR LESIONES ALEATORIAS ====================
    processRandomInjuries() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        const clubSeleccionado = localStorage.getItem("selectedClub");
        
        // Usar el módulo de lesiones para procesar lesiones del día
        if (typeof lesionesManager !== 'undefined') {
            const lesionesDelDia = lesionesManager.procesarLesionesDelDia(jugadoresPorClub);
            
            // Mostrar lesiones con filtros realistas
            lesionesDelDia.forEach(lesionData => {
                let mostrarLesion = false;
                
                // 1. Siempre mostrar lesiones de tu club
                if (lesionData.club === clubSeleccionado) {
                    mostrarLesion = true;
                }
                // 2. Mostrar lesiones de jugadores estrella (80+ general)
                else if (lesionData.general >= 80) {
                    mostrarLesion = true;
                }
                // 3. Mostrar lesiones graves/críticas (son noticia)
                else if (lesionData.gravedad === 'grave' || lesionData.gravedad === 'crítica') {
                    mostrarLesion = true;
                }
                
                if (mostrarLesion) {
                    if (lesionData.club === clubSeleccionado) {
                        // Tu club: mensaje simple
                        console.log(`🚑 ${lesionData.jugador} se lesiona: ${lesionData.lesion} (${lesionData.dias} días)`);
                    } else {
                        // Otros clubes: incluir club y detalles
                        const detalles = lesionData.general >= 80 ? ` (${lesionData.general} GEN)` : '';
                        console.log(`🚑 ${lesionData.jugador}${detalles} se lesiona: ${lesionData.lesion} (${lesionData.dias} días) - ${lesionData.club}`);
                    }
                }
            });
            
            // Guardar cambios si hubo lesiones
            if (lesionesDelDia.length > 0) {
                localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            }
        }
    }
    
    // ==================== MEJORADO: RECUPERACIONES CON FILTROS ====================
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
                        // FILTROS PARA MOSTRAR RECUPERACIONES
                        let mostrarRecuperacion = false;
                        
                        // 1. Siempre mostrar jugadores de tu club
                        if (clubName === clubSeleccionado) {
                            mostrarRecuperacion = true;
                        }
                        // 2. Mostrar jugadores estrella (80+ general) de otros clubes
                        else if (jugador.general >= 80) {
                            mostrarRecuperacion = true;
                        }
                        // 3. Mostrar lesiones graves/críticas (son noticia)
                        else if (jugador.lesion.gravedad === 'grave' || jugador.lesion.gravedad === 'crítica') {
                            mostrarRecuperacion = true;
                        }
                        
                        // Solo mostrar si cumple los criterios
                        if (mostrarRecuperacion) {
                            if (clubName === clubSeleccionado) {
                                // Tu club: mensaje simple
                                console.log(`🏥 ${jugador.nombre} se recupera de: ${jugador.lesion.nombre}`);
                            } else {
                                // Otros clubes: incluir club y nivel si es estrella
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
                // Degradación muy pequeña por día
                const degradacion = jugador.general * 0.0005; // 0.05% por día
                jugador.general = Math.max(jugador.general - degradacion, jugador.general * 0.8);
                
                // Recuperación de cansancio
                if (jugador.cansancio > 0) {
                    jugador.cansancio = Math.max(jugador.cansancio - 1, 0);
                }
            });
        });
        
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
    }
    
    processRandomEvents() {
        // 1% de probabilidad de evento aleatorio por día
        if (Math.random() < 0.01) {
            const eventos = ['Fiesta nocturna', 'Desvelada', 'Ampay en discoteca'];
            const evento = eventos[Math.floor(Math.random() * eventos.length)];
            console.log(`🍺 Evento de indisciplina: ${evento}`);
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
        this.updateCalendar();
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
}

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AutoCalendar();
});
