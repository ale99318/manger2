class TorneoApertura {
    constructor() {
        this.equipos = [];
        this.fixture = [];
        this.fechaActual = 0;
        this.totalFechas = 18;
        this.partidosJugados = 0;
        this.torneoIniciado = false;
        this.equipoSeleccionado = null;
        this.diaActual = 1; // Día simulado del torneo
        this.fechasTorneo = []; // Días asignados a cada fecha
        
        this.initEventListeners();
        this.cargarDatosEntrenador();
        this.actualizarDiaActual();
    }

    cargarDatosEntrenador() {
        // Cargar datos del localStorage
        const dtNombre = localStorage.getItem("coachName");
        const clubNombre = localStorage.getItem("selectedClub");
        const imagen = localStorage.getItem("coachImage");
        
        if (!dtNombre || !clubNombre || !imagen) {
            alert("Faltan datos del entrenador. Redirigiendo al login...");
            window.location.href = "login.html";
            return;
        }
        
        // Actualizar elementos del DOM si existen
        const dtNombreElement = document.getElementById("dtNombre");
        const clubNombreElement = document.getElementById("clubNombre");
        
        if (dtNombreElement) dtNombreElement.textContent = dtNombre;
        if (clubNombreElement) clubNombreElement.textContent = clubNombre;
        
        // Guardar el club seleccionado para resaltarlo
        this.equipoSeleccionado = clubNombre;
        
        console.log(`Entrenador: ${dtNombre}, Club: ${clubNombre}`);
    }

    initEventListeners() {
        document.getElementById('btn-iniciar').addEventListener('click', () => this.iniciarTorneo());
        document.getElementById('btn-simular-dia').addEventListener('click', () => this.simularDia());
        document.getElementById('btn-simular-todo').addEventListener('click', () => this.simularTodo());
        document.getElementById('btn-reiniciar').addEventListener('click', () => this.reiniciarTorneo());
    }

    actualizarDiaActual() {
        const diaElement = document.getElementById('dia-actual');
        if (diaElement) {
            diaElement.textContent = `Día ${this.diaActual} del torneo`;
        }
    }

    generarCalendarioTorneo() {
        // Asignar días a cada fecha del torneo
        this.fechasTorneo = [];
        let diaAsignado = 3; // Primera fecha empieza en el día 3
        
        for (let i = 0; i < this.totalFechas; i++) {
            this.fechasTorneo.push(diaAsignado);
            
            // Cada fecha se juega cada 7 días aproximadamente
            diaAsignado += 7;
            
            // Pausa más larga entre primera y segunda vuelta (fecha 9)
            if (i === 8) {
                diaAsignado += 14; // 2 semanas extra de descanso
            }
        }
        
        console.log('Calendario del torneo generado:', this.fechasTorneo);
    }

    obtenerEquiposPeruanos() {
        return clubes.filter(club => {
            const [prefijo] = club.id.split('-');
            return prefijo === '51';
        }).slice(0, 18); // Solo tomamos 18 equipos
    }

    verificarPartidosDisponibles() {
        if (!this.torneoIniciado) return;
        
        // Verificar si hay partidos disponibles para jugar en el día actual
        let hayPartidosHoy = false;
        
        for (let i = this.fechaActual; i < this.totalFechas; i++) {
            if (this.fechasTorneo[i] === this.diaActual) {
                hayPartidosHoy = true;
                break;
            }
        }
        
        const btnSimular = document.getElementById('btn-simular-dia');
        
        if (hayPartidosHoy) {
            btnSimular.disabled = false;
            btnSimular.textContent = '🟢 Jugar Partidos del Día';
            btnSimular.style.backgroundColor = '#4CAF50';
        } else {
            const proximaFecha = this.fechasTorneo[this.fechaActual];
            if (proximaFecha) {
                const diasRestantes = proximaFecha - this.diaActual;
                if (diasRestantes > 0) {
                    btnSimular.textContent = `⏳ Avanzar Día (Próximos partidos en ${diasRestantes} días)`;
                    btnSimular.style.backgroundColor = '#2196F3';
                } else {
                    btnSimular.textContent = '🟢 Jugar Partidos del Día';
                    btnSimular.style.backgroundColor = '#4CAF50';
                }
            } else {
                btnSimular.textContent = 'Torneo Finalizado';
                btnSimular.disabled = true;
            }
            btnSimular.disabled = false;
        }
        
        this.actualizarIndicadorProximaFecha();
    }

    actualizarIndicadorProximaFecha() {
        let indicador = document.getElementById('indicador-proxima-fecha');
        if (!indicador) {
            indicador = document.createElement('div');
            indicador.id = 'indicador-proxima-fecha';
            indicador.style.cssText = `
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
                padding: 10px;
                margin: 10px 0;
                border-radius: 8px;
                text-align: center;
                font-weight: bold;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            
            const container = document.querySelector('.torneo-container') || document.body;
            container.insertBefore(indicador, container.firstChild);
        }
        
        if (this.fechaActual < this.totalFechas) {
            const proximaFecha = this.fechasTorneo[this.fechaActual];
            const diasRestantes = proximaFecha - this.diaActual;
            
            if (diasRestantes === 0) {
                indicador.innerHTML = `🟢 <strong>¡Fecha ${this.fechaActual + 1} disponible para jugar!</strong>`;
                indicador.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            } else if (diasRestantes > 0) {
                indicador.innerHTML = `⏱️ <strong>Próxima fecha ${this.fechaActual + 1}:</strong> Día ${proximaFecha} (en ${diasRestantes} días)`;
                indicador.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            } else {
                indicador.innerHTML = `🟢 <strong>Fecha ${this.fechaActual + 1} disponible para jugar!</strong>`;
                indicador.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            }
        }
    }

    iniciarTorneo() {
        const equiposPeruanos = this.obtenerEquiposPeruanos();
        
        if (equiposPeruanos.length < 18) {
            alert('No hay suficientes equipos peruanos para iniciar el torneo');
            return;
        }

        this.equipos = equiposPeruanos.map(club => ({
            id: club.id,
            nombre: club.nombre,
            pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0
        }));

        this.generarCalendarioTorneo();
        this.generarFixture();
        this.actualizarTabla();
        this.mostrarFixture();
        this.torneoIniciado = true;
        
        document.getElementById('btn-iniciar').disabled = true;
        this.verificarPartidosDisponibles();
        
        console.log('Torneo Apertura iniciado con', this.equipos.length, 'equipos');
        console.log('Primera fecha programada para el día:', this.fechasTorneo[0]);
    }

    generarFixture() {
        this.fixture = [];
        const numEquipos = this.equipos.length;
        
        // Algoritmo Round Robin para generar todas las fechas
        for (let fecha = 0; fecha < this.totalFechas; fecha++) {
            const partidos = [];
            
            for (let i = 0; i < numEquipos / 2; i++) {
                let local, visitante;
                
                if (i === 0) {
                    local = 0;
                    visitante = fecha === 0 ? numEquipos - 1 : fecha;
                } else {
                    const pos1 = (fecha + i) % (numEquipos - 1);
                    const pos2 = (fecha - i + numEquipos - 1) % (numEquipos - 1);
                    
                    local = pos1 === 0 ? numEquipos - 1 : pos1;
                    visitante = pos2 === 0 ? numEquipos - 1 : pos2;
                }
                
                // Alternar local y visitante en la segunda vuelta
                if (fecha >= 9) {
                    [local, visitante] = [visitante, local];
                }
                
                partidos.push({
                    local: this.equipos[local],
                    visitante: this.equipos[visitante],
                    resultado: null,
                    jugado: false
                });
            }
            
            this.fixture.push({
                numero: fecha + 1,
                partidos: partidos,
                diaProgramado: this.fechasTorneo[fecha]
            });
        }
    }

    simularPartido(equipoLocal, equipoVisitante) {
        // Simulación básica de resultado
        const golesLocal = Math.floor(Math.random() * 4);
        const golesVisitante = Math.floor(Math.random() * 4);
        
        // Actualizar estadísticas del equipo local
        const local = this.equipos.find(e => e.id === equipoLocal.id);
        const visitante = this.equipos.find(e => e.id === equipoVisitante.id);
        
        local.pj++;
        visitante.pj++;
        local.gf += golesLocal;
        local.gc += golesVisitante;
        visitante.gf += golesVisitante;
        visitante.gc += golesLocal;
        
        if (golesLocal > golesVisitante) {
            local.g++;
            local.pts += 3;
            visitante.p++;
        } else if (golesLocal < golesVisitante) {
            visitante.g++;
            visitante.pts += 3;
            local.p++;
        } else {
            local.e++;
            visitante.e++;
            local.pts += 1;
            visitante.pts += 1;
        }
        
        // Actualizar diferencia de goles
        local.dg = local.gf - local.gc;
        visitante.dg = visitante.gf - visitante.gc;
        
        return { golesLocal, golesVisitante };
    }

    simularDia() {
        if (!this.torneoIniciado) {
            alert('Primero debes iniciar el torneo');
            return;
        }
        
        if (this.fechaActual >= this.totalFechas) {
            alert('El torneo ya ha terminado');
            return;
        }
        
        // Verificar si hay partidos programados para el día actual
        let partidosJugadosHoy = false;
        
        for (let i = this.fechaActual; i < this.totalFechas; i++) {
            if (this.fechasTorneo[i] === this.diaActual) {
                const fecha = this.fixture[i];
                
                // Simular todos los partidos de esta fecha
                fecha.partidos.forEach(partido => {
                    if (!partido.jugado) {
                        const resultado = this.simularPartido(partido.local, partido.visitante);
                        partido.resultado = `${resultado.golesLocal} - ${resultado.golesVisitante}`;
                        partido.jugado = true;
                        this.partidosJugados++;
                    }
                });
                
                partidosJugadosHoy = true;
                this.fechaActual = i + 1; // Avanzar a la siguiente fecha
                break;
            }
        }
        
        if (!partidosJugadosHoy) {
            // Si no hay partidos hoy, solo avanzar el día
            this.diaActual++;
        }
        
        this.actualizarDiaActual();
        this.actualizarTabla();
        this.actualizarFixture();
        this.verificarPartidosDisponibles();
        
        if (this.fechaActual >= this.totalFechas) {
            this.finalizarTorneo();
        }
        
        if (partidosJugadosHoy) {
            console.log(`Fecha ${this.fechaActual} simulada en el día ${this.diaActual}`);
        } else {
            console.log(`Avanzado al día ${this.diaActual}`);
        }
    }

    simularTodo() {
        if (!this.torneoIniciado) {
            alert('Primero debes iniciar el torneo');
            return;
        }
        
        // Simular todo el torneo de una vez
        while (this.fechaActual < this.totalFechas) {
            const fecha = this.fixture[this.fechaActual];
            
            fecha.partidos.forEach(partido => {
                if (!partido.jugado) {
                    const resultado = this.simularPartido(partido.local, partido.visitante);
                    partido.resultado = `${resultado.golesLocal} - ${resultado.golesVisitante}`;
                    partido.jugado = true;
                    this.partidosJugados++;
                }
            });
            
            this.fechaActual++;
        }
        
        this.diaActual = this.fechasTorneo[this.totalFechas - 1]; // Ir al último día
        this.actualizarDiaActual();
        this.actualizarTabla();
        this.actualizarFixture();
        this.finalizarTorneo();
    }

    finalizarTorneo() {
        document.getElementById('btn-simular-dia').disabled = true;
        document.getElementById('btn-simular-todo').disabled = true;
        
        const campeon = this.equipos[0];
        const miEquipo = this.equipos.find(equipo => equipo.nombre === this.equipoSeleccionado);
        const posicionMiEquipo = this.equipos.indexOf(miEquipo) + 1;
        
        let mensaje = `🏆 ¡Torneo Apertura finalizado!\n\nCampeón: ${campeon.nombre}\nPuntos: ${campeon.pts}`;
        
        if (miEquipo) {
            mensaje += `\n\n⭐ Tu equipo (${miEquipo.nombre}):\nPosición: ${posicionMiEquipo}°\nPuntos: ${miEquipo.pts}\nPartidos: ${miEquipo.pj}`;
        }
        
        alert(mensaje);
        
        // Ocultar indicador
        const indicador = document.getElementById('indicador-proxima-fecha');
        if (indicador) {
            indicador.style.display = 'none';
        }
    }

    actualizarTabla() {
        // Ordenar equipos por puntos, diferencia de goles, goles a favor
        this.equipos.sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.dg !== a.dg) return b.dg - a.dg;
            return b.gf - a.gf;
        });
        
        const tbody = document.getElementById('tabla-body');
        tbody.innerHTML = '';
        
        this.equipos.forEach((equipo, index) => {
            const row = document.createElement('tr');
            
            // Agregar clases para posiciones especiales
            if (index < 4) {
                row.classList.add('pos-libertadores');
            } else if (index < 8) {
                row.classList.add('pos-sudamericana');
            } else if (index >= 15) {
                row.classList.add('pos-descenso');
            }
            
            // Resaltar el equipo seleccionado por el usuario
            if (equipo.nombre === this.equipoSeleccionado) {
                row.classList.add('mi-equipo');
                row.style.backgroundColor = '#ffeb3b';
                row.style.fontWeight = 'bold';
                row.style.border = '2px solid #ff9800';
            }
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td style="text-align: left; font-weight: ${equipo.nombre === this.equipoSeleccionado ? 'bold' : 'normal'};">
                    ${equipo.nombre === this.equipoSeleccionado ? '⭐ ' : ''}${equipo.nombre}
                </td>
                <td>${equipo.pj}</td>
                <td>${equipo.g}</td>
                <td>${equipo.e}</td>
                <td>${equipo.p}</td>
                <td>${equipo.gf}</td>
                <td>${equipo.gc}</td>
                <td>${equipo.dg > 0 ? '+' : ''}${equipo.dg}</td>
                <td style="font-weight: bold;">${equipo.pts}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        this.mostrarInfoMiEquipo();
    }

    mostrarInfoMiEquipo() {
        const miEquipo = this.equipos.find(equipo => equipo.nombre === this.equipoSeleccionado);
        if (miEquipo) {
            const posicion = this.equipos.indexOf(miEquipo) + 1;
            
            let infoContainer = document.getElementById('mi-equipo-info');
            if (!infoContainer) {
                infoContainer = document.createElement('div');
                infoContainer.id = 'mi-equipo-info';
                infoContainer.style.cssText = `
                    background: linear-gradient(135deg, #2196f3, #21cbf3);
                    color: white;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                `;
                
                const tabla = document.querySelector('table');
                if (tabla && tabla.parentNode) {
                    tabla.parentNode.insertBefore(infoContainer, tabla.nextSibling);
                }
            }
            
            infoContainer.innerHTML = `
                <h3>⭐ Tu Equipo: ${miEquipo.nombre}</h3>
                <div style="display: flex; justify-content: space-around; margin-top: 10px;">
                    <div><strong>Posición:</strong> ${posicion}°</div>
                    <div><strong>Puntos:</strong> ${miEquipo.pts}</div>
                    <div><strong>Partidos:</strong> ${miEquipo.pj}</div>
                    <div><strong>Dif. Goles:</strong> ${miEquipo.dg > 0 ? '+' : ''}${miEquipo.dg}</div>
                </div>
            `;
        }
    }

    mostrarFixture() {
        const container = document.getElementById('fechas-container');
        container.innerHTML = '';
        
        this.fixture.forEach((fecha, index) => {
            const fechaDiv = document.createElement('div');
            fechaDiv.className = 'fecha';
            
            // Determinar el estado de la fecha
            let estadoFecha = '';
            let colorFecha = '#f8f9fa';
            
            if (index < this.fechaActual) {
                estadoFecha = '✅ Jugada';
                colorFecha = '#d4edda';
            } else if (fecha.diaProgramado === this.diaActual) {
                estadoFecha = '🟢 Disponible Hoy';
                colorFecha = '#d1ecf1';
            } else if (fecha.diaProgramado < this.diaActual) {
                estadoFecha = '✅ Jugada';
                colorFecha = '#d4edda';
            } else {
                const diasRestantes = fecha.diaProgramado - this.diaActual;
                estadoFecha = `⏳ En ${diasRestantes} días`;
                colorFecha = '#fff3cd';
            }
            
            fechaDiv.style.backgroundColor = colorFecha;
            fechaDiv.style.border = '1px solid #dee2e6';
            fechaDiv.style.borderRadius = '8px';
            fechaDiv.style.padding = '10px';
            fechaDiv.style.marginBottom = '10px';
            
            fechaDiv.innerHTML = `
                <h4>Fecha ${fecha.numero} - ${estadoFecha} (Día ${fecha.diaProgramado})</h4>
                <div class="partidos">
                    ${fecha.partidos.map(partido => {
                        const localEsMiEquipo = partido.local.nombre === this.equipoSeleccionado;
                        const visitanteEsMiEquipo = partido.visitante.nombre === this.equipoSeleccionado;
                        const partidoDestacado = localEsMiEquipo || visitanteEsMiEquipo;
                        
                        return `
                            <div class="partido${partidoDestacado ? ' mi-partido' : ''}" 
                                 style="${partidoDestacado ? 'background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 5px; padding: 5px;' : ''}">
                                <div class="equipo-local" style="${localEsMiEquipo ? 'font-weight: bold; color: #ff9800;' : ''}">
                                    ${localEsMiEquipo ? '⭐ ' : ''}${partido.local.nombre}
                                </div>
                                <div class="${partido.jugado ? 'resultado' : 'vs'}">
                                    ${partido.jugado ? partido.resultado : 'VS'}
                                </div>
                                <div class="equipo-visitante" style="${visitanteEsMiEquipo ? 'font-weight: bold; color: #ff9800;' : ''}">
                                    ${visitanteEsMiEquipo ? '⭐ ' : ''}${partido.visitante.nombre}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            container.appendChild(fechaDiv);
        });
    }

    actualizarFixture() {
        this.mostrarFixture();
    }

    reiniciarTorneo() {
        this.equipos = [];
        this.fixture = [];
        this.fechaActual = 0;
        this.partidosJugados = 0;
        this.torneoIniciado = false;
        this.fechasTorneo = [];
        this.diaActual = 1;
        
        document.getElementById('tabla-body').innerHTML = '';
        document.getElementById('fechas-container').innerHTML = '';
        
        // Limpiar info del equipo
        const infoContainer = document.getElementById('mi-equipo-info');
        if (infoContainer) {
            infoContainer.remove();
        }
        
        // Limpiar indicador de próxima fecha
        const indicador = document.getElementById('indicador-proxima-fecha');
        if (indicador) {
            indicador.remove();
        }
        
        document.getElementById('btn-iniciar').disabled = false;
        document.getElementById('btn-simular-dia').disabled = true;
        document.getElementById('btn-simular-todo').disabled = false;
        
        // Restaurar texto del botón
        document.getElementById('btn-simular-dia').textContent = 'Simular Día';
        document.getElementById('btn-simular-dia').style.backgroundColor = '';
        
        this.actualizarDiaActual();
        
        console.log('Torneo reiniciado');
    }
}

// Inicializar el simulador cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const torneo = new TorneoApertura();
    console.log('Simulador del Torneo Apertura con sistema de días simulados cargado');
});

// Verificar que los datos estén disponibles
if (typeof clubes === 'undefined') {
    console.error('No se encontraron los datos de clubes. Asegúrate de que clubes.js esté cargado.');
}
