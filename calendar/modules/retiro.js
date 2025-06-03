// ==================== SISTEMA DE RETIROS DE JUGADORES ====================
class RetiroManager {
    constructor() {
        this.maxRetirementsPerMonth = 3; // Máximo retiros por mes
        this.retirementHistory = []; // Historial de retiros
    }
    
    // ==================== FUNCIÓN PRINCIPAL DE RETIROS ====================
    
    // Verificar y procesar retiros del día
    checkRetirements(currentDate, jugadoresPorClub) {
        const currentMonth = currentDate.getMonth() + 1;
        const retiredPlayers = [];
        
        // Solo procesar retiros en diciembre (final de temporada)
        if (currentMonth !== 12) {
            return retiredPlayers;
        }
        
        let totalRetirements = 0;
        const candidatesForRetirement = [];
        
        // Recopilar candidatos para retiro
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach((jugador, index) => {
                const retirementReason = this.evaluateRetirement(jugador);
                
                if (retirementReason) {
                    candidatesForRetirement.push({
                        jugador: jugador,
                        clubId: clubId,
                        index: index,
                        razon: retirementReason,
                        prioridad: this.getRetirementPriority(retirementReason)
                    });
                }
            });
        });
        
        // Ordenar por prioridad (mayor prioridad = más probable retiro)
        candidatesForRetirement.sort((a, b) => b.prioridad - a.prioridad);
        
        // Procesar retiros hasta el máximo permitido
        const retirementsToProcess = candidatesForRetirement.slice(0, this.maxRetirementsPerMonth);
        
        retirementsToProcess.forEach(candidate => {
            const { jugador, clubId, razon } = candidate;
            
            // Ejecutar retiro
            const retirementData = this.executeRetirement(jugador, clubId, razon);
            retiredPlayers.push(retirementData);
            
            // Remover jugador del array
            const jugadoresClub = jugadoresPorClub[clubId];
            const actualIndex = jugadoresClub.findIndex(j => j.id === jugador.id);
            if (actualIndex !== -1) {
                jugadoresClub.splice(actualIndex, 1);
                totalRetirements++;
            }
        });
        
        return retiredPlayers;
    }
    
    // ==================== EVALUACIÓN DE CONDICIONES DE RETIRO ====================
    
    // Evaluar si un jugador debe retirarse
    evaluateRetirement(jugador) {
        // 1. Edad máxima alcanzada
        if (jugador.edad >= 42) {
            return "Edad máxima alcanzada (42+ años)";
        }
        
        if (jugador.edad >= 40 && Math.random() < 0.8) {
            return "Edad avanzada (40+ años)";
        }
        
        if (jugador.edad >= 38 && Math.random() < 0.5) {
            return "Edad avanzada (38+ años)";
        }
        
        if (jugador.edad >= 35 && Math.random() < 0.3) {
            return "Edad avanzada (35+ años)";
        }
        
        // 2. Bajo rendimiento general
        if (jugador.general <= 45) {
            return "Rendimiento general muy bajo";
        }
        
        if (jugador.general <= 55 && jugador.edad >= 32) {
            return "Bajo rendimiento y edad avanzada";
        }
        
        // 3. Atributos físicos muy deteriorados
        const atributosFisicos = [jugador.sprint, jugador.resistencia, jugador.estadoFisico];
        const promedioFisico = atributosFisicos.reduce((a, b) => a + b, 0) / atributosFisicos.length;
        
        if (promedioFisico <= 40) {
            return "Condición física muy deteriorada";
        }
        
        // 4. Historial de lesiones graves
        if (jugador.propensionLesiones >= 80) {
            return "Historial de lesiones graves recurrentes";
        }
        
        // 5. Motivación baja (actitudes negativas)
        const actitudesNegativas = ['Conformista', 'Inseguro', 'Renegón', 'Desmotivado'];
        if (actitudesNegativas.includes(jugador.actitud) && jugador.edad >= 30) {
            return "Falta de motivación y edad avanzada";
        }
        
        // 6. Fin de contrato sin renovación
        if (jugador.contratoAnios <= 0 && jugador.edad >= 33) {
            return "Fin de contrato sin renovación";
        }
        
        // 7. Valor de mercado muy bajo
        if (jugador.valorMercado <= 5000 && jugador.edad >= 30) {
            return "Valor de mercado muy bajo";
        }
        
        // 8. Energía/resistencia crónicamente baja
        if (jugador.resistencia <= 35 && jugador.estadoFisico <= 50) {
            return "Energía y resistencia crónicamente bajas";
        }
        
        // 9. Mensaje de retiro voluntario (jugadores marcados)
        if (jugador.ultimoAnio && Math.random() < 0.4) {
            return "Retiro voluntario anunciado";
        }
        
        // 10. Múltiples factores combinados
        if (this.hasMultipleRetirementFactors(jugador)) {
            return "Múltiples factores de retiro";
        }
        
        return null; // No se retira
    }
    
    // Verificar múltiples factores de retiro
    hasMultipleRetirementFactors(jugador) {
        let factores = 0;
        
        if (jugador.edad >= 32) factores++;
        if (jugador.general <= 65) factores++;
        if (jugador.estadoFisico <= 60) factores++;
        if (jugador.valorMercado <= 15000) factores++;
        if (jugador.propensionLesiones >= 60) factores++;
        if (jugador.contratoAnios <= 1) factores++;
        
        return factores >= 3; // 3 o más factores = candidato a retiro
    }
    
    // ==================== PRIORIDADES DE RETIRO ====================
    
    // Obtener prioridad de retiro (mayor número = mayor prioridad)
    getRetirementPriority(razon) {
        const prioridades = {
            "Edad máxima alcanzada (42+ años)": 10,
            "Edad avanzada (40+ años)": 9,
            "Rendimiento general muy bajo": 8,
            "Condición física muy deteriorada": 7,
            "Historial de lesiones graves recurrentes": 6,
            "Edad avanzada (38+ años)": 5,
            "Múltiples factores de retiro": 4,
            "Fin de contrato sin renovación": 3,
            "Energía y resistencia crónicamente bajas": 3,
            "Retiro voluntario anunciado": 2,
            "Edad avanzada (35+ años)": 2,
            "Bajo rendimiento y edad avanzada": 2,
            "Falta de motivación y edad avanzada": 1,
            "Valor de mercado muy bajo": 1
        };
        
        return prioridades[razon] || 0;
    }
    
    // ==================== EJECUCIÓN DE RETIRO ====================
    
    // Ejecutar el retiro de un jugador
    executeRetirement(jugador, clubId, razon) {
        const retirementData = {
            nombre: jugador.nombre,
            edad: jugador.edad,
            posicion: jugador.posicion,
            general: jugador.general,
            club: this.getClubName(clubId),
            razon: razon,
            valorMercado: jugador.valorMercado,
            fecha: new Date(),
            // Estadísticas de carrera (para futuras expansiones)
            estadisticasCarrera: {
                aniosJugados: jugador.edad - 16, // Asumiendo que empezó a los 16
                generalMaximo: jugador.potencial || jugador.general,
                lesionesTotales: Math.floor(jugador.propensionLesiones / 10)
            }
        };
        
        // Agregar al historial
        this.retirementHistory.push(retirementData);
        
        // Mantener solo los últimos 100 retiros en el historial
        if (this.retirementHistory.length > 100) {
            this.retirementHistory = this.retirementHistory.slice(-100);
        }
        
        return retirementData;
    }
    
    // ==================== FUNCIONES AUXILIARES ====================
    
    // Obtener nombre del club
    getClubName(clubId) {
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    }
    
    // Obtener estadísticas de retiros
    getRetirementStats() {
        const stats = {
            totalRetiros: this.retirementHistory.length,
            retirosPorRazon: {},
            edadPromedioRetiro: 0,
            retirosPorClub: {}
        };
        
        if (this.retirementHistory.length > 0) {
            // Contar retiros por razón
            this.retirementHistory.forEach(retiro => {
                stats.retirosPorRazon[retiro.razon] = (stats.retirosPorRazon[retiro.razon] || 0) + 1;
                stats.retirosPorClub[retiro.club] = (stats.retirosPorClub[retiro.club] || 0) + 1;
            });
            
            // Calcular edad promedio de retiro
            const edadTotal = this.retirementHistory.reduce((sum, retiro) => sum + retiro.edad, 0);
            stats.edadPromedioRetiro = (edadTotal / this.retirementHistory.length).toFixed(1);
        }
        
        return stats;
    }
    
    // Obtener retiros recientes
    getRecentRetirements(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return this.retirementHistory.filter(retiro => 
            new Date(retiro.fecha) >= cutoffDate
        );
    }
    
    // Limpiar historial de retiros
    clearRetirementHistory() {
        this.retirementHistory = [];
    }
}

// ==================== EXPORTACIÓN ====================

// Crear instancia global
const retiroManager = new RetiroManager();

// Funciones globales para compatibilidad
function checkRetirements(currentDate, jugadoresPorClub) {
    return retiroManager.checkRetirements(currentDate, jugadoresPorClub);
}

function getRetirementStats() {
    return retiroManager.getRetirementStats();
}

function getRecentRetirements(days) {
    return retiroManager.getRecentRetirements(days);
}
