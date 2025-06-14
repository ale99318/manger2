// ==================== CALENDARIO AUTOMÁTICO - EVENTS ====================

// Extender la clase AutoCalendar con métodos de eventos
Object.assign(AutoCalendar.prototype, {
    
    processBirthdays(month, day) {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            let birthdayCount = 0;
            
            Object.keys(jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = jugadoresPorClub[clubId];
                
                if (Array.isArray(jugadoresClub)) {
                    jugadoresClub.forEach(jugador => {
                        if (jugador.birthdayMonth === month && jugador.birthdayDay === day) {
                            jugador.edad += 1;
                            birthdayCount++;
                            
                            if (this.getClubNameFromId(clubId) === clubSeleccionado) {
                                console.log(`🎂 ${jugador.nombre} cumple ${jugador.edad} años - ${clubSeleccionado}`);
                            }
                            
                            if (jugador.edad >= 36 && !jugador.ultimoAnio && jugador.general >= 80) {
                                jugador.ultimoAnio = true;
                                console.log(`📢 ${jugador.nombre} (${jugador.general} GEN) anuncia que será su última temporada - ${clubSeleccionado}`);
                            }
                        }
                    });
                }
            });
            
            if (birthdayCount > 0) {
                localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            }
        } catch (error) {
            console.error('Error procesando cumpleaños:', error);
        }
    },
    
    processRetirements() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            
            if (typeof retiroManager !== 'undefined' && retiroManager) {
                const retiredPlayers = retiroManager.checkRetirements(this.currentDate, jugadoresPorClub);
                
                retiredPlayers.forEach(retiro => {
                    console.log(`👋 ${retiro.nombre} (${retiro.edad} años, ${retiro.posicion}) se retira: ${retiro.razon} - ${retiro.club}`);
                });
                
                if (retiredPlayers.length > 0) {
                    localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
                }
            }
        } catch (error) {
            console.error('Error procesando retiros:', error);
        }
    },
    
    processRandomInjuries() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            
            if (typeof lesionesManager !== 'undefined' && lesionesManager) {
                const lesionesDelDia = lesionesManager.procesarLesionesDelDia(jugadoresPorClub);
                
                lesionesDelDia.forEach(lesionData => {
                    let mostrarLesion = false;
                    
                    if (lesionData.club === clubSeleccionado) {
                        mostrarLesion = true;
                    } else if (lesionData.general >= 80) {
                        mostrarLesion = true;
                    } else if (lesionData.gravedad === 'grave' || lesionData.gravedad === 'crítica') {
                        mostrarLesion = true;
                    }
                    
                    if (mostrarLesion) {
                        if (lesionData.club === clubSeleccionado) {
                            console.log(`🚑 ${lesionData.jugador} se lesiona: ${lesionData.lesion} (${lesionData.dias} días)`);
                        } else {
                            const detalles = lesionData.general >= 80 ? ` (${lesionData.general} GEN)` : '';
                            console.log(`🚑 ${lesionData.jugador}${detalles} se lesiona: ${lesionData.lesion} (${lesionData.dias} días) - ${lesionData.club}`);
                        }
                    }
                });
                
                if (lesionesDelDia.length > 0) {
                    localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
                }
            }
        } catch (error) {
            console.error('Error procesando lesiones:', error);
        }
    },
    
    processInjuryRecovery() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            const clubSeleccionado = localStorage.getItem("selectedClub");
            let recoveries = 0;
            
            Object.keys(jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = jugadoresPorClub[clubId];
                const clubName = this.getClubNameFromId(clubId);
                
                if (Array.isArray(jugadoresClub)) {
                    jugadoresClub.forEach(jugador => {
                        if (jugador.lesion && jugador.lesion.diasRestantes > 0) {
                            jugador.lesion.diasRestantes--;
                            
                            if (jugador.lesion.diasRestantes <= 0) {
                                let mostrarRecuperacion = false;
                                
                                if (clubName === clubSeleccionado) {
                                    mostrarRecuperacion = true;
                                } else if (jugador.general >= 80) {
                                    mostrarRecuperacion = true;
                                } else if (jugador.lesion.gravedad === 'grave' || jugador.lesion.gravedad === 'crítica') {
                                    mostrarRecuperacion = true;
                                }
                                
                                if (mostrarRecuperacion) {
                                    if (clubName === clubSeleccionado) {
                                        console.log(`🏥 ${jugador.nombre} se recupera de: ${jugador.lesion.nombre}`);
                                    } else {
                                        const detalles = jugador.general >= 80 ? ` (${jugador.general} GEN)` : '';
                                        console.log(`🏥 ${jugador.nombre}${detalles} se recupera de: ${jugador.lesion.nombre} - ${clubName}`);
                                    }
                                }
                                
                                jugador.lesion = null;
                                recoveries++;
                            }
                        }
                    });
                }
            });
            
            if (recoveries > 0) {
                localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            }
        } catch (error) {
            console.error('Error procesando recuperaciones:', error);
        }
    },
    
    applyDegradation() {
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (!jugadoresData) return;
        
        try {
            const jugadoresPorClub = JSON.parse(jugadoresData);
            let cambiosRealizados = false;
            
            Object.keys(jugadoresPorClub).forEach(clubId => {
                const jugadoresClub = jugadoresPorClub[clubId];
                
                if (Array.isArray(jugadoresClub)) {
                    jugadoresClub.forEach(jugador => {
                        const degradacion = jugador.general * 0.0005;
                        const nuevoGeneral = Math.max(jugador.general - degradacion, jugador.general * 0.8);
                        
                        if (nuevoGeneral !== jugador.general) {
                            jugador.general = nuevoGeneral;
                            cambiosRealizados = true;
                        }
                        
                        if (jugador.cansancio > 0) {
                            jugador.cansancio = Math.max(jugador.cansancio - 1, 0);
                            cambiosRealizados = true;
                        }
                    });
                }
            });
            
            if (cambiosRealizados) {
                localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
            }
        } catch (error) {
            console.error('Error aplicando degradación:', error);
        }
    },
    
    processRandomEvents() {
        try {
            if (typeof eventsManager !== 'undefined' && eventsManager) {
                const eventosDelDia = eventsManager.procesarEventosDelDia();
                
                eventosDelDia.forEach(evento => {
                    console.log(`🍺 Evento de indisciplina: ${evento.nombre}`);
                });
            }
        } catch (error) {
            console.error('Error procesando eventos:', error);
        }
    }
    
});
