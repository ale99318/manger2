// Liga1 de Fútbol Profesional 2025 - Torneo Peruano con Calendario
class TorneoPeruano {
    constructor(clubes, fechaInicioTorneo = null) {
        // Filtrar solo clubes peruanos (IDs que empiezan con "51-")
        this.equipos = clubes.filter(club => club.id.startsWith("51-"));
        this.torneoApertura = [];
        this.torneoClausura = [];
        this.tablaAcumulada = [];
        this.playoffs = [];
        this.campeonApertura = null;
        this.campeonClausura = null;
        this.campeonNacional = null;
        this.subcampeon = null;
        this.clasificadosLibertadores = [];
        this.clasificadosSudamericana = [];
        this.descendidos = [];
        this.fechaActual = 1;
        this.torneoActual = 'apertura'; // 'apertura' o 'clausura'
        
        // ✅ NUEVO: Sistema de fechas del calendario
        this.fechaInicioTorneo = fechaInicioTorneo || new Date(2025, 1, 15); // 15 de Febrero 2025
        this.fechasFixture = []; // Array con las fechas reales de cada jornada
        this.resultadosConFecha = []; // Resultados con fecha incluida
        
        this.inicializarTorneos();
        this.generarCalendarioTorneo(); // ✅ NUEVO
    }

    // ✅ NUEVO: Generar calendario con fechas reales
    generarCalendarioTorneo() {
        const fechasApertura = [];
        const fechasClausura = [];
        
        // Generar fechas para Torneo Apertura (cada domingo)
        let fechaActual = new Date(this.fechaInicioTorneo);
        for (let i = 0; i < 18; i++) {
            fechasApertura.push(new Date(fechaActual));
            fechaActual.setDate(fechaActual.getDate() + 7); // Siguiente domingo
        }
        
        // Pausa de 2 semanas entre apertura y clausura
        fechaActual.setDate(fechaActual.getDate() + 14);
        
        // Generar fechas para Torneo Clausura
        for (let i = 0; i < 18; i++) {
            fechasClausura.push(new Date(fechaActual));
            fechaActual.setDate(fechaActual.getDate() + 7); // Siguiente domingo
        }
        
        this.fechasFixture = {
            apertura: fechasApertura,
            clausura: fechasClausura
        };
    }

    // ✅ NUEVO: Obtener próximos partidos con fechas
    obtenerProximosPartidos(cantidadFechas = 3) {
        const fixture = this.torneoActual === 'apertura' ? this.fixtureApertura : this.fixtureClausura;
        const fechasCalendario = this.torneoActual === 'apertura' ? 
            this.fechasFixture.apertura : this.fechasFixture.clausura;
        
        const proximosPartidos = [];
        
        for (let i = this.fechaActual - 1; i < Math.min(this.fechaActual - 1 + cantidadFechas, 18); i++) {
            if (fixture[i] && fechasCalendario[i]) {
                const partidosFecha = fixture[i].map(partido => ({
                    ...partido,
                    fechaCalendario: fechasCalendario[i],
                    fechaString: this.formatearFecha(fechasCalendario[i]),
                    jornadaNumero: i + 1,
                    torneo: this.torneoActual.toUpperCase()
                }));
                
                proximosPartidos.push({
                    jornada: i + 1,
                    fecha: fechasCalendario[i],
                    fechaString: this.formatearFecha(fechasCalendario[i]),
                    partidos: partidosFecha,
                    torneo: this.torneoActual.toUpperCase()
                });
            }
        }
        
        return proximosPartidos;
    }

    // ✅ NUEVO: Formatear fecha como el calendario
    formatearFecha(fecha) {
        const nombresMeses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const dia = fecha.getDate();
        const mes = nombresMeses[fecha.getMonth()];
        const ano = fecha.getFullYear();
        return `${dia} de ${mes} de ${ano}`;
    }

    // ✅ NUEVO: Verificar si hay partidos hoy
    hayPartidosHoy(fechaJuego) {
        const fechasCalendario = this.torneoActual === 'apertura' ? 
            this.fechasFixture.apertura : this.fechasFixture.clausura;
        
        if (this.fechaActual > 18) return false;
        
        const fechaPartido = fechasCalendario[this.fechaActual - 1];
        if (!fechaPartido) return false;
        
        return fechaPartido.toDateString() === fechaJuego.toDateString();
    }

