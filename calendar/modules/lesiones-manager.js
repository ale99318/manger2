// ==================== GESTOR DE LESIONES ====================
class LesionesManager {
    constructor() {
        this.historialLesiones = []; // Historial de lesiones ocurridas
        this.maxLesionesPerDay = 2; // Máximo lesiones por día en toda la liga
    }
    
    // ==================== LESIONES INICIALES (CREACIÓN DE JUGADORES) ====================
    
    // Asignar lesión inicial al crear jugadores (solo 8% probabilidad)
    asignarLesionInicial(edad, propensionLesiones) {
        const probabilidadBase = 0.08; // 8% de jugadores con lesiones iniciales
        
        // Factor por edad (jugadores mayores más propensos)
        const factorEdad = edad >= 30 ? 1.5 : edad >= 25 ? 1.2 : 1.0;
        
        // Factor por propensión personal
        const factorPropension = propensionLesiones / 100;
        
        // Probabilidad final
        const probabilidadFinal = probabilidadBase * factorEdad * factorPropension;
        
        if (Math.random() < probabilidadFinal) {
            // Solo lesiones leves y moderadas al inicio (nada grave)
            const lesionesMenores = this.getLesionesPorGravedad(['leve', 'moderada']);
            
            if (lesionesMenores.length > 0) {
                const lesionSeleccionada = this.seleccionarLesionAleatoria(lesionesMenores);
                return this.crearObjetoLesion(lesionSeleccionada, 'inicial');
            }
        }
        
        return null; // Sin lesión
    }
    
    // ==================== LESIONES DURANTE EL JUEGO ====================
    
    // Asignar lesión durante partidos o entrenamientos
    asignarLesionDuranteJuego(estadoFisico, cansancio, propensionLesiones, intensidad = 'normal') {
        // Factores que aumentan la probabilidad
        const factorEstadoFisico = (100 - estadoFisico) / 100; // Peor estado físico = más riesgo
        const factorCansancio = cansancio / 100; // Más cansancio = más riesgo
        const factorPropension = propensionLesiones / 100; // Propensión personal
        const factorIntensidad = this.getFactorIntensidad(intensidad);
        
        // Probabilidad base según intensidad
        const probabilidadBase = this.getProbabilidadBasePorIntensidad(intensidad);
        
        // Probabilidad final
        const probabilidadFinal = probabilidadBase * 
            (1 + factorEstadoFisico + factorCansancio) * 
            factorPropension * 
            factorIntensidad;
        
        if (Math.random() < probabilidadFinal) {
            // Todas las lesiones disponibles durante el juego
            const todasLasLesiones = this.getTodasLasLesiones();
            const lesionSeleccionada = this.seleccionarLesionPonderada(todasLasLesiones);
            
            if (lesionSeleccionada) {
                return this.crearObjetoLesion(lesionSeleccionada, intensidad);
            }
        }
        
        return null; // Sin lesión
    }
    
    // ==================== LESIONES ALEATORIAS DIARIAS ====================
    
