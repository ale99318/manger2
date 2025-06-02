// ==================== GESTIÓN DE EVENTOS DEL DÍA ====================
class EventsManager {
    constructor() {
        this.eventHistory = [];
        this.maxHistoryDays = 30; // Mantener historial de 30 días
    }
    
    // Procesar todos los eventos de un día
    processDay(currentDate, playersManager) {
        let eventosDelDia = [];
        
        // 1. Verificar cumpleaños de jugadores
        const eventosCumpleanos = this.processBirthdays(currentDate, playersManager);
        if (this.hasEvents(eventosCumpleanos)) {
            eventosDelDia.push({
                tipo: 'cumpleanos',
                data: eventosCumpleanos,
                prioridad: 1
            });
        }
        
        // 2. Aplicar degradación por inactividad
        const degradacionAplicada = this.processDegradation(playersManager);
        if (degradacionAplicada) {
            eventosDelDia.push({
                tipo: 'degradacion',
                data: degradacionAplicada,
                prioridad: 4
            });
        }
        
        // 3. Aplicar eventos aleatorios de cansancio
        const eventosAleatorios = this.processRandomFatigueEvents(playersManager);
        if (eventosAleatorios.length > 0) {
            eventosDelDia.push({
                tipo: 'eventos_cansancio',
                data: eventosAleatorios,
                prioridad: 2
            });
        }
        
        // 4. Procesar recuperación de lesiones
        const recuperaciones = this.processInjuryRecovery(playersManager);
        if (recuperaciones.length > 0) {
            eventosDelDia.push({
                tipo: 'recuperaciones',
                data: recuperaciones,
                prioridad: 3
            });
        }
        
        // 5. Eventos especiales según fecha
        const eventosEspeciales = this.processSpecialDateEvents(currentDate, playersManager);
        if (eventosEspeciales.length > 0) {
            eventosDelDia.push({
                tipo: 'eventos_especiales',
                data: eventosEspeciales,
                prioridad: 1
            });
        }
        
        // Ordenar eventos por prioridad
        eventosDelDia.sort((a, b) => a.prioridad - b.prioridad);
        
        // Guardar en historial
        this.addToHistory(currentDate, eventosDelDia);
        
        return eventosDelDia;
    }
    
    // Procesar cumpleaños y retiros
    processBirthdays(currentDate, playersManager) {
        // Filtrar solo cumpleaños del club seleccionado
        const allBirthdays = playersManager.checkBirthdays(currentDate);
        const clubSeleccionado = localStorage.getItem("selectedClub");
        let clubIdSeleccionado = null;
        
        if (clubSeleccionado && typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.nombre === clubSeleccionado);
            if (club) {
                clubIdSeleccionado = club.id;
            }
        }
        
        // Filtrar cumpleaños solo del club seleccionado
        const birthdayPlayersFiltered = allBirthdays.birthdayPlayers.filter(player => {
            if (!clubIdSeleccionado) return false;
            
            // Buscar el jugador en el club seleccionado
            const jugadoresClub = playersManager.jugadoresPorClub[clubIdSeleccionado] || [];
            return jugadoresClub.some(jugador => jugador.nombre === player.nombre);
        });
        
