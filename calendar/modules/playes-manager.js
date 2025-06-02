// ==================== GESTIÓN DE JUGADORES ====================
class PlayersManager {
    constructor() {
        this.jugadoresPorClub = {};
        this.loadPlayersData();
    }
    
    // Cargar jugadores desde localStorage
    loadPlayersData() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (jugadoresData) {
            this.jugadoresPorClub = JSON.parse(jugadoresData);
        } else {
            this.jugadoresPorClub = {};
        }
    }
    
    // Verificar cumpleaños de jugadores
    checkBirthdays(currentDate) {
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        let birthdayPlayers = [];
        let lastYearPlayers = []; // Jugadores que anuncian su último año
        let totalRetirements = 0;
        const retiredPlayers = [];
        
        // Procesar cada club
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = this.jugadoresPorClub[clubId];
            
            // Verificar cumpleaños
            for (let i = jugadoresClub.length - 1; i >= 0; i--) {
                const jugador = jugadoresClub[i];
                
                // Verificar si es el cumpleaños del jugador
                if (jugador.birthdayMonth === currentMonth && jugador.birthdayDay === currentDay) {
                    jugador.edad += 1;
                    
                    // Solo mostrar cumpleaños del club seleccionado
                    birthdayPlayers.push({
                        nombre: jugador.nombre,
                        edad: jugador.edad,
                        club: this.getClubName(clubId)
                    });
                    
                    // Verificar si debe anunciar su último año (36+ años)
                    if (jugador.edad >= 36 && !jugador.ultimoAnio) {
                        jugador.ultimoAnio = true; // Marcar que ya anunció su último año
                        lastYearPlayers.push({
                            nombre: jugador.nombre,
                            edad: jugador.edad,
                            club: this.getClubName(clubId),
                            posicion: jugador.posicion,
                            general: jugador.general
                        });
                    }
                }
            }
        });
        
        // Procesar retiros solo en diciembre (final de temporada)
        if (currentMonth === 12) {
            const retirosDelMes = this.processMonthlyRetirements();
            retiredPlayers.push(...retirosDelMes.retiredPlayers);
            totalRetirements = retirosDelMes.totalRetirements;
        }
        
        // Guardar cambios en localStorage si hubo cambios
        if (birthdayPlayers.length > 0 || lastYearPlayers.length > 0) {
            this.savePlayersData();
        }
        
        // Generar nuevos jugadores para reemplazar retirados
        if (totalRetirements > 0) {
            this.generateReplacementPlayers(totalRetirements);
        }
        
        return {
            birthdayPlayers: birthdayPlayers,
            lastYearPlayers: lastYearPlayers,
            retiredPlayers: retiredPlayers
        };
    }
    
    // Procesar retiros mensuales con límites
    processMonthlyRetirements() {
        const maxRetirementsPerMonth = 3; // Máximo 3 retiros por mes
        let retiredPlayers = [];
        let totalRetirements = 0;
        let candidatesForRetirement = [];
        
        // Recopilar candidatos para retiro
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = this.jugadoresPorClub[clubId];
            
            jugadoresClub.forEach((jugador, index) => {
                if (jugador.ultimoAnio && this.shouldPlayerRetireThisMonth(jugador)) {
                    candidatesForRetirement.push({
                        jugador: jugador,
                        clubId: clubId,
                        index: index
                    });
                }
            });
        });
        
        // Seleccionar aleatoriamente hasta el máximo permitido
        if (candidatesForRetirement.length > 0) {
            // Mezclar array aleatoriamente
            candidatesForRetirement.sort(() => Math.random() - 0.5);
            
            // Tomar solo los primeros hasta el máximo
            const retirementsToProcess = candidatesForRetirement.slice(0, maxRetirementsPerMonth);
            
            // Procesar retiros seleccionados
            retirementsToProcess.forEach(candidate => {
                const { jugador, clubId, index } = candidate;
                
                retiredPlayers.push({
                    nombre: jugador.nombre,
                    edad: jugador.edad,
                    club: this.getClubName(clubId),
                    posicion: jugador.posicion,
                    general: jugador.general
                });
                
                // Remover jugador del array (buscar índice actualizado)
                const jugadoresClub = this.jugadoresPorClub[clubId];
                const actualIndex = jugadoresClub.findIndex(j => j.id === jugador.id);
                if (actualIndex !== -1) {
                    jugadoresClub.splice(actualIndex, 1);
                    totalRetirements++;
                }
            });
        }
        
        return {
            retiredPlayers: retiredPlayers,
            totalRetirements: totalRetirements
        };
    }
    
    // Determinar si un jugador se retira este mes
    shouldPlayerRetireThisMonth(jugador) {
        if (!jugador.ultimoAnio) return false;
        
        // Probabilidad basada en edad (solo para jugadores que ya anunciaron su último año)
        let retirementChance = 0;
        
        if (jugador.edad >= 36) retirementChance = 0.3; // 30%
        if (jugador.edad >= 38) retirementChance = 0.5; // 50%
        if (jugador.edad >= 40) retirementChance = 0.8; // 80%
        if (jugador.edad >= 42) retirementChance = 1.0; // 100%
        
        // Jugadores con mayor habilidad tienden a retirarse más tarde
        if (jugador.general >= 80) {
            retirementChance *= 0.7; // Reducir probabilidad para jugadores elite
        }
        
        return Math.random() < retirementChance;
    }
    
    // Generar nuevos jugadores para reemplazar retirados
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
    
    // Generar un nuevo jugador joven
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
            actitud: "Joven promesa",
            estadoFisico: this.rand(80, 95),
            cansancio: this.rand(0, 10),
            valorMercado: valor,
            sueldo: sueldo,
            contratoAnios: this.rand(2, 5),
            lesion: null,
            propensionLesiones: this.rand(10, 30), // Jóvenes menos propensos a lesiones
            sprint: this.rand(50, 95),
            regate: this.rand(50, 95),
            pase: this.rand(50, 95),
            tiro: this.rand(50, 95),
            defensa: this.rand(40, 90),
            resistencia: this.rand(60, 95)
        };
    }
    
    // Obtener el ID máximo de los jugadores
    getMaxPlayerId() {
        let maxId = 0;
        Object.values(this.jugadoresPorClub).forEach(jugadores => {
            jugadores.forEach(jugador => {
                if (jugador.id > maxId) maxId = jugador.id;
            });
        });
        return maxId;
    }
    
    // Obtener configuración del club
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
    
    // Guardar jugadores en localStorage
    savePlayersData() {
        localStorage.setItem("jugadoresPorClub", JSON.stringify(this.jugadoresPorClub));
    }
    
    // Obtener estadísticas generales de jugadores
    getGeneralStats() {
        let totalPlayers = 0;
        let totalClubs = 0;
        let ageSum = 0;
        
        Object.keys(this.jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = this.jugadoresPorClub[clubId];
            totalPlayers += jugadoresClub.length;
            totalClubs++;
            
            jugadoresClub.forEach(jugador => {
                ageSum += jugador.edad;
            });
        });
        
        const avgAge = totalPlayers > 0 ? (ageSum / totalPlayers).toFixed(1) : 0;
        
        return {
            totalPlayers: totalPlayers,
            totalClubs: totalClubs,
            avgAge: avgAge
        };
    }
    
    // Función auxiliar para generar números aleatorios
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
