// ==================== CALENDARIO - PARTIDOS Y TORNEOS ====================

// Extender AutoCalendar con funcionalidades de partidos y torneos
Object.assign(AutoCalendar.prototype, {
    
    // Obtener partidos de una fecha específica
    getMatchesForDate(fecha) {
        const partidos = [];
        
        // Corregido: Verificar si ligaPeruana está definida y no es vacía
        if (typeof ligaPeruana === 'undefined' || !ligaPeruana) {
            return partidos;
        }
        
        try {
            // Buscar en Apertura
            if (ligaPeruana.fixtures?.apertura?.fechas) {
                ligaPeruana.fixtures.apertura.fechas.forEach(fechaFixture => {
                    if (fechaFixture.partidos) {
                        fechaFixture.partidos.forEach(partido => {
                            if (partido.fecha === fecha) {
                                partidos.push({ 
                                    ...partido, 
                                    torneo: 'apertura', 
                                    fechaNumero: fechaFixture.numero 
                                });
                            }
                        });
                    }
                });
            }
            
            // Buscar en Clausura
            if (ligaPeruana.fixtures?.clausura?.fechas) {
                ligaPeruana.fixtures.clausura.fechas.forEach(fechaFixture => {
                    if (fechaFixture.partidos) {
                        fechaFixture.partidos.forEach(partido => {
                            if (partido.fecha === fecha) {
                                partidos.push({ 
                                    ...partido, 
                                    torneo: 'clausura', 
                                    fechaNumero: fechaFixture.numero 
                                });
                            }
                        });
                    }
                });
            }
            
            // Buscar en Playoffs
            if (ligaPeruana.fixtures?.playoffs) {
                const playoffs = ligaPeruana.fixtures.playoffs;
                if (playoffs.semifinales?.partidos) {
                    playoffs.semifinales.partidos.forEach(partido => {
                        if (partido.fecha === fecha && partido.local && partido.visitante) {
                            partidos.push({ ...partido, torneo: 'playoffs' });
                        }
                    });
                }
                if (playoffs.final?.partidos) {
                    playoffs.final.partidos.forEach(partido => {
                        if (partido.fecha === fecha && partido.local && partido.visitante) {
                            partidos.push({ ...partido, torneo: 'playoffs' });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error obteniendo partidos:', error);
        }
        
        return partidos;
    },

    // Obtener nombre del torneo
    getTournamentName(partido) {
        switch(partido.torneo) {
            case 'apertura': return `Apertura - Fecha ${partido.fechaNumero}`;
            case 'clausura': return `Clausura - Fecha ${partido.fechaNumero}`;
            case 'playoffs': 
                if (partido.fase === 'semifinal') {
                    return `Semifinal ${partido.semifinal} - ${partido.partido}`;
                } else if (partido.fase === 'final') {
                    return `Final - ${partido.partido}`;
                }
                return 'Playoffs';
            default: return 'Liga1';
        }
    }
    
});