        return {
            birthdayPlayers: birthdayPlayersFiltered,
            lastYearPlayers: allBirthdays.lastYearPlayers || [],
            retiredPlayers: allBirthdays.retiredPlayers || []
        };
    }
    
    // Procesar degradación por inactividad
    processDegradation(playersManager) {
        if (typeof aplicarDegradacionPorInactividad === 'function') {
            return aplicarDegradacionPorInactividad();
        }
        
        // Implementación local si la función externa no existe
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return false;
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        let cambiosRealizados = false;
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach(jugador => {
                // Degradación muy pequeña: 0.05% del general por día
                const degradacionDiaria = jugador.general * 0.0005;
                const nuevoGeneral = Math.max(jugador.general - degradacionDiaria, jugador.general * 0.8);
                
                if (nuevoGeneral !== jugador.general) {
                    jugador.general = Math.round(nuevoGeneral * 100) / 100;
                    cambiosRealizados = true;
                }
                
                // Degradación del estado físico
                if (jugador.estadoFisico > 70) {
                    const degradacionFisica = 0.1;
                    jugador.estadoFisico = Math.max(jugador.estadoFisico - degradacionFisica, 70);
                    cambiosRealizados = true;
                }
                
                // Recuperación natural del cansancio
                if (jugador.cansancio > 0) {
                    const recuperacionNatural = 2;
                    jugador.cansancio = Math.max(jugador.cansancio - recuperacionNatural, 0);
                    cambiosRealizados = true;
                }
            });
        });
        
        if (cambiosRealizados) {
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            playersManager.jugadoresPorClub = jugadoresPorClub;
        }
        
        return cambiosRealizados;
    }
    
    // Procesar eventos aleatorios de cansancio
    processRandomFatigueEvents(playersManager) {
        if (typeof aplicarEventosAleatoriosCansancio === 'function') {
            return aplicarEventosAleatoriosCansancio();
        }
        
        // Implementación local si la función externa no existe
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return [];
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        let eventosAplicados = [];
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach(jugador => {
                // Probabilidad muy baja de evento aleatorio por día (1% por jugador)
                if (Math.random() < 0.01) {
                    const evento = this.getRandomFatigueEvent();
                    if (evento) {
                        // Aplicar efectos del evento
                        jugador.cansancio = Math.min(100, Math.max(0, jugador.cansancio - evento.impactoEnergia));
                        jugador.resistencia = Math.min(100, Math.max(0, jugador.resistencia + evento.impactoResistencia));
                        jugador.estadoFisico = Math.min(100, Math.max(50, jugador.estadoFisico + evento.impactoEnergia / 2));
                        
                        eventosAplicados.push({
                            jugador: jugador.nombre,
                            evento: evento.tipo,
                            descripcion: evento.descripcion,
                            club: this.getClubName(clubId)
                        });
                    }
                }
            });
        });
        
        if (eventosAplicados.length > 0) {
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            playersManager.jugadoresPorClub = jugadoresPorClub;
        }
        
        return eventosAplicados;
    }
    
    // Procesar recuperación de lesiones
    processInjuryRecovery(playersManager) {
        if (typeof procesarRecuperacionLesiones === 'function') {
            return procesarRecuperacionLesiones();
        }
        
        // Implementación local si la función externa no existe
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return [];
        
        const jugadoresPorClub = JSON.parse(jugadoresData);
        let jugadoresRecuperados = [];
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            jugadoresClub.forEach(jugador => {
                if (jugador.lesion && jugador.lesion.diasRestantes > 0) {
                    jugador.lesion.diasRestantes--;
                    
                    // Si se recuperó completamente
                    if (jugador.lesion.diasRestantes <= 0) {
                        jugadoresRecuperados.push({
                            nombre: jugador.nombre,
                            lesion: jugador.lesion.nombre,
                            club: this.getClubName(clubId)
                        });
                        jugador.lesion = null; // Quitar la lesión
                    }
                }
            });
        });
        
        if (jugadoresRecuperados.length > 0) {
            localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            playersManager.jugadoresPorClub = jugadoresPorClub;
        }
        
        return jugadoresRecuperados;
    }
    
    // Procesar eventos especiales según la fecha
    processSpecialDateEvents(currentDate, playersManager) {
        let eventosEspeciales = [];
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        
        // Año Nuevo
        if (month === 1 && day === 1) {
            eventosEspeciales.push({
                tipo: 'año_nuevo',
                titulo: '🎊 ¡Feliz Año Nuevo!',
                descripcion: `Comienza el año ${currentDate.getFullYear()}. Los jugadores están motivados para la nueva temporada.`,
                efecto: 'moral_positiva'
            });
        }
        
        // Navidad
        if (month === 12 && day === 25) {
            eventosEspeciales.push({
                tipo: 'navidad',
                titulo: '🎄 ¡Feliz Navidad!',
                descripcion: 'Los jugadores celebran las fiestas navideñas con sus familias.',
                efecto: 'descanso_extra'
            });
        }
        
        // Inicio de temporada (Febrero)
        if (month === 2 && day === 1) {
            eventosEspeciales.push({
                tipo: 'inicio_temporada',
                titulo: '⚽ Inicio de Temporada',
                descripcion: 'Comienza oficialmente la nueva temporada de fútbol.',
                efecto: 'preparacion_fisica'
            });
        }
        
        // Final de temporada (Diciembre)
        if (month === 12 && day === 31) {
            eventosEspeciales.push({
                tipo: 'fin_temporada',
                titulo: '🏆 Fin de Temporada',
                descripcion: 'Termina la temporada. Los jugadores se preparan para el descanso.',
                efecto: 'evaluacion_anual'
            });
        }
        
        return eventosEspeciales;
    }
    
    // Obtener evento aleatorio de cansancio
    getRandomFatigueEvent() {
        if (typeof eventosCansancio !== 'undefined' && eventosCansancio.length > 0) {
            // Filtrar solo eventos fuera del campo
            const eventosFueraCampo = eventosCansancio.filter(evento => 
                evento.tipo.includes("Fiesta") || 
                evento.tipo.includes("Desvelada") || 
                evento.tipo.includes("Ampay") || 
                evento.tipo.includes("Salida") || 
                evento.tipo.includes("Dormir") || 
                evento.tipo.includes("Comer") || 
                evento.tipo.includes("Bebidas") || 
                evento.tipo.includes("Videojuegos") || 
                evento.tipo.includes("Discoteca") || 
                evento.tipo.includes("Viajes personales") || 
                evento.tipo.includes("Entrevistas")
            );
            
            if (eventosFueraCampo.length > 0) {
                const index = Math.floor(Math.random() * eventosFueraCampo.length);
                return eventosFueraCampo[index];
            }
        }
        return null;
    }
    
    // Obtener nombre del club
    getClubName(clubId) {
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    }
    
    // Verificar si hay eventos
    hasEvents(eventData) {
        if (!eventData) return false;
        
        return (eventData.birthdayPlayers && eventData.birthdayPlayers.length > 0) ||
               (eventData.lastYearPlayers && eventData.lastYearPlayers.length > 0) ||
               (eventData.retiredPlayers && eventData.retiredPlayers.length > 0);
    }
    
    // Agregar al historial de eventos
    addToHistory(date, eventos) {
        this.eventHistory.unshift({
            date: new Date(date),
            eventos: eventos,
            timestamp: Date.now()
        });
        
        // Mantener solo los últimos días
        if (this.eventHistory.length > this.maxHistoryDays) {
            this.eventHistory = this.eventHistory.slice(0, this.maxHistoryDays);
        }
    }
    
    // Obtener historial de eventos
    getEventHistory(days = 7) {
        return this.eventHistory.slice(0, days);
    }
    
    // Obtener estadísticas de eventos
    getEventStats() {
        const stats = {
            totalEventDays: this.eventHistory.length,
            eventTypes: {},
            recentActivity: 0
        };
        
        this.eventHistory.forEach(day => {
            day.eventos.forEach(evento => {
                if (!stats.eventTypes[evento.tipo]) {
                    stats.eventTypes[evento.tipo] = 0;
                }
                stats.eventTypes[evento.tipo]++;
            });
            
                        // Actividad reciente (últimos 7 días)
            const daysDiff = (Date.now() - day.timestamp) / (1000 * 60 * 60 * 24);
            if (daysDiff <= 7) {
                stats.recentActivity += day.eventos.length;
            }
        });
        
        return stats;
    }
    
    // Limpiar historial de eventos
    clearHistory() {
        this.eventHistory = [];
    }
    
    // Buscar eventos por tipo
    findEventsByType(eventType, days = 30) {
        const results = [];
        const limitedHistory = this.eventHistory.slice(0, days);
        
        limitedHistory.forEach(day => {
            const matchingEvents = day.eventos.filter(evento => evento.tipo === eventType);
            if (matchingEvents.length > 0) {
                results.push({
                    date: day.date,
                    eventos: matchingEvents
                });
            }
        });
        
        return results;
    }
    
    // Obtener resumen del día anterior
    getYesterdaySummary() {
        if (this.eventHistory.length < 2) return null;
        
        const yesterday = this.eventHistory[1]; // [0] es hoy, [1] es ayer
        if (!yesterday) return null;
        
        const summary = {
            date: yesterday.date,
            totalEvents: yesterday.eventos.length,
            eventTypes: yesterday.eventos.map(e => e.tipo),
            hasImportantEvents: yesterday.eventos.some(e => e.prioridad <= 2)
        };
        
        return summary;
    }
    
    // Predecir eventos futuros (para planificación)
    predictUpcomingEvents(playersManager, daysAhead = 7) {
        const predictions = [];
        const currentDate = new Date();
        
        for (let i = 1; i <= daysAhead; i++) {
            const futureDate = new Date(currentDate);
            futureDate.setDate(currentDate.getDate() + i);
            
            const prediction = {
                date: new Date(futureDate),
                predictedEvents: []
            };
            
            // Predecir cumpleaños
            const month = futureDate.getMonth() + 1;
            const day = futureDate.getDate();
            
            Object.keys(playersManager.jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = playersManager.jugadoresPorClub[clubId];
                
                jugadoresClub.forEach(jugador => {
                    if (jugador.birthdayMonth === month && jugador.birthdayDay === day) {
                        prediction.predictedEvents.push({
                            tipo: 'cumpleanos_predicho',
                            jugador: jugador.nombre,
                            nuevaEdad: jugador.edad + 1,
                            club: this.getClubName(clubId)
                        });
                    }
                });
            });
            
            // Predecir recuperaciones de lesiones
            Object.keys(playersManager.jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = playersManager.jugadoresPorClub[clubId];
                
                jugadoresClub.forEach(jugador => {
                    if (jugador.lesion && jugador.lesion.diasRestantes === i) {
                        prediction.predictedEvents.push({
                            tipo: 'recuperacion_predicha',
                            jugador: jugador.nombre,
                            lesion: jugador.lesion.nombre,
                            club: this.getClubName(clubId)
                        });
                    }
                });
            });
            
            // Solo agregar días con eventos predichos
            if (prediction.predictedEvents.length > 0) {
                predictions.push(prediction);
            }
        }
        
        return predictions;
    }
    
    // Generar reporte semanal
    generateWeeklyReport() {
        const weeklyEvents = this.getEventHistory(7);
        const report = {
            period: '7 días',
            totalDays: weeklyEvents.length,
            totalEvents: 0,
            eventBreakdown: {},
            highlights: []
        };
        
        weeklyEvents.forEach(day => {
            report.totalEvents += day.eventos.length;
            
            day.eventos.forEach(evento => {
                if (!report.eventBreakdown[evento.tipo]) {
                    report.eventBreakdown[evento.tipo] = 0;
                }
                report.eventBreakdown[evento.tipo]++;
                
                // Agregar eventos destacados
                if (evento.prioridad <= 2) {
                    report.highlights.push({
                        date: day.date,
                        tipo: evento.tipo,
                        data: evento.data
                    });
                }
            });
        });
        
        return report;
    }
    
    // Verificar si es un día especial
    isSpecialDay(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const specialDays = [
            { month: 1, day: 1, name: 'Año Nuevo' },
            { month: 2, day: 1, name: 'Inicio de Temporada' },
            { month: 12, day: 25, name: 'Navidad' },
            { month: 12, day: 31, name: 'Fin de Temporada' }
        ];
        
        return specialDays.find(special => special.month === month && special.day === day);
    }
    
    // Obtener eventos del club seleccionado únicamente
    getMyClubEvents(eventos) {
        const clubSeleccionado = localStorage.getItem("selectedClub");
        if (!clubSeleccionado) return eventos;
        
        return eventos.filter(evento => {
            if (evento.tipo === 'cumpleanos') {
                // Solo cumpleaños del club seleccionado (ya filtrado en processBirthdays)
                return true;
            }
            
            if (evento.tipo === 'eventos_cansancio' || evento.tipo === 'recuperaciones') {
                // Filtrar eventos que involucren jugadores del club seleccionado
                if (Array.isArray(evento.data)) {
                    evento.data = evento.data.filter(item => item.club === clubSeleccionado);
                    return evento.data.length > 0;
                }
            }
            
            // Otros tipos de eventos se muestran siempre
            return true;
        });
    }
}