    // ✅ NUEVO: Obtener partidos de hoy
    obtenerPartidosHoy(fechaJuego) {
        if (!this.hayPartidosHoy(fechaJuego)) return null;
        
        const fixture = this.torneoActual === 'apertura' ? this.fixtureApertura : this.fixtureClausura;
        const partidosFecha = fixture[this.fechaActual - 1];
        
        return partidosFecha.map(partido => ({
            ...partido,
            fechaCalendario: fechaJuego,
            fechaString: this.formatearFecha(fechaJuego),
            jornadaNumero: this.fechaActual,
            torneo: this.torneoActual.toUpperCase()
        }));
    }

    // ✅ MODIFICADO: Agregar eventos al calendario automáticamente
    agregarEventosAlCalendario() {
        // Función global del calendario (si existe)
        if (typeof window.agregarEvento === 'function') {
            const proximosPartidos = this.obtenerProximosPartidos(5);
            
            proximosPartidos.forEach(jornada => {
                const partidosTexto = jornada.partidos.map(p => 
                    `${p.nombreLocal} vs ${p.nombreVisitante}`
                ).join(', ');
                
                window.agregarEvento(
                    `🏆 ${jornada.torneo} - Jornada ${jornada.jornada}`,
                    `Partidos: ${partidosTexto}`,
                    jornada.fecha
                );
            });
        }
    }

    inicializarTorneos() {
        // Inicializar tablas de posiciones
        this.torneoApertura = this.crearTablaInicial();
        this.torneoClausura = this.crearTablaInicial();
        this.tablaAcumulada = this.crearTablaInicial();
        
        // Generar fixture para ambos torneos
        this.fixtureApertura = this.generarFixture();
        this.fixtureClausura = this.generarFixture(true); // Invertir localías
        
        // ✅ NUEVO: Agregar eventos al calendario
        this.agregarEventosAlCalendario();
    }

    crearTablaInicial() {
        return this.equipos.map(equipo => ({
            equipo: equipo,
            nombre: equipo.nombre, // Nombre directo
            puntos: 0,
            partidosJugados: 0,
            partidosGanados: 0,
            partidosEmpatados: 0,
            partidosPerdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferenciaGoles: 0,
            fairPlay: 0, // Puntos descontados por tarjetas
            posicion: 0
        }));
    }

    generarFixture(invertirLocalias = false) {
        const equipos = [...this.equipos];
        const fixture = [];
        const numEquipos = equipos.length;
        const numFechas = (numEquipos % 2 === 0) ? numEquipos - 1 : numEquipos;
        
        // Algoritmo round-robin para generar fixture
        if (numEquipos % 2 === 1) {
            equipos.push({ id: 'BYE', nombre: 'Descanso' }); // Equipo ficticio para número impar
        }
        
        for (let fecha = 0; fecha < numFechas; fecha++) {
            const partidosFecha = [];
            
            for (let i = 0; i < equipos.length / 2; i++) {
                const equipoLocal = equipos[i];
                const equipoVisitante = equipos[equipos.length - 1 - i];
                
                if (equipoLocal.id !== 'BYE' && equipoVisitante.id !== 'BYE') {
                    const partido = invertirLocalias ? 
                        { 
                            local: equipoVisitante, 
                            visitante: equipoLocal, 
                            fecha: fecha + 1,
                            nombreLocal: equipoVisitante.nombre,
                            nombreVisitante: equipoLocal.nombre
                        } :
                        { 
                            local: equipoLocal, 
                            visitante: equipoVisitante, 
                            fecha: fecha + 1,
                            nombreLocal: equipoLocal.nombre,
                            nombreVisitante: equipoVisitante.nombre
                        };
                    partidosFecha.push(partido);
                }
            }
            
            fixture.push(partidosFecha);
            
            // Rotar equipos (mantener el primero fijo)
            const ultimo = equipos.pop();
            equipos.splice(1, 0, ultimo);
        }
        
        return fixture;
    }

