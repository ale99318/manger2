class AutoCalendar {
    constructor() {
        this.startDate = new Date(2025, 0, 1); // 1 de enero 2025
        this.endDate = new Date(2040, 11, 31); // 31 de diciembre 2040
        this.currentDate = new Date(this.startDate);
        this.interval = null;
        this.isPaused = false;
        this.intervalTime = 5000; // 5 segundos
        this.lastYear = this.currentDate.getFullYear(); // Para detectar cambio de año
        
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
        
        // Agregar elemento para mostrar información de jugadores
        this.createPlayersInfoElement();
    }
    
    createPlayersInfoElement() {
        const playersInfo = document.createElement('div');
        playersInfo.id = 'players-info';
        playersInfo.className = 'players-info';
        playersInfo.innerHTML = `
            <h3>📊 Estado de Jugadores</h3>
            <div id="players-stats"></div>
            <div id="retirement-log"></div>
        `;
        
        const container = document.querySelector('.container');
        container.appendChild(playersInfo);
    }
    
    setupEventListeners() {
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
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
        this.lastYear = this.currentDate.getFullYear();
        this.isPaused = false;
        this.pauseBtn.textContent = 'Pausar';
        this.pauseBtn.classList.remove('paused');
        
        // Recargar jugadores originales
        this.loadPlayersData();
        this.clearRetirementLog();
        this.start();
    }
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        // Verificar si cambió el año
        const currentYear = this.currentDate.getFullYear();
        if (currentYear !== this.lastYear) {
            this.processYearChange(currentYear);
            this.lastYear = currentYear;
        }
        
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
            this.lastYear = this.currentDate.getFullYear();
        }
        
        this.updateDisplay();
    }
    
    processYearChange(newYear) {
        console.log(`🎂 Nuevo año: ${newYear} - Procesando envejecimiento de jugadores`);
        
        let totalPlayersAged = 0;
        let totalRetirements = 0;
        const retiredPlayers = [];
        
        // Procesar cada club
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadores = this.jugadoresPorClub[clubId];
            
            // Envejecer jugadores y procesar retiros
            for (let i = jugadores.length - 1; i >= 0; i--) {
                const jugador = jugadores[i];
                jugador.edad += 1;
                totalPlayersAged++;
                
                // Verificar retiro
                if (this.shouldPlayerRetire(jugador)) {
                    retiredPlayers.push({
                        nombre: jugador.nombre,
                        edad: jugador.edad,
                        club: this.getClubName(clubId),
                        posicion: jugador.posicion,
                        general: jugador.general
                    });
                    
                    // Remover jugador del array
                    jugadores.splice(i, 1);
                    totalRetirements++;
                }
            }
        });
        
        // Guardar cambios en localStorage
        this.savePlayersData();
        
        // Actualizar estadísticas
        this.updatePlayersStats();
        
        // Mostrar log de retiros
        this.logRetirements(newYear, retiredPlayers, totalPlayersAged, totalRetirements);
        
        // Generar nuevos jugadores para reemplazar retirados
        this.generateReplacementPlayers(totalRetirements);
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
        // Usar las mismas funciones del sistema original
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
        
        // Configuración simplificada para nuevos jugadores
        const config = this.getConfigForClub(clubId);
        
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        
        // Jugadores jóvenes (16-22 años) con potencial
        const edad = 16 + Math.floor(Math.random() * 7);
        const general = config.generalMin + Math.floor(Math.random() * (config.generalMax - config.generalMin));
        const potencial = Math.min(95, general + 5 + Math.floor(Math.random() * 15));
        
        // Generar ID único
        const maxId = this.getMaxPlayerId() + 1;
        
        return {
            id: maxId,
            clubId: clubId,
            nombre: `${nombre} ${apellido}`,
            edad: edad,
            posicion: posiciones[Math.floor(Math.random() * posiciones.length)],
            general: general,
            potencial: potencial,
            sprint: 50 + Math.floor(Math.random() * 46),
            regate: 50 + Math.floor(Math.random() * 46),
            pase: 50 + Math.floor(Math.random() * 46),
            tiro: 50 + Math.floor(Math.random() * 46),
            defensa: 40 + Math.floor(Math.random() * 51),
            resistencia: 60 + Math.floor(Math.random() * 36),
            valor: config.valorMin + Math.floor(Math.random() * (config.valorMax - config.valorMin)),
            sueldo: config.sueldoMin + Math.floor(Math.random() * (config.sueldoMax - config.sueldoMin))
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
        // Configuración simplificada basada en la liga
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
            const jugadores = this.jugadoresPorClub[clubId];
            totalPlayers += jugadores.length;
            totalClubs++;
            
            jugadores.forEach(jugador => {
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
