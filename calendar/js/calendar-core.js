// ==================== CALENDARIO AUTOMÁTICO - NÚCLEO ====================

class AutoCalendar {
    constructor() {
        this.startDate = new Date(2025, 0, 1); // 1 de enero 2025
        this.endDate = new Date(2040, 11, 31); // 31 de diciembre 2040
        
        // Recuperar la fecha guardada de localStorage, si existe
        const savedDate = localStorage.getItem("currentCalendarDate");
        this.currentDate = savedDate ? new Date(savedDate) : new Date(this.startDate);
        
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
        // Guardar la fecha inicial al resetear
        localStorage.setItem("currentCalendarDate", this.currentDate.toISOString());
    }
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.processDay();
        this.updateDisplay();
        
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
        // Guardar la fecha actual en localStorage después de cada día
        localStorage.setItem("currentCalendarDate", this.currentDate.toISOString());
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

