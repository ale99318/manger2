// Sistema de Calendario del Juego
class GameCalendar {
    constructor() {
        this.startDate = new Date(2025, 0, 1); // 1 enero 2025
        this.endDate = new Date(2060, 11, 31);  // 31 diciembre 2060
        this.currentDate = new Date(this.startDate);
        this.callbacks = [];
        this.init();
    }

    init() {
        this.updateDisplay();
        this.setupEventListeners();
        // Crear evento global para que otros elementos puedan escuchar cambios
        window.gameCalendar = this;
    }

    setupEventListeners() {
        document.getElementById('advance-day').addEventListener('click', () => this.advanceDay());
        document.getElementById('advance-month').addEventListener('click', () => this.advanceMonth());
        document.getElementById('advance-year').addEventListener('click', () => this.advanceYear());
    }

    advanceDay() {
        const nextDay = new Date(this.currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        if (nextDay <= this.endDate) {
            this.currentDate = nextDay;
            this.updateDisplay();
            this.notifyCallbacks();
        }
    }

    advanceMonth() {
        const nextMonth = new Date(this.currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        if (nextMonth <= this.endDate) {
            this.currentDate = nextMonth;
            this.updateDisplay();
            this.notifyCallbacks();
        }
    }

    advanceYear() {
        const nextYear = new Date(this.currentDate);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        
        if (nextYear <= this.endDate) {
            this.currentDate = nextYear;
            this.updateDisplay();
            this.notifyCallbacks();
        }
    }

    updateDisplay() {
        const formatDate = this.formatDate(this.currentDate);
        document.getElementById('current-date').textContent = formatDate;
        document.getElementById('day-name').textContent = this.getDayName();
        document.getElementById('season').textContent = this.getSeason();
        document.getElementById('days-elapsed').textContent = this.getDaysElapsed();
        document.getElementById('week-number').textContent = this.getWeekNumber();
    }

    formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    getDayName() {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[this.currentDate.getDay()];
    }

    getSeason() {
        const month = this.currentDate.getMonth();
        if (month >= 2 && month <= 4) return 'Primavera';
        if (month >= 5 && month <= 7) return 'Verano';
        if (month >= 8 && month <= 10) return 'Otoño';
        return 'Invierno';
    }

    getDaysElapsed() {
        const timeDiff = this.currentDate.getTime() - this.startDate.getTime();
        return Math.floor(timeDiff / (1000 * 3600 * 24));
    }

    getWeekNumber() {
        const startOfYear = new Date(this.currentDate.getFullYear(), 0, 1);
        const daysDiff = Math.floor((this.currentDate - startOfYear) / (1000 * 3600 * 24));
        return Math.ceil((daysDiff + startOfYear.getDay() + 1) / 7);
    }

    // Métodos para que otros elementos del juego puedan acceder a la información
    getCurrentDate() {
        return new Date(this.currentDate);
    }

    getFormattedDate() {
        return this.formatDate(this.currentDate);
    }

    getCurrentSeason() {
        return this.getSeason();
    }

    getDaysSince(targetDate) {
        const target = new Date(targetDate);
        const timeDiff = this.currentDate.getTime() - target.getTime();
        return Math.floor(timeDiff / (1000 * 3600 * 24));
    }

    getDaysUntil(targetDate) {
        const target = new Date(targetDate);
        const timeDiff = target.getTime() - this.currentDate.getTime();
        return Math.floor(timeDiff / (1000 * 3600 * 24));
    }

    // Sistema de callbacks para que otros elementos puedan reaccionar a cambios de fecha
    onDateChange(callback) {
        this.callbacks.push(callback);
    }

    notifyCallbacks() {
        this.callbacks.forEach(callback => callback(this.currentDate));
    }

    // Método para establecer una fecha específica (útil para testing o eventos especiales)
    setDate(year, month, day) {
        const newDate = new Date(year, month - 1, day);
        if (newDate >= this.startDate && newDate <= this.endDate) {
            this.currentDate = newDate;
            this.updateDisplay();
            this.notifyCallbacks();
            return true;
        }
        return false;
    }
}

// Inicializar el calendario
const calendar = new GameCalendar();

// Ejemplo de cómo otros elementos del juego pueden usar el calendario
let characterBirthDate = new Date(2005, 0, 1);
let nextEventDate = new Date(2025, 1, 1); // 1 febrero 2025

// Función que se ejecuta cada vez que cambia la fecha
calendar.onDateChange((newDate) => {
    // Actualizar edad del personaje
    const age = Math.floor(calendar.getDaysSince(characterBirthDate) / 365.25);
    document.getElementById('age-display').textContent = age;

    // Actualizar contador de evento
    const daysToEvent = calendar.getDaysUntil(nextEventDate);
    document.getElementById('next-event').textContent = Math.max(0, daysToEvent);

    // Actualizar efecto estacional
    const season = calendar.getCurrentSeason();
    let seasonBonus = 'Normal';
    switch(season) {
        case 'Primavera': seasonBonus = '+10% Crecimiento'; break;
        case 'Verano': seasonBonus = '+15% Energía'; break;
        case 'Otoño': seasonBonus = '+20% Cosecha'; break;
        case 'Invierno': seasonBonus = '-5% Actividad'; break;
    }
    document.getElementById('season-bonus').textContent = seasonBonus;
});

// Funciones globales para fácil acceso desde cualquier script
window.getGameDate = () => calendar.getCurrentDate();
window.getGameDateFormatted = () => calendar.getFormattedDate();
window.getGameSeason = () => calendar.getCurrentSeason();
window.subscribeToDateChanges = (callback) => calendar.onDateChange(callback);