    simularPartido(equipoLocal, equipoVisitante) {
        // Simulación básica considerando presupuesto y localía
        const fuerzaLocal = equipoLocal.presupuesto * 1.1; // Ventaja de local
        const fuerzaVisitante = equipoVisitante.presupuesto;
        
        const totalFuerza = fuerzaLocal + fuerzaVisitante;
        const probLocal = fuerzaLocal / totalFuerza;
        
        const rand = Math.random();
        let golesLocal, golesVisitante;
        
        if (rand < probLocal * 0.6) { // Victoria local
            golesLocal = Math.floor(Math.random() * 3) + 1;
            golesVisitante = Math.floor(Math.random() * 2);
        } else if (rand < probLocal * 0.6 + 0.25) { // Empate
            const goles = Math.floor(Math.random() * 3);
            golesLocal = goles;
            golesVisitante = goles;
        } else { // Victoria visitante
            golesLocal = Math.floor(Math.random() * 2);
            golesVisitante = Math.floor(Math.random() * 3) + 1;
        }
        
        return {
            equipoLocal,
            equipoVisitante,
            nombreLocal: equipoLocal.nombre,
            nombreVisitante: equipoVisitante.nombre,
            golesLocal,
            golesVisitante,
            tarjetasLocal: Math.floor(Math.random() * 4),
            tarjetasVisitante: Math.floor(Math.random() * 4)
        };
    }

    // ✅ MODIFICADO: Simular fecha con verificación de calendario
    simularFecha(fechaJuego = null) {
        // Si se proporciona fecha del juego, verificar si corresponde
        if (fechaJuego && !this.hayPartidosHoy(fechaJuego)) {
            return { mensaje: "No hay partidos programados para esta fecha" };
        }
        
        const fixture = this.torneoActual === 'apertura' ? this.fixtureApertura : this.fixtureClausura;
        const tabla = this.torneoActual === 'apertura' ? this.torneoApertura : this.torneoClausura;
        const fechasCalendario = this.torneoActual === 'apertura' ? 
            this.fechasFixture.apertura : this.fechasFixture.clausura;
        
        if (this.fechaActual <= 18) {
            const partidosFecha = fixture[this.fechaActual - 1];
            const fechaPartido = fechasCalendario[this.fechaActual - 1];
            const resultados = [];
            
            partidosFecha.forEach(partido => {
                const resultado = this.simularPartido(partido.local, partido.visitante);
                // ✅ AGREGADO: Incluir fecha del calendario
                resultado.fechaCalendario = fechaPartido;
                resultado.fechaString = this.formatearFecha(fechaPartido);
                resultado.jornadaNumero = this.fechaActual;
                resultado.torneo = this.torneoActual.toUpperCase();
                
                resultados.push(resultado);
                this.actualizarTabla(tabla, resultado);
                
                // Actualizar tabla acumulada
                this.actualizarTabla(this.tablaAcumulada, resultado);
            });
            
            // Guardar resultados con fecha
            this.resultadosConFecha.push(...resultados);
            
            // Ordenar tablas
            if (this.torneoActual === 'apertura') {
                this.torneoApertura = this.ordenarTabla(this.torneoApertura);
            } else {
                this.torneoClausura = this.ordenarTabla(this.torneoClausura);
            }
            this.tablaAcumulada = this.ordenarTabla(this.tablaAcumulada);
            
            this.fechaActual++;
            
            // Cambiar a clausura si se terminó el apertura
            if (this.fechaActual > 18 && this.torneoActual === 'apertura') {
                this.campeonApertura = this.torneoApertura[0];
                this.torneoActual = 'clausura';
                this.fechaActual = 1;
                this.agregarEventosAlCalendario(); // Actualizar eventos del clausura
            }
            
            // Terminar temporada si se completó el clausura
            if (this.fechaActual > 18 && this.torneoActual === 'clausura') {
                this.campeonClausura = this.torneoClausura[0];
                this.definirCampeonYPlayoffs();
            }
            
            return resultados;
        }
        
        return null;
    }