    // Procesar lesiones aleatorias del día (muy baja probabilidad)
    procesarLesionesDelDia(jugadoresPorClub) {
        const lesionesDelDia = [];
        let lesionesHoy = 0;
        
        // Solo procesar si no se ha alcanzado el máximo diario
        if (lesionesHoy >= this.maxLesionesPerDay) return lesionesDelDia;
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach(jugador => {
                // Solo jugadores sin lesión pueden lesionarse
                if (!jugador.lesion && lesionesHoy < this.maxLesionesPerDay) {
                    
                    // Probabilidad muy baja de lesión aleatoria (0.1% por día)
                    const probabilidadAleatoria = 0.001;
                    
                    if (Math.random() < probabilidadAleatoria) {
                        const lesion = this.asignarLesionDuranteJuego(
                            jugador.estadoFisico || 80,
                            jugador.cansancio || 0,
                            jugador.propensionLesiones || 50,
                            'entrenamiento'
                        );
                        
                        if (lesion) {
                            jugador.lesion = lesion;
                            lesionesDelDia.push({
                                jugador: jugador.nombre,
                                club: this.getClubName(clubId),
                                lesion: lesion.nombre,
                                dias: lesion.diasRestantes,
                                motivo: 'Lesión en entrenamiento'
                            });
                            lesionesHoy++;
                        }
                    }
                }
            });
        });
        
        return lesionesDelDia;
    }
    
    // ==================== FUNCIONES AUXILIARES ====================
    
    // Obtener lesiones por gravedad
    getLesionesPorGravedad(gravedades) {
        if (typeof lesiones === 'undefined') return [];
        
        return lesiones.filter(lesion => 
            gravedades.includes(lesion.gravedad.toLowerCase())
        );
    }
    
    // Obtener todas las lesiones disponibles
    getTodasLasLesiones() {
        if (typeof lesiones === 'undefined') return [];
        return lesiones.filter(lesion => lesion.gravedad !== 'mortal'); // Excluir mortales
    }
    
    // Seleccionar lesión aleatoria simple
    seleccionarLesionAleatoria(listLesiones) {
        if (listLesiones.length === 0) return null;
        return listLesiones[Math.floor(Math.random() * listLesiones.length)];
    }
    
    // Seleccionar lesión con probabilidades ponderadas
    seleccionarLesionPonderada(listLesiones) {
        if (listLesiones.length === 0) return null;
        
        const random = Math.random();
        let probabilidadAcumulada = 0;
        
        for (const lesion of listLesiones) {
            probabilidadAcumulada += lesion.probabilidad;
            if (random < probabilidadAcumulada) {
                return lesion;
            }
        }
        
        // Fallback: devolver la primera lesión
        return listLesiones[0];
    }
    
    // Crear objeto de lesión
    crearObjetoLesion(lesionTemplate, motivo) {
        // Manejar lesiones mortales
        if (lesionTemplate.gravedad === 'mortal') {
            return {
                nombre: lesionTemplate.nombre,
                gravedad: lesionTemplate.gravedad,
                descripcion: lesionTemplate.descripcion,
                diasRestantes: -1, // Indica retiro permanente
                motivo: motivo,
                fecha: new Date()
            };
        }
        
        // Variación en días de recuperación (±20%)
        const variacion = Math.floor(lesionTemplate.diasRecuperacion * 0.2);
        const diasFinales = lesionTemplate.diasRecuperacion + 
            Math.floor(Math.random() * (variacion * 2 + 1)) - variacion;
        
        return {
            nombre: lesionTemplate.nombre,
            gravedad: lesionTemplate.gravedad,
            descripcion: lesionTemplate.descripcion,
            diasRecuperacion: lesionTemplate.diasRecuperacion,
            diasRestantes: Math.max(1, diasFinales), // Mínimo 1 día
            motivo: motivo,
            fecha: new Date()
        };
    }
    
    // Obtener factor de intensidad
    getFactorIntensidad(intensidad) {
        const factores = {
            'descanso': 0.1,
            'entrenamiento': 0.5,
            'normal': 1.0,
            'partido': 1.5,
            'final': 2.0
        };
        
        return factores[intensidad] || 1.0;
    }
    
    // Obtener probabilidad base por intensidad
    getProbabilidadBasePorIntensidad(intensidad) {
        const probabilidades = {
            'descanso': 0.001,      // 0.1%
            'entrenamiento': 0.005, // 0.5%
            'normal': 0.01,         // 1%
            'partido': 0.02,        // 2%
            'final': 0.03           // 3%
        };
        
        return probabilidades[intensidad] || 0.01;
    }
    
    // Obtener nombre del club
    getClubName(clubId) {
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    }
    
    // ==================== ESTADÍSTICAS Y HISTORIAL ====================
    
    // Agregar lesión al historial
    agregarAlHistorial(lesionData) {
        this.historialLesiones.push({
            ...lesionData,
            timestamp: new Date()
        });
        
        // Mantener solo las últimas 200 lesiones
        if (this.historialLesiones.length > 200) {
            this.historialLesiones = this.historialLesiones.slice(-200);
        }
    }
    
    // Obtener estadísticas de lesiones
    getEstadisticasLesiones() {
        const stats = {
            totalLesiones: this.historialLesiones.length,
            lesionesPorGravedad: {},
            lesionesPorMotivo: {},
            promedioRecuperacion: 0
        };
        
        if (this.historialLesiones.length > 0) {
            // Contar por gravedad
            this.historialLesiones.forEach(lesion => {
                stats.lesionesPorGravedad[lesion.gravedad] = 
                    (stats.lesionesPorGravedad[lesion.gravedad] || 0) + 1;
                stats.lesionesPorMotivo[lesion.motivo] = 
                    (stats.lesionesPorMotivo[lesion.motivo] || 0) + 1;
            });
            
            // Promedio de días de recuperación
            const totalDias = this.historialLesiones
                .filter(l => l.diasRecuperacion > 0)
                .reduce((sum, l) => sum + l.diasRecuperacion, 0);
            stats.promedioRecuperacion = (totalDias / this.historialLesiones.length).toFixed(1);
        }
        
        return stats;
    }
    
    // Limpiar historial
    limpiarHistorial() {
        this.historialLesiones = [];
    }
}

// ==================== EXPORTACIÓN ====================

// Crear instancia global
const lesionesManager = new LesionesManager();

// Funciones globales para compatibilidad
function asignarLesionInicial(edad, propensionLesiones) {
    return lesionesManager.asignarLesionInicial(edad, propensionLesiones);
}

function asignarLesionDuranteJuego(estadoFisico, cansancio, propensionLesiones, intensidad) {
    return lesionesManager.asignarLesionDuranteJuego(estadoFisico, cansancio, propensionLesiones, intensidad);
}

function procesarLesionesDelDia(jugadoresPorClub) {
    return lesionesManager.procesarLesionesDelDia(jugadoresPorClub);
}

function getEstadisticasLesiones() {
    return lesionesManager.getEstadisticasLesiones();
}
