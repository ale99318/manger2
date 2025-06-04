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
        // Eliminar referencia a newsContentElement
    }
    
    setupEventListeners() {
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    start() {
        // SIEMPRE limpiar cualquier intervalo existente antes de crear uno nuevo
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        // Solo crear nuevo intervalo si no está pausado
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
            // Reanudar
            this.isPaused = false;
            this.pauseBtn.textContent = 'Pausar';
            this.start(); // Esto ya limpia intervalos anteriores
        } else {
            // Pausar
            this.isPaused = true;
            this.pauseBtn.textContent = 'Continuar';
            this.stop(); // Limpiar intervalo actual
        }
    }
    
    reset() {
        this.stop(); // Limpiar intervalo
        this.currentDate = new Date(this.startDate);
        this.isPaused = false;
        this.pauseBtn.textContent = 'Pausar';
        this.updateDisplay();
        this.start(); // Iniciar limpiamente
    }
    
    nextDay() {
        // Avanzar un día
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        // Procesar eventos del día automáticamente
        this.processDay();
        
        // Actualizar la visualización con transición suave
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
        
        // 7. Mostrar noticias en la consola
        this.showNews(currentMonth, currentDay);
    }
    
    showNews(month, day) {
        // Ejemplo de eventos que podrían ocurrir
      
            // Agrega más eventos aquí
        ];

        // Mostrar eventos en la consola
        events.forEach(event => {
            console.log(`${event.date}: ${event.name} ocurrió.`);
        });
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
    
    // ==================== NUEVO: SISTEMA DE VISUALIZACIÓN HORIZONTAL ====================
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
        
        // Actualizar fecha completa
        if (this.currentDateFullElement) {
            this.currentDateFullElement.textContent = this.currentDate.toLocaleDateString('es-ES', options);
        }
        
        // Actualizar mes y año
        const monthYear = this.currentDate.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long' 
        });
        this.yearMonthElement.textContent = monthYear;
    }
    
    // ==================== NUEVO: CALENDARIO HORIZONTAL DE UNA SEMANA ====================
    updateWeekCalendar() {
        if (!this.weekDaysElement) return;
        
        // Obtener el lunes de la semana actual
        const currentDate = new Date(this.currentDate);
        const dayOfWeek = currentDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, retroceder 6 días
        
        const monday = new Date(currentDate);
        monday.setDate(currentDate.getDate() + mondayOffset);
        
        // Nombres de los días de la semana
        const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        
        // Limpiar contenedor
        this.weekDaysElement.innerHTML = '';
        
        // Generar los 7 días de la semana
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(monday);
            dayDate.setDate(monday.getDate() + i);
            
            const dayElement = this.createWeekDayElement(dayDate, dayNames[i]);
            this.weekDaysElement.appendChild(dayElement);
        }
        
        // Aplicar transición suave después de un pequeño delay
        setTimeout(() => {
            this.applyWeekTransitions();
        }, 50);
    }
    
    // ==================== CREAR ELEMENTO DE DÍA DE LA SEMANA ====================
    createWeekDayElement(date, dayName) {
        const dayElement = document.createElement('div');
        dayElement.className = 'week-day';
        
        // Determinar el estado del día (pasado, actual, futuro)
        const today = new Date(this.currentDate);
        const isToday = this.isSameDay(date, today);
        const isPast = date < today;
        const isFuture = date > today;
        
        // Aplicar clases según el estado
        if (isToday) {
            dayElement.classList.add('current');
        } else if (isPast) {
            dayElement.classList.add('past');
        } else if (isFuture) {
            dayElement.classList.add('future');
        }
        
        // Crear estructura interna
        const dayNameElement = document.createElement('div');
        dayNameElement.className = 'week-day-name';
        dayNameElement.textContent = dayName;
        
        const dayNumberElement = document.createElement('div');
        dayNumberElement.className = 'week-day-number';
        dayNumberElement.textContent = date.getDate();
        
        dayElement.appendChild(dayNameElement);
        dayElement.appendChild(dayNumberElement);
        
        // Agregar data attributes para animaciones
        dayElement.setAttribute('data-date', date.toISOString().split('T')[0]);
        dayElement.setAttribute('data-day-name', dayName);
        
        return dayElement;
    }
    
    // ==================== APLICAR TRANSICIONES SUAVES ====================
    applyWeekTransitions() {
        const weekDays = this.weekDaysElement.querySelectorAll('.week-day');
        
        weekDays.forEach((dayElement, index) => {
            // Aplicar delay escalonado para efecto de onda
            dayElement.style.transitionDelay = `${index * 0.1}s`;
            
            // Forzar repaint para activar transiciones
            dayElement.offsetHeight;
            
            // Agregar clase para activar animación
            dayElement.classList.add('animated');
        });
        
        // Limpiar delays después de la animación
        setTimeout(() => {
            weekDays.forEach(dayElement => {
                dayElement.style.transitionDelay = '';
            });
        }, 1000);
    }
    
    // ==================== FUNCIÓN AUXILIAR PARA COMPARAR FECHAS ====================
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    // ==================== FUNCIONES OBSOLETAS (MANTENIDAS POR COMPATIBILIDAD) ====================
    updateCalendar() {
        // Esta función ya no se usa, pero se mantiene por compatibilidad
        // El nuevo sistema usa updateWeekCalendar()
        return;
    }
    
    createDayElement(day, className = '') {
        // Esta función ya no se usa, pero se mantiene por compatibilidad
        // El nuevo sistema usa createWeekDayElement()
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