    actualizarTabla(tabla, resultado) {
        const equipoLocal = tabla.find(t => t.equipo.id === resultado.equipoLocal.id);
        const equipoVisitante = tabla.find(t => t.equipo.id === resultado.equipoVisitante.id);
        
        // Actualizar estadísticas del equipo local
        equipoLocal.partidosJugados++;
        equipoLocal.golesFavor += resultado.golesLocal;
        equipoLocal.golesContra += resultado.golesVisitante;
        equipoLocal.diferenciaGoles = equipoLocal.golesFavor - equipoLocal.golesContra;
        equipoLocal.fairPlay += resultado.tarjetasLocal;
        
        // Actualizar estadísticas del equipo visitante
        equipoVisitante.partidosJugados++;
        equipoVisitante.golesFavor += resultado.golesVisitante;
        equipoVisitante.golesContra += resultado.golesLocal;
        equipoVisitante.diferenciaGoles = equipoVisitante.golesFavor - equipoVisitante.golesContra;
        equipoVisitante.fairPlay += resultado.tarjetasVisitante;
        
        // Asignar puntos
        if (resultado.golesLocal > resultado.golesVisitante) {
            equipoLocal.puntos += 3;
            equipoLocal.partidosGanados++;
            equipoVisitante.partidosPerdidos++;
        } else if (resultado.golesLocal < resultado.golesVisitante) {
            equipoVisitante.puntos += 3;
            equipoVisitante.partidosGanados++;
            equipoLocal.partidosPerdidos++;
        } else {
            equipoLocal.puntos += 1;
            equipoVisitante.puntos += 1;
            equipoLocal.partidosEmpatados++;
            equipoVisitante.partidosEmpatados++;
        }
    }

    ordenarTabla(tabla) {
        return tabla.sort((a, b) => {
            // 1. Puntos
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            // 2. Diferencia de goles
            if (b.diferenciaGoles !== a.diferenciaGoles) return b.diferenciaGoles - a.diferenciaGoles;
            // 3. Goles a favor
            if (b.golesFavor !== a.golesFavor) return b.golesFavor - a.golesFavor;
            // 4. Fair Play (menos tarjetas es mejor)
            if (a.fairPlay !== b.fairPlay) return a.fairPlay - b.fairPlay;
            // 5. Sorteo (aleatorio)
            return Math.random() - 0.5;
        }).map((equipo, index) => ({ ...equipo, posicion: index + 1 }));
    }

    definirCampeonYPlayoffs() {
        // Si el mismo equipo ganó ambos torneos, es campeón automático
        if (this.campeonApertura.equipo.id === this.campeonClausura.equipo.id) {
            this.campeonNacional = this.campeonApertura;
            // Los 3 mejores de la tabla acumulada (excluyendo al campeón) van a playoffs por subcampeonato
            const equiposPlayoffs = this.tablaAcumulada
                .filter(equipo => equipo.equipo.id !== this.campeonNacional.equipo.id)
                .slice(0, 3);
            this.simularPlayoffsSubcampeon(equiposPlayoffs);
        } else {
            // Campeones diferentes, van a playoffs por el título
            const equiposPlayoffs = [
                this.campeonApertura,
                this.campeonClausura,
                ...this.tablaAcumulada
                    .filter(equipo => 
                        equipo.equipo.id !== this.campeonApertura.equipo.id && 
                        equipo.equipo.id !== this.campeonClausura.equipo.id
                    )
                    .slice(0, 2)
            ];
            this.simularPlayoffsTitulo(equiposPlayoffs);
        }
        
        this.definirClasificaciones();
        this.definirDescensos();
    }

    simularPlayoffsTitulo(equipos) {
        // Semifinales: 1° vs 4° y 2° vs 3°
        const semifinal1 = this.simularPartido(equipos[0].equipo, equipos[3].equipo);
        const semifinal2 = this.simularPartido(equipos[1].equipo, equipos[2].equipo);
        
        const finalista1 = semifinal1.golesLocal > semifinal1.golesVisitante ? equipos[0] : equipos[3];
        const finalista2 = semifinal2.golesLocal > semifinal2.golesVisitante ? equipos[1] : equipos[2];
        
        // Final
        const final = this.simularPartido(finalista1.equipo, finalista2.equipo);
        this.campeonNacional = final.golesLocal > final.golesVisitante ? finalista1 : finalista2;
        this.subcampeon = final.golesLocal > final.golesVisitante ? finalista2 : finalista1;
    }

    simularPlayoffsSubcampeon(equipos) {
        // Partido 3° vs 4°
        const semifinal = this.simularPartido(equipos[2].equipo, equipos[1].equipo);
        const finalista = semifinal.golesLocal > semifinal.golesVisitante ? equipos[2] : equipos[1];
        
        // Final por subcampeonato
        const final = this.simularPartido(equipos[0].equipo, finalista.equipo);
        this.subcampeon = final.golesLocal > final.golesVisitante ? equipos[0] : finalista;
    }

