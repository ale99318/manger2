// ==================== VISUALIZACIÓN Y FORMATEO DEL CALENDARIO ====================
class CalendarDisplay {
    constructor() {
        this.eventLogElement = null;
        this.initializeElements();
    }
    
    // Inicializar elementos del DOM
    initializeElements() {
        this.eventLogElement = document.getElementById('event-log');
        this.playersStatsElement = document.getElementById('players-stats');
    }
    
    // ==================== MOSTRAR EVENTOS DEL DÍA ====================
    
    // Mostrar todos los eventos del día
    showDayEvents(eventosDelDia, currentDate) {
        if (!this.eventLogElement) return;
        
        if (eventosDelDia.length === 0) {
            this.showEmptyDay(currentDate);
            return;
        }
        
        const currentDateStr = CalendarUtils.formatDateES(currentDate, 'full');
        let logHTML = `<div class="day-events">
            <h4>📅 ${currentDateStr}</h4>`;
        
        // Procesar cada tipo de evento
        eventosDelDia.forEach(evento => {
            switch (evento.tipo) {
                case 'cumpleanos':
                    logHTML += this.formatBirthdayEvents(evento.data);
                    break;
                case 'degradacion':
                    logHTML += this.formatDegradationEvents();
                    break;
                case 'eventos_cansancio':
                    logHTML += this.formatFatigueEvents(evento.data);
                    break;
                case 'recuperaciones':
                    logHTML += this.formatRecoveryEvents(evento.data);
                    break;
                case 'eventos_especiales':
                    logHTML += this.formatSpecialEvents(evento.data);
                    break;
                default:
                    logHTML += this.formatGenericEvent(evento);
            }
        });
        
        logHTML += `</div>`;
        this.eventLogElement.innerHTML = logHTML;
        
        // Scroll automático al último evento
        this.scrollToLatest();
    }
    
