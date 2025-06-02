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
        
        // Verificar cumpleaños de jugadores
        this.checkBirthdays();
        
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
            this.generateReplacementPlayers(totalRetirements);
        }
    }
    
    shouldPlayerRetire(jugador) {
        if (jugador.edad < 36) return false;
        
        // Probabilidad de retiro basada en edad
        let retirementChance = 0;
        
        if (jugador.edad >= 36) retirementChance = 0.95; // 95%
        if (jugador.edad >= 38) retirementChance = 0.98; // 98%
        if (jugador.edad >= 40) retirementChance = 1.0;  // 100%
        
        // Jugadores con mayor habilidad tienden a retirarse más tarde
        if (jugador.general >= 80) {
            retirementChance *= 0.8; // Reducir probabilidad para jugadores elite
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
            sprint: this.rand(50, 95),
            regate: this.rand(50, 95),
            pase: this.rand(50, 95),
            tiro: this.rand(50, 95),
            defensa: this.rand(40, 90),
            resistencia: this.rand(60, 95),
            valor: valor,
            sueldo: sueldo
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
    
    logBirthdaysAndRetirements(birthdayPlayers, retiredPlayers, date) {
        const logElement = document.getElementById('event-log');
        if (!logElement) return;
        
        const currentDateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        let logHTML = `<p class="retirement-summary">📅 ${currentDateStr}: `;
        
        if (birthdayPlayers.length > 0) {
            logHTML += `${birthdayPlayers.length} jugador(es) cumplen años`;
        }
        
        if (retiredPlayers.length > 0) {
            logHTML += `, ${retiredPlayers.length} se retiraron`;
        }
        
        logHTML += `</p>`;
        
        if (birthdayPlayers.length > 0) {
            logHTML += '<ul class="birthday-list">';
            birthdayPlayers.forEach(player => {
                logHTML += `<li>🎂 ${player.nombre} ahora tiene ${player.edad} años - ${player.club}</li>`;
                // Enviar al sistema de notificaciones si la función existe
                if (typeof addBirthdayEvent === 'function') {
                    addBirthdayEvent({
                        nombre: player.nombre,
                        edad: player.edad,
                        club: player.club
                    });
                }
            });
            logHTML += '</ul>';
        }
        
        if (retiredPlayers.length > 0) {
            logHTML += '<ul class="retirement-list">';
            retiredPlayers.forEach(player => {
                logHTML += `<li>👴 ${player.nombre} (${player.edad} años, ${player.posicion}, GEN: ${player.general}) - ${player.club}</li>`;
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
            logHTML += '</ul>';
        }
        
        logElement.innerHTML = logHTML;
    }
    
    clearEventLog() {
        const logElement = document.getElementById('event-log');
        if (logElement) {
            logElement.innerHTML = '';
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

// Datos globales temporales (pueden estar en otro archivo)
const nombres = [
    "Carlos", "Juan", "Pedro", "Luis", "Miguel", "Andrés", "Santiago", "Daniel", 
    "Fernando", "Pablo", "Diego", "Javier", "Alejandro", "Roberto", "Mario", 
    "Sergio", "Antonio", "Francisco", "José", "Manuel", "Ricardo", "Eduardo", 
    "Raúl", "Guillermo", "Gonzalo", "Mateo", "Sebastián", "Nicolás", "Gabriel", "Emilio"
];

const apellidos = [
    "García", "López", "Martínez", "González", "Pérez", "Rodríguez", "Sánchez", 
    "Fernández", "Torres", "Ramírez", "Castro", "Vargas", "Herrera", "Mendoza", 
    "Silva", "Jiménez", "Morales", "Ruiz", "Ortega", "Delgado", "Cruz", "Flores", 
    "Ramos", "Aguilar", "Medina", "Romero", "Núñez", "Guerrero", "Peña", "Vega"
];

const posiciones = ["POR", "DEF", "MED", "DEL"];
