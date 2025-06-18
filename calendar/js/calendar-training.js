// ==================== CALENDARIO - INTEGRACIÓN ENTRENAMIENTOS ====================

// Extender AutoCalendar con funcionalidades de entrenamientos
Object.assign(AutoCalendar.prototype, {
    
    // NUEVO MÉTODO: Obtener entrenamientos asignados para una fecha específica
    getEntrenamientosForDate(date) {
        const entrenamientosAsignados = JSON.parse(localStorage.getItem('entrenamientosAsignados')) || {};
        const entrenamientosDelDia = [];
        const clubSeleccionado = localStorage.getItem("selectedClub");

        for (const jugadorId in entrenamientosAsignados) {
            entrenamientosAsignados[jugadorId].forEach(asignacion => {
                const fechaInicio = new Date(asignacion.fechaInicio);
                const fechaFin = new Date(asignacion.fechaFin);

                // Normalizamos fechas para comparar solo la fecha (sin horas)
                const fechaCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const inicioCompare = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
                const finCompare = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());

                if (fechaCompare >= inicioCompare && fechaCompare <= finCompare) {
                    // Solo incluir entrenamientos de jugadores del club seleccionado
                    const jugadoresData = localStorage.getItem("jugadoresPorClub");
                    if (jugadoresData) {
                        try {
                            const jugadoresPorClub = JSON.parse(jugadoresData);
                            for (const clubId in jugadoresPorClub) {
                                const jugadoresClub = jugadoresPorClub[clubId];
                                if (Array.isArray(jugadoresClub)) {
                                    const jugador = jugadoresClub.find(j => j.id == jugadorId);
                                    if (jugador && this.getClubNameFromId(clubId) === clubSeleccionado) {
                                        entrenamientosDelDia.push({
                                            jugadorId,
                                            jugadorNombre: jugador.nombre,
                                            entrenamientoNombre: asignacion.entrenamientoNombre
                                        });
                                        break;
                                    }
                                }
                            }
                        } catch (error) {
                            console.error('Error procesando entrenamientos:', error);
                        }
                    }
                }
            });
        }

        return entrenamientosDelDia;
    }
    
});
