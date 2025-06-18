// ==================== CALENDARIO - INTERFAZ DE USUARIO ====================

// Extender AutoCalendar con funcionalidades de UI
Object.assign(AutoCalendar.prototype, {
    
    updateWeekCalendar() {
        if (!this.weekDaysElement) return;
        
        try {
            const currentDate = new Date(this.currentDate);
            const dayOfWeek = currentDate.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            
            const monday = new Date(currentDate);
            monday.setDate(currentDate.getDate() + mondayOffset);
            
            const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            
            this.weekDaysElement.innerHTML = '';
            
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(monday);
                dayDate.setDate(monday.getDate() + i);
                
                const dayElement = this.createWeekDayElement(dayDate, dayNames[i]);
                this.weekDaysElement.appendChild(dayElement);
            }
            
            setTimeout(() => {
                this.applyWeekTransitions();
            }, 50);
        } catch (error) {
            console.error('Error actualizando calendario semanal:', error);
        }
    },
    
    createWeekDayElement(date, dayName) {
        const dayElement = document.createElement('div');
        dayElement.className = 'week-day';
        
        const today = new Date(this.currentDate);
        const isToday = this.isSameDay(date, today);
        const isPast = date < today;
        const isFuture = date > today;
        
        if (isToday) {
            dayElement.classList.add('current');
        } else if (isPast) {
            dayElement.classList.add('past');
        } else if (isFuture) {
            dayElement.classList.add('future');
        }

        // Verificar si hay partidos este día para mi club
        try {
            const fechaStr = date.toISOString().split('T')[0];
            const partidosDelDia = this.getMatchesForDate(fechaStr);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            const clubSeleccionadoId = this.getClubIdFromName(clubSeleccionado);
            
            const partidoDelClub = partidosDelDia.find(partido => 
                partido.local === clubSeleccionadoId || partido.visitante === clubSeleccionadoId
            );
            
            const dayNameElement = document.createElement('div');
            dayNameElement.className = 'week-day-name';
            dayNameElement.textContent = dayName;
            
            const dayNumberElement = document.createElement('div');
            dayNumberElement.className = 'week-day-number';
            dayNumberElement.textContent = date.getDate();
            
            dayElement.appendChild(dayNameElement);
            dayElement.appendChild(dayNumberElement);
            
            // Si hay partido del club, mostrar información del rival
            if (partidoDelClub) {
                dayElement.classList.add('match-day');
                
                const rivalId = partidoDelClub.local === clubSeleccionadoId 
                    ? partidoDelClub.visitante 
                    : partidoDelClub.local;
                
                const rivalNombre = this.getClubNameFromId(rivalId);
                const esLocal = partidoDelClub.local === clubSeleccionadoId;
                
                const matchInfoElement = document.createElement('div');
                matchInfoElement.className = 'match-info';
                
                const rivalElement = document.createElement('div');
                rivalElement.className = 'rival-name';
                rivalElement.textContent = `${esLocal ? 'vs' : '@'} ${rivalNombre}`;
                
                // Validar que existe la hora
                if (partidoDelClub.hora) {
                    const horaElement = document.createElement('div');
                    horaElement.className = 'match-time';
                    horaElement.textContent = partidoDelClub.hora;
                    matchInfoElement.appendChild(horaElement);
                }
                
                const torneoElement = document.createElement('div');
                torneoElement.className = 'match-tournament';
                torneoElement.textContent = this.getTournamentName(partidoDelClub);
                
                matchInfoElement.appendChild(rivalElement);
                matchInfoElement.appendChild(torneoElement);
                
                dayElement.appendChild(matchInfoElement);
            }
            
            // NUEVO: Verificar si hay entrenamientos asignados para ese día
            const entrenamientosDelDia = this.getEntrenamientosForDate(date);
            if (entrenamientosDelDia.length > 0) {
                dayElement.classList.add('training-day');
                
                // Crear ícono imagen del cono de entrenamiento
                const trainingIcon = document.createElement('img');
                trainingIcon.src = 'photos/cone.png';
                trainingIcon.alt = `Entrenamientos asignados: ${entrenamientosDelDia.map(e => e.jugadorNombre).join(', ')}`;
                trainingIcon.className = 'training-icon';
                trainingIcon.style.cssText = `
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    pointer-events: none;
                    z-index: 2;
                    opacity: 0.8;
                `;
                trainingIcon.title = `Entrenamientos: ${entrenamientosDelDia.length} jugador(es)`;
                
                // Hacer el elemento contenedor posición relativa para el ícono absoluto
                dayElement.style.position = 'relative';
                dayElement.appendChild(trainingIcon);
                
                // Agregar información de entrenamientos como tooltip
                const entrenamientosInfo = entrenamientosDelDia.map(e => 
                    `${e.jugadorNombre}: ${e.entrenamientoNombre}`
                ).join('\n');
                dayElement.title = `Entrenamientos del día:\n${entrenamientosInfo}`;
            }
            
            dayElement.setAttribute('data-date', fechaStr);
            dayElement.setAttribute('data-day-name', dayName);
            
        } catch (error) {
            console.error('Error creando elemento del día:', error);
            
            // Fallback: crear elemento básico sin información de partidos ni entrenamientos
            const dayNameElement = document.createElement('div');
            dayNameElement.className = 'week-day-name';
            dayNameElement.textContent = dayName;
            
            const dayNumberElement = document.createElement('div');
            dayNumberElement.className = 'week-day-number';
            dayNumberElement.textContent = date.getDate();
            
            dayElement.appendChild(dayNameElement);
            dayElement.appendChild(dayNumberElement);
        }
        
        return dayElement;
    },
    
    applyWeekTransitions() {
        if (!this.weekDaysElement) return;
        
        try {
            const weekDays = this.weekDaysElement.querySelectorAll('.week-day');
            
            weekDays.forEach((dayElement, index) => {
                dayElement.style.transitionDelay = `${index * 0.1}s`;
                dayElement.offsetHeight; // Force reflow
                dayElement.classList.add('animated');
            });
            
            setTimeout(() => {
                weekDays.forEach(dayElement => {
                    dayElement.style.transitionDelay = '';
                });
            }, 1000);
        } catch (error) {
            console.error('Error aplicando transiciones:', error);
        }
    }
    
});
