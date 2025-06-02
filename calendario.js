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
        this.start();
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
            if (event.target.classList.contains('day')) {
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
        this.updateDisplay();
        this.interval = setInterval(() => {
            this.nextDay();
        }, this.intervalTime);
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
        this.start();
    }
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        // Verificar cumpleaños de jugadores
        this.checkBirthdays();
        
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
        
        this.updateDisplay();
    }
    
    jumpToDate(day) {
        const month = this.currentDate.getMonth();
        const year = this.currentDate.getFullYear();
        this.currentDate = new Date(year, month, day);
        this.updateDisplay();
        this.start(); // Reiniciar el avance desde la nueva fecha
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
        const currentMonth = this.currentDate.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1 para 1-12
        const currentDay = this.currentDate.getDate();
        let birthdayPlayers = [];
        let totalRetirements = 0;
        const retiredPlayers = [];
        
        // Procesar cada club
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = this.jugadoresPorClub[clubId];
            
            // Verificar cumpleaños y procesar retiros
            for (let i = jugadoresClub.length - 1; i >= 0; i--) {
                const jugador = jugadoresClub[i];
                
                // Verificar si es el cumpleaños del jugador
                if (jugador.birthdayMonth === currentMonth && jugador.birthdayDay === currentDay) {
                    jugador.edad += 1;
                    birthdayPlayers.push({
                        nombre: jugador.nombre,
                        edad: jugador.edad,
                        club: this.getClubName(clubId)
                    });
                    
                    // Verificar retiro en el cumpleaños
                    if (this.shouldPlayerRetire(jugador)) {
                        retiredPlayers.push({
                            nombre: jugador.nombre,
                            edad: jugador.edad,
                            club: this.getClubName(clubId),
                            posicion: jugador.posicion,
                            general: jugador.general
                        });
                        
                        // Remover jugador del array
                        jugadoresClub.splice(i, 1);
                        totalRetirements++;
                    }
                }
            }
        });
        
        // Guardar cambios en localStorage si hubo cambios
        if (birthdayPlayers.length > 0) {
            this.savePlayersData();
            this.updatePlayersStats();
            this.logBirthdaysAndRetirements(birthdayPlayers, retiredPlayers, this.currentDate);
        }
        
        // Generar nuevos jugadores para reemplazar retirados
        if (totalRetirements > 0) {
           