    // Mostrar día sin eventos
    showEmptyDay(currentDate) {
        if (!this.eventLogElement) return;
        
        const currentDateStr = CalendarUtils.formatDateES(currentDate, 'full');
        const dayName = CalendarUtils.getDayName(currentDate);
        
        this.eventLogElement.innerHTML = `
            <div class="day-events empty-day">
                <h4>📅 ${currentDateStr}</h4>
                <div class="empty-day-content">
                    <p class="no-events">😴 ${dayName} tranquilo. Los jugadores descansan y se mantienen en forma.</p>
                    <div class="background-activities">
                        <p class="degradation-info">📉 Degradación natural aplicada por inactividad (-0.05% nivel general)</p>
                        <p class="recovery-info">💪 Recuperación natural del cansancio (+2 puntos)</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== FORMATEO DE EVENTOS ESPECÍFICOS ====================
    
    // Formatear eventos de cumpleaños
    formatBirthdayEvents(data) {
        let html = '';
        
        // Cumpleaños del club seleccionado
        if (data.birthdayPlayers && data.birthdayPlayers.length > 0) {
            html += `<div class="event-section birthday-section">
                <h5>🎂 Cumpleaños en tu Club (${data.birthdayPlayers.length})</h5>
                <ul class="event-list">`;
            
            data.birthdayPlayers.forEach(player => {
                const ageClass = this.getAgeClass(player.edad);
                html += `<li class="birthday-item ${ageClass}">
                    <span class="player-name">🎉 ${player.nombre}</span>
                    <span class="age-info">cumple ${player.edad} años</span>
                    <span class="club-info">${player.club}</span>
                </li>`;
                
                // Integración con notificaciones
                this.sendNotification('birthday', player);
            });
            
            html += `</ul></div>`;
        }
        
        // Anuncios de último año
        if (data.lastYearPlayers && data.lastYearPlayers.length > 0) {
            html += `<div class="event-section last-year-section">
                <h5>📢 Anuncios de Último Año (${data.lastYearPlayers.length})</h5>
                <ul class="event-list">`;
            
            data.lastYearPlayers.forEach(player => {
                html += `<li class="last-year-item">
                    <span class="announcement-icon">📰</span>
                    <span class="player-info">${player.nombre} (${player.edad} años, ${player.posicion})</span>
                    <span class="announcement-text">anuncia que esta será su última temporada</span>
                    <span class="club-info">${player.club}</span>
                </li>`;
            });
            
            html += `</ul></div>`;
        }
        
        // Retiros oficiales
        if (data.retiredPlayers && data.retiredPlayers.length > 0) {
            html += `<div class="event-section retirement-section">
                <h5>👴 Retiros Oficiales (${data.retiredPlayers.length})</h5>
                <ul class="event-list">`;
            
            data.retiredPlayers.forEach(player => {
                const generalClass = this.getGeneralClass(player.general);
                html += `<li class="retirement-item ${generalClass}">
                    <span class="retirement-icon">👋</span>
                    <span class="player-info">${player.nombre} (${player.edad} años, ${player.posicion})</span>
                    <span class="general-info">GEN: ${player.general}</span>
                    <span class="retirement-text">se retira oficialmente del fútbol</span>
                    <span class="club-info">${player.club}</span>
                </li>`;
                
                // Integración con notificaciones
                this.sendNotification('retirement', player);
            });
            
            html += `</ul></div>`;
        }
        
        return html;
    }
    
    // Formatear eventos de degradación
    formatDegradationEvents() {
        return `<div class="event-section degradation-section">
            <h5>📉 Degradación por Inactividad</h5>
            <div class="degradation-details">
                <div class="degradation-item">
                    <span class="icon">⬇️</span>
                    <span class="text">Nivel general: -0.05% por día</span>
                </div>
                <div class="degradation-item">
                    <span class="icon">💪</span>
                    <span class="text">Estado físico: -0.1 puntos (mínimo 70)</span>
                </div>
                <div class="degradation-item">
                    <span class="icon">😴</span>
                    <span class="text">Recuperación de cansancio: +2 puntos</span>
                </div>
            </div>
        </div>`;
    }
    
    // Formatear eventos de cansancio/indisciplina
    formatFatigueEvents(eventos) {
        if (!eventos || eventos.length === 0) return '';
        
        let html = `<div class="event-section fatigue-section">
            <h5>🍺 Eventos de Indisciplina (${eventos.length})</h5>
            <ul class="event-list">`;
        
        eventos.forEach(evento => {
            const severityClass = this.getSeverityClass(evento.evento);
            html += `<li class="fatigue-item ${severityClass}">
                <span class="fatigue-icon">${this.getFatigueIcon(evento.evento)}</span>
                <span class="player-name">${evento.jugador}</span>
                <span class="event-type">${evento.evento}</span>
                <span class="event-description">${evento.descripcion}</span>
                ${evento.club ? `<span class="club-info">${evento.club}</span>` : ''}
            </li>`;
        });
        
        html += `</ul></div>`;
        return html;
    }
    
    // Formatear eventos de recuperación
    formatRecoveryEvents(recuperaciones) {
        if (!recuperaciones || recuperaciones.length === 0) return '';
        
        let html = `<div class="event-section recovery-section">
            <h5>🏥 Recuperaciones de Lesiones (${recuperaciones.length})</h5>
            <ul class="event-list">`;
        
        recuperaciones.forEach(recuperacion => {
            html += `<li class="recovery-item">
                <span class="recovery-icon">✅</span>
                <span class="player-name">${recuperacion.nombre}</span>
                <span class="recovery-text">se recupera de:</span>
                <span class="injury-name">${recuperacion.lesion}</span>
                ${recuperacion.club ? `<span class="club-info">${recuperacion.club}</span>` : ''}
            </li>`;
        });
        
        html += `</ul></div>`;
        return html;
    }
    
    // Formatear eventos especiales
    formatSpecialEvents(eventos) {
        if (!eventos || eventos.length === 0) return '';
        
        let html = `<div class="event-section special-section">
            <h5>⭐ Eventos Especiales</h5>
            <ul class="event-list">`;
        
        eventos.forEach(evento => {
            html += `<li class="special-item ${evento.tipo}">
                <span class="special-icon">${this.getSpecialIcon(evento.tipo)}</span>
                <span class="special-title">${evento.titulo}</span>
                <span class="special-description">${evento.descripcion}</span>
            </li>`;
        });
        
        html += `</ul></div>`;
        return html;
    }
    
    // Formatear evento genérico
    formatGenericEvent(evento) {
        return `<div class="event-section generic-section">
            <h5>📋 ${evento.tipo}</h5>
            <div class="generic-content">
                ${JSON.stringify(evento.data, null, 2)}
            </div>
        </div>`;
    }
    
    // ==================== ESTADÍSTICAS DE JUGADORES ====================
    
    // Mostrar estadísticas de jugadores
    showPlayersStats(stats, element) {
        if (!element || !stats) return;
        
        element.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item total-players">
                    <span class="stat-icon">👥</span>
                    <div class="stat-content">
                        <span class="stat-label">Total Jugadores</span>
                        <span class="stat-value">${stats.totalPlayers}</span>
                    </div>
                </div>
                <div class="stat-item total-clubs">
                    <span class="stat-icon">🏟️</span>
                    <div class="stat-content">
                        <span class="stat-label">Clubes Activos</span>
                        <span class="stat-value">${stats.totalClubs}</span>
                    </div>
                </div>
                <div class="stat-item avg-age">
                    <span class="stat-icon">📊</span>
                    <div class="stat-content">
                        <span class="stat-label">Edad Promedio</span>
                        <span class="stat-value">${stats.avgAge} años</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== FUNCIONES AUXILIARES DE FORMATEO ====================
    
    // Obtener clase CSS según edad
    getAgeClass(edad) {
        if (edad <= 22) return 'young-player';
        if (edad <= 30) return 'prime-player';
        if (edad <= 35) return 'veteran-player';
        return 'old-player';
    }
    
    // Obtener clase CSS según habilidad general
    getGeneralClass(general) {
        if (general >= 85) return 'elite-player';
        if (general >= 75) return 'good-player';
        if (general >= 65) return 'average-player';
        return 'poor-player';
    }
    
    // Obtener clase CSS según severidad del evento
    getSeverityClass(eventoTipo) {
        const eventosGraves = ['Fiesta nocturna', 'Discoteca', 'Ampay', 'Bebidas'];
        const eventosModerados = ['Desvelada', 'Videojuegos', 'Comer'];
        
        if (eventosGraves.some(grave => eventoTipo.includes(grave))) return 'severe';
        if (eventosModerados.some(moderado => eventoTipo.includes(moderado))) return 'moderate';
        return 'mild';
    }
    
    // Obtener icono según tipo de evento de cansancio
    getFatigueIcon(eventoTipo) {
        if (eventoTipo.includes('Fiesta')) return '🍻';
        if (eventoTipo.includes('Desvelada')) return '😴';
        if (eventoTipo.includes('Ampay')) return '📸';
        if (eventoTipo.includes('Videojuegos')) return '🎮';
        if (eventoTipo.includes('Discoteca')) return '💃';
        if (eventoTipo.includes('Comer')) return '🍔';
        if (eventoTipo.includes('Bebidas')) return '🍺';
        if (eventoTipo.includes('Dormir')) return '😪';
        return '😅';
    }
    
    // Obtener icono según tipo de evento especial
    getSpecialIcon(eventoTipo) {
        switch (eventoTipo) {
            case 'año_nuevo': return '🎊';
            case 'navidad': return '🎄';
            case 'inicio_temporada': return '⚽';
            case 'fin_temporada': return '🏆';
            default: return '⭐';
        }
    }
    
    // ==================== UTILIDADES DE INTERFAZ ====================
    
    // Scroll automático al último evento
    scrollToLatest() {
        if (this.eventLogElement) {
            this.eventLogElement.scrollTop = this.eventLogElement.scrollHeight;
        }
    }
    
    // Limpiar log de eventos
    clearEventLog() {
        if (this.eventLogElement) {
            this.eventLogElement.innerHTML = '<p class="no-events">Reiniciando calendario...</p>';
        }
    }
    
    // Mostrar mensaje de carga
    showLoading() {
        if (this.eventLogElement) {
            this.eventLogElement.innerHTML = `
                <div class="loading-message">
                    <span class="loading-icon">⏳</span>
                    <span class="loading-text">Cargando eventos...</span>
                </div>
            `;
        }
    }
    
        // Mostrar mensaje de error
    showError(mensaje) {
        if (this.eventLogElement) {
            this.eventLogElement.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">❌</span>
                    <span class="error-text">Error: ${mensaje}</span>
                </div>
            `;
        }
    }
    
    // ==================== NOTIFICACIONES ====================
    
    // Enviar notificación a otros sistemas
    sendNotification(type, data) {
        // Integración con sistema de notificaciones si existe
        if (typeof addBirthdayEvent === 'function' && type === 'birthday') {
            addBirthdayEvent(data);
        }
        
        if (typeof addRetirementEvent === 'function' && type === 'retirement') {
            addRetirementEvent(data);
        }
        
        // Log para depuración
        CalendarUtils.debug(`Notificación enviada: ${type}`, data);
    }
    
    // ==================== HISTORIAL Y RESÚMENES ====================
    
    // Mostrar historial de eventos
    showEventHistory(eventHistory, days = 7) {
        if (!this.eventLogElement) return;
        
        let html = `<div class="event-history">
            <h4>📚 Historial de Eventos (${days} días)</h4>`;
        
        if (eventHistory.length === 0) {
            html += '<p class="no-history">No hay eventos en el historial.</p>';
        } else {
            eventHistory.forEach(day => {
                const dateStr = CalendarUtils.formatDateES(day.date, 'short');
                html += `<div class="history-day">
                    <h5>${dateStr}</h5>
                    <ul class="history-events">`;
                
                day.eventos.forEach(evento => {
                    html += `<li class="history-event ${evento.tipo}">
                        ${this.getEventSummary(evento)}
                    </li>`;
                });
                
                html += `</ul></div>`;
            });
        }
        
        html += '</div>';
        this.eventLogElement.innerHTML = html;
    }
    
    // Obtener resumen de evento para historial
    getEventSummary(evento) {
        switch (evento.tipo) {
            case 'cumpleanos':
                const totalBirthdays = (evento.data.birthdayPlayers?.length || 0) + 
                                     (evento.data.retiredPlayers?.length || 0);
                return `🎂 ${totalBirthdays} cumpleaños/retiros`;
            
            case 'eventos_cansancio':
                return `🍺 ${evento.data.length} eventos de indisciplina`;
            
            case 'recuperaciones':
                return `🏥 ${evento.data.length} recuperaciones`;
            
            case 'degradacion':
                return `📉 Degradación aplicada`;
            
            default:
                return `📋 ${evento.tipo}`;
        }
    }
    
    // Mostrar resumen semanal
    showWeeklySummary(weeklyReport) {
        if (!this.eventLogElement) return;
        
        const html = `
            <div class="weekly-summary">
                <h4>📊 Resumen Semanal</h4>
                <div class="summary-stats">
                    <div class="summary-item">
                        <span class="summary-label">Período:</span>
                        <span class="summary-value">${weeklyReport.period}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Total Eventos:</span>
                        <span class="summary-value">${weeklyReport.totalEvents}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Días con Actividad:</span>
                        <span class="summary-value">${weeklyReport.totalDays}</span>
                    </div>
                </div>
                
                <div class="event-breakdown">
                    <h5>Desglose por Tipo:</h5>
                    <ul class="breakdown-list">
                        ${Object.entries(weeklyReport.eventBreakdown).map(([tipo, cantidad]) => 
                            `<li class="breakdown-item">
                                <span class="breakdown-type">${this.getEventTypeName(tipo)}</span>
                                <span class="breakdown-count">${cantidad}</span>
                            </li>`
                        ).join('')}
                    </ul>
                </div>
                
                ${weeklyReport.highlights.length > 0 ? `
                    <div class="highlights">
                        <h5>Eventos Destacados:</h5>
                        <ul class="highlights-list">
                            ${weeklyReport.highlights.map(highlight => 
                                `<li class="highlight-item">
                                    <span class="highlight-date">${CalendarUtils.formatDateES(highlight.date, 'short')}</span>
                                    <span class="highlight-event">${this.getEventTypeName(highlight.tipo)}</span>
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
        
        this.eventLogElement.innerHTML = html;
    }
    
    // Obtener nombre legible del tipo de evento
    getEventTypeName(tipo) {
        const nombres = {
            'cumpleanos': 'Cumpleaños y Retiros',
            'eventos_cansancio': 'Indisciplina',
            'recuperaciones': 'Recuperaciones',
            'degradacion': 'Degradación',
            'eventos_especiales': 'Eventos Especiales'
        };
        
        return nombres[tipo] || tipo;
    }
    
    // ==================== PREDICCIONES ====================
    
    // Mostrar predicciones de eventos futuros
    showPredictions(predictions) {
        if (!this.eventLogElement || !predictions || predictions.length === 0) {
            this.showNoPredictions();
            return;
        }
        
        let html = `<div class="predictions">
            <h4>🔮 Próximos Eventos</h4>`;
        
        predictions.forEach(prediction => {
            const dateStr = CalendarUtils.formatDateES(prediction.date, 'short');
            html += `<div class="prediction-day">
                <h5>${dateStr}</h5>
                <ul class="predicted-events">`;
            
            prediction.predictedEvents.forEach(evento => {
                html += `<li class="predicted-event ${evento.tipo}">
                    ${this.formatPredictedEvent(evento)}
                </li>`;
            });
            
            html += `</ul></div>`;
        });
        
        html += '</div>';
        this.eventLogElement.innerHTML = html;
    }
    
    // Formatear evento predicho
    formatPredictedEvent(evento) {
        switch (evento.tipo) {
            case 'cumpleanos_predicho':
                return `🎂 ${evento.jugador} cumplirá ${evento.nuevaEdad} años - ${evento.club}`;
            
            case 'recuperacion_predicha':
                return `🏥 ${evento.jugador} se recuperará de ${evento.lesion} - ${evento.club}`;
            
            default:
                return `📋 ${evento.tipo}: ${evento.jugador}`;
        }
    }
    
    // Mostrar mensaje cuando no hay predicciones
    showNoPredictions() {
        if (this.eventLogElement) {
            this.eventLogElement.innerHTML = `
                <div class="no-predictions">
                    <span class="no-predictions-icon">🔮</span>
                    <span class="no-predictions-text">No hay eventos importantes previstos en los próximos días.</span>
                </div>
            `;
        }
    }
    
    // ==================== FILTROS Y BÚSQUEDA ====================
    
    // Mostrar eventos filtrados
    showFilteredEvents(eventos, filtro) {
        if (!this.eventLogElement) return;
        
        let html = `<div class="filtered-events">
            <h4>🔍 Eventos Filtrados: ${this.getEventTypeName(filtro)}</h4>`;
        
        if (eventos.length === 0) {
            html += '<p class="no-filtered-events">No se encontraron eventos de este tipo.</p>';
        } else {
            eventos.forEach(day => {
                const dateStr = CalendarUtils.formatDateES(day.date, 'short');
                html += `<div class="filtered-day">
                    <h5>${dateStr}</h5>
                    <ul class="filtered-event-list">`;
                
                day.eventos.forEach(evento => {
                    html += `<li class="filtered-event">
                        ${this.getEventSummary(evento)}
                    </li>`;
                });
                
                html += `</ul></div>`;
            });
        }
        
        html += '</div>';
        this.eventLogElement.innerHTML = html;
    }
    
    // ==================== ANIMACIONES Y EFECTOS ====================
    
    // Animar entrada de nuevo evento
    animateNewEvent() {
        if (this.eventLogElement) {
            this.eventLogElement.classList.add('new-event-animation');
            setTimeout(() => {
                this.eventLogElement.classList.remove('new-event-animation');
            }, 1000);
        }
    }
    
    // Resaltar eventos importantes
    highlightImportantEvents() {
        const importantEvents = this.eventLogElement?.querySelectorAll('.birthday-section, .retirement-section, .special-section');
        importantEvents?.forEach(event => {
            event.classList.add('important-highlight');
        });
    }
    
    // ==================== UTILIDADES DE ACCESIBILIDAD ====================
    
    // Agregar atributos de accesibilidad
    addAccessibilityAttributes() {
        if (this.eventLogElement) {
            this.eventLogElement.setAttribute('role', 'log');
            this.eventLogElement.setAttribute('aria-live', 'polite');
            this.eventLogElement.setAttribute('aria-label', 'Registro de eventos del calendario');
        }
    }
    
    // ==================== EXPORTACIÓN Y GUARDADO ====================
    
    // Exportar eventos como texto
    exportEventsAsText(eventos) {
        let text = 'EVENTOS DEL CALENDARIO\n';
        text += '======================\n\n';
        
        eventos.forEach(day => {
            text += `${CalendarUtils.formatDateES(day.date, 'full')}\n`;
            text += '-'.repeat(50) + '\n';
            
            day.eventos.forEach(evento => {
                text += `• ${this.getEventSummary(evento)}\n`;
            });
            
            text += '\n';
        });
        
        return text;
    }
    
    // Guardar configuración de visualización
    saveDisplaySettings(settings) {
        localStorage.setItem('calendarDisplaySettings', JSON.stringify(settings));
    }
    
    // Cargar configuración de visualización
    loadDisplaySettings() {
        const settings = localStorage.getItem('calendarDisplaySettings');
        return settings ? JSON.parse(settings) : this.getDefaultDisplaySettings();
    }
    
    // Configuración por defecto
    getDefaultDisplaySettings() {
        return {
            showDegradation: true,
            showMinorEvents: true,
            animateEvents: true,
            highlightImportant: true,
            autoScroll: true
        };
    }
}