    definirClasificaciones() {
        // Copa Libertadores (4 cupos)
        this.clasificadosLibertadores = [
            this.campeonNacional,
            this.subcampeon,
            ...this.tablaAcumulada
                .filter(equipo => 
                    equipo.equipo.id !== this.campeonNacional.equipo.id && 
                    equipo.equipo.id !== this.subcampeon.equipo.id
                )
                .slice(0, 2)
        ];
        
        // Copa Sudamericana (4 cupos) - posiciones 5° a 8°
        this.clasificadosSudamericana = this.tablaAcumulada
            .filter(equipo => 
                !this.clasificadosLibertadores.some(clasificado => 
                    clasificado.equipo.id === equipo.equipo.id
                )
            )
            .slice(0, 4);
    }

    definirDescensos() {
        // Últimos 3 equipos de la tabla acumulada descienden
        this.descendidos = this.tablaAcumulada.slice(-3);
    }

    simularTemporadaCompleta() {
        while (this.fechaActual <= 18 || this.torneoActual === 'apertura') {
            this.simularFecha();
        }
        
        while (this.fechaActual <= 18 && this.torneoActual === 'clausura') {
            this.simularFecha();
        }
    }

    obtenerEstadisticas() {
        return {
            torneoApertura: this.torneoApertura,
            torneoClausura: this.torneoClausura,
            tablaAcumulada: this.tablaAcumulada,
            campeonApertura: this.campeonApertura,
            campeonClausura: this.campeonClausura,
            campeonNacional: this.campeonNacional,
            subcampeon: this.subcampeon,
            clasificadosLibertadores: this.clasificadosLibertadores,
            clasificadosSudamericana: this.clasificadosSudamericana,
            descendidos: this.descendidos,
            fechaActual: this.fechaActual,
            torneoActual: this.torneoActual,
            // ✅ NUEVO: Información del calendario
            fechasFixture: this.fechasFixture,
            resultadosConFecha: this.resultadosConFecha,
            proximosPartidos: this.obtenerProximosPartidos()
        };
    }

    obtenerProximaFecha() {
        const fixture = this.torneoActual === 'apertura' ? this.fixtureApertura : this.fixtureClausura;
        const fechasCalendario = this.torneoActual === 'apertura' ? 
            this.fechasFixture.apertura : this.fechasFixture.clausura;
        
        if (this.fechaActual <= 18) {
            const partidosFecha = fixture[this.fechaActual - 1];
            const fechaPartido = fechasCalendario[this.fechaActual - 1];
            
            return partidosFecha.map(partido => ({
                ...partido,
                fechaCalendario: fechaPartido,
                fechaString: this.formatearFecha(fechaPartido),
                jornadaNumero: this.fechaActual,
                torneo: this.torneoActual.toUpperCase()
            }));
        }
        return null;
    }

    // ✅ NUEVO: Obtener resultados con filtros de fecha
    obtenerResultados(filtroFecha = null) {
        if (filtroFecha) {
            return this.resultadosConFecha.filter(resultado => 
                resultado.fechaCalendario.toDateString() === filtroFecha.toDateString()
            );
        }
        return this.resultadosConFecha;
    }

    // Métodos auxiliares
    obtenerNombreEquipo(equipoId) {
        const equipo = this.equipos.find(e => e.id === equipoId);
        return equipo ? equipo.nombre : 'Equipo no encontrado';
    }

    obtenerEquipo(equipoId) {
        return this.equipos.find(e => e.id === equipoId);
    }
}

// Función para inicializar el torneo peruano
function inicializarTorneoPeruano(clubes, fechaInicio = null) {
    return new TorneoPeruano(clubes, fechaInicio);
}

// ✅ NUEVO: Función para integrar con el calendario
function configurarIntegracionCalendario(torneo) {
    // Escuchar cambios de fecha del calendario
    document.addEventListener('cambioFechaJuego', function(event) {
        const fechaJuego = event.detail.fecha;
        
        // Verificar si hay partidos hoy
        if (torneo.hayPartidosHoy(fechaJuego)) {
            console.log('¡Hay partidos hoy!', torneo.obtenerPartidosHoy(fechaJuego));
            
            // Puedes simular automáticamente o mostrar notificación
            // torneo.simularFecha(fechaJuego);
        }
    });
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TorneoPeruano, inicializarTorneoPeruano, configurarIntegracionCalendario };
}
