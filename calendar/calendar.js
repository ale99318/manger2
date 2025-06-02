// ==================== CALENDARIO - SOLO INTERFAZ Y NAVEGACIÓN ====================
class AutoCalendar {
    constructor() {
        this.startDate = new Date(2025, 0, 1); // 1 de enero 2025
        this.endDate = new Date(2040, 11, 31); // 31 de diciembre 2040
        this.currentDate = new Date(this.startDate);
        this.interval = null;
        this.isPaused = false;
        this.intervalTime = 5000; // 5 segundos
        
        // Inicializar módulos especializados
        this.playersManager = new PlayersManager();
        this.eventsManager = new EventsManager();
        this.displayManager = new CalendarDisplay();
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    // ==================== INICIALIZACIÓN DE INTERFAZ ====================
    
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
    
    // ==================== CONTROL DE TIEMPO ====================
    
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
        this.displayManager.clearEventLog();
        this.updateDisplay();
        this.start();
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
    
    // ==================== LÓGICA PRINCIPAL DEL DÍA ====================
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        // Delegar el procesamiento del día a los módulos especializados
        const eventosDelDia = this.eventsManager.processDay(this.currentDate, this.playersManager);
        
        // Mostrar eventos usando el módulo de visualización
        this.displayManager.showDayEvents(eventosDelDia, this.currentDate);
        
        // Actualizar estadísticas de jugadores
        this.playersManager.updateStats();
        
        // Verificar si llegamos al final del período
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
        
        // Actualizar la interfaz
        this.updateDisplay();
        
        // Integración con sistema de notificaciones (si existe)
        if (typeof updateCurrentDateForNotifications === 'function') {
            updateCurrentDateForNotifications(this.currentDate);
        }
    }
    
    // ==================== ACTUALIZACIÓN DE INTERFAZ ====================
    
    updateDisplay() {
        this.updateDateInfo();
        this.updateCalendar();
        this.updateProgress();
        this.updatePlayersStatsDisplay();
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
    
    updatePlayersStatsDisplay() {
        const statsElement = document.getElementById('players-stats');
        if (statsElement && this.playersManager) {
            const stats = this.playersManager.getGeneralStats();
            this.displayManager.showPlayersStats(stats, statsElement);
        }
    }
    
    // ==================== MÉTODOS PÚBLICOS PARA OTROS MÓDULOS ====================
    
    getCurrentDate() {
        return new Date(this.currentDate);
    }
    
    setDate(newDate) {
        this.currentDate = new Date(newDate);
        this.updateDisplay();
    }
    
    getPlayersManager() {
        return this.playersManager;
    }
    
    getEventsManager() {
        return this.eventsManager;
    }
    
    getDisplayManager() {
        return this.displayManager;
    }
}

// ==================== INICIALIZACIÓN ====================

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que todos los módulos estén cargados
    if (typeof PlayersManager === 'undefined' || 
        typeof EventsManager === 'undefined' || 
        typeof CalendarDisplay === 'undefined') {
        console.error('Error: No se han cargado todos los módulos necesarios');
        return;
    }
    
    // Crear instancia del calendario
    window.calendar = new AutoCalendar();
});

// ==================== FUNCIONES GLOBALES ====================

// Función para ir a la página de notificaciones
function goToNotifications() {
    window.location.href = "notifications.html";
}

// Función para acceder al calendario desde otros scripts
function getCalendar() {
    return window.calendar;
}
