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
        this.start();
    }
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
        
        this.updateDisplay();
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
}

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AutoCalendar();
});
