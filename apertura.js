class TorneoApertura {
    constructor() {
        this.equipos = [];
        this.fixture = [];
        this.fechaActual = 0;
        this.totalFechas = 18;
        this.partidosJugados = 0;
        this.torneoIniciado = false;
        this.equipoSeleccionado = null;
        this.fechasTorneo = []; // Fechas reales de cada jornada
        this.fechaInicioTorneo = null;
        
        this.initEventListeners();
        this.cargarDatosEntrenador();
        this.iniciarReloj();
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
        document.getElementById('btn-simular-fecha').addEventListener('click', () => this.simularFecha());
        document.getElementById('btn-simular-todo').addEventListener('click', () => this.simularTodo());
        document.getElementById('btn-reiniciar').addEventListener('click', () => this.reiniciarTorneo());
        
        // Nuevo botón para avanzar tiempo (solo para pruebas)
        const btnAvanzar = document.getElementById('btn-avanzar-tiempo');
        if (btnAvanzar) {
            btnAvanzar.addEventListener('click', () => this.avanzarTiempo());
        }
    }

    iniciarReloj() {
        // Actualizar la fecha actual cada minuto
        setInterval(() => {
            this.actualizarFechaActual();
            this.verificarFechasDisponibles();
        }, 60000); // Cada minuto
        
        // Actualizar inmediatamente
        this.actualizarFechaActual();
    }

    actualizarFechaActual() {
        const ahora = new Date();
        const fechaElement = document.getElementById('fecha-actual');
        if (fechaElement) {
            fechaElement.textContent = ahora.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    generarFechasTorneo() {
        // Generar fechas del torneo (cada 3-4 días, preferiblemente fines de semana)
        this.fechasTorneo = [];
        let fechaInicial = new Date();
        
        // Primera fecha puede ser en 2 días para empezar pronto
        fechaInicial.setDate(fechaInicial.getDate() + 2);
        this.fechaInicioTorneo = new Date(fechaInicial);
        
        for (let i = 0; i < this.totalFechas; i++) {
            let proximaFecha = new Date(fechaInicial);
            
            if (i > 0) {
                // Agregar 3-4 días entre fechas
                let diasAgregar = 3 + Math.floor(Math.random() * 2); // 3 o 4 días
                proximaFecha.setDate(fechaInicial.getDate() + diasAgregar);
                
                // Preferir fines de semana (sábado=6, domingo=0)
                const diaSemana = proximaFecha.getDay();
                if (diaSemana >= 1 && diaSemana <= 4) { // Lunes a jueves
                    // Mover al próximo sábado
                    const diasHastaSabado = 6 - diaSemana;
                    proximaFecha.setDate(proximaFecha.getDate() + diasHastaSabado);
                }
            }
            
            this.fechasTorneo.push(new Date(proximaFecha));
            fechaInicial = new Date(proximaFecha);
            
            // Pausa más larga entre primera y segunda vuelta
            if (i === 8) {
                fechaInicial.setDate(fechaInicial.getDate() + 10);
            }
        }
        
        console.log('Fechas del torneo generadas:', this.fechasTorneo);
    }

    obtenerEquiposPeruanos() {
        return clubes.filter(club => {
            const [prefijo] = club.id.split('-');
            return prefijo === '51';
        }).slice(0, 18); // Solo tomamos 18 equipos
    }

    verificarFechasDisponibles() {
        if (!this.torneoIniciado) return;
        
        const ahora = new Date();
        const proximaFechaDisponible = this.fechasTorneo[this.fechaActual];
        
        if (proximaFechaDisponible && ahora >= proximaFechaDisponible) {
            // Habilitar botón de simular fecha
            document.getElementById('btn-simular-fecha').disabled = false;
            document.getElementById('btn-simular-fecha').textContent = '🟢 Jugar Fecha Disponible';
            document.getElementById('btn-simular-fecha').style.backgroundColor = '#4CAF50';
        } else {
            // Deshabilitar botón y mostrar cuando estará disponible
            document.getElementById('btn-simular-fecha').disabled = true;
            if (proximaFechaDisponible) {
                const tiempoRestante = this.calcularTiempoRestante(proximaFechaDisponible);
                document.getElementById('btn-simular-fecha').textContent = `🔒 Próxima fecha: ${tiempoRestante}`;
                document.getElementById('btn-simular-fecha').style.backgroundColor = '#9E9E9E';
            }
        }
        
        // Actualizar el indicador de próxima fecha
        this.actualizarIndicadorProximaFecha();
    }

    calcularTiempoRestante(fecha) {
        const ahora = new Date();
        const diferencia = fecha - ahora;
        
        if (diferencia <= 0) return "Disponible ahora";
        
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        
        if (dias > 0) {
            return `${dias}d ${horas}h`;
        } else if (horas > 0) {
            return `${horas}h ${minutos}m`;
        } else {
            return `${minutos}m`;
        }
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
        
        if (this.fechaActual < this.totalFechas && this.fechasTorneo[this.fechaActual]) {
            const proximaFecha = this.fechasTorneo[this.fechaActual];
            const tiempoRestante = this.calcularTiempoRestante(proximaFecha);
            const fechaFormateada = proximaFecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
            
            if (tiempoRestante === "Disponible ahora") {
                indicador.innerHTML = `🟢 <strong>Fecha ${this.fechaActual + 1} disponible para jugar!</strong>`;
                indicador.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            } else {
                indicador.innerHTML = `⏱️ <strong>Próxima fecha ${this.fechaActual + 1}:</strong> ${fechaFormateada} (${tiempoRestante})`;
                indicador.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            }
        }
    }

    // Función para avanzar tiempo (solo para pruebas)
    avanzarTiempo() {
        if (this.fechaActual < this.totalFechas) {
            // Avanzar tiempo a la próxima fecha
            const proximaFecha = this.fechasTorneo[this.fechaActual];
            if (proximaFecha) {
                // Simular que ya pasó el tiempo
                proximaFecha.setTime(Date.now() - 1000);
                this.verificarFechasDisponibles();
                alert('Tiempo avanzado. ¡La próxima fecha ya está disponible!');
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

        this.generarFechasTorneo();
        this.generarFixture();
        this.actualizarTabla();
        this.mostrarFixture();
        this.torneoIniciado = true;
        
        document.getElementById('btn-iniciar').disabled = true;
        document.getElementById('btn-simular-todo').disabled = true; // Deshabilitar simular todo
        this.verificarFechasDisponibles();
        
        console.log('Torneo Apertura iniciado con', this.equipos.length, 'equipos');
        console.log('Primera fecha programada para:', this.fechasTorneo[0]);
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
                fechaProgramada: this.fechasTorneo[fecha] || null
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

    simularFecha() {
        if (!this.torneoIniciado) {
            alert('Primero debes iniciar el torneo');
            return;
        }
        
        if (this.fechaActual >= this.totalFechas) {
            alert('El torneo ya ha terminado');
            return;
        }
        
        // Verificar si la fecha está disponible
        const ahora = new Date();
        const fechaProgramada = this.fechasTorneo[this.fechaActual];
        
        if (fechaProgramada && ahora < fechaProgramada) {
            const tiempoRestante = this.calcularTiempoRestante(fechaProgramada);
            alert(`Esta fecha aún no está disponible. Tiempo restante: ${tiempoRestante}`);
            return;
        }
        
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
        this.actualizarTabla();
        this.actualizarFixture();
        this.verificarFechasDisponibles();
        
        if (this.fechaActual >= this.totalFechas) {
            this.finalizarTorneo();
        }
        
        console.log(`Fecha ${this.fechaActual} simulada`);
    }

    simularTodo() {
        alert('La simulación completa está deshabilitada. Debes jugar fecha por fecha respetando el calendario.');
    }

    finalizarTorneo() {
        document.getElementById('btn-simular-fecha').disabled = true;
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
            } else if (index === this.fechaActual) {
                const ahora = new Date();
                const fechaProgramada = this.fechasTorneo[index];
                if (fechaProgramada && ahora >= fechaProgramada) {
                    estadoFecha = '🟢 Disponible';
                    colorFecha = '#d1ecf1';
                } else if (fechaProgramada) {
                    const tiempoRestante = this.calcularTiempoRestante(fechaProgramada);
                    estadoFecha = `⏱️ En ${tiempoRestante}`;
                    colorFecha = '#fff3cd';
                }
            } else {
                estadoFecha = '⏳ Programada';
                colorFecha = '#f8d7da';
            }
            
            const fechaProgramadaTexto = fecha.fechaProgramada ? 
                fecha.fechaProgramada.toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                }) : '';
            
            fechaDiv.style.backgroundColor = colorFecha;
            fechaDiv.style.border = '1px solid #dee2e6';
            fechaDiv.style.borderRadius = '8px';
            fechaDiv.style.padding = '10px';
            fechaDiv.style.marginBottom = '10px';
            
            fechaDiv.innerHTML = `
                <h4>Fecha ${fecha.numero} - ${estadoFecha} ${fechaProgramadaTexto ? `(${fechaProgramadaTexto})` : ''}</h4>
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
        document.getElementById('btn-simular-fecha').disabled = true;
        document.getElementById('btn-simular-todo').disabled = true;
        
        // Restaurar texto del botón
        document.getElementById('btn-simular-fecha').textContent = 'Simular Fecha';
        document.getElementById('btn-simular-fecha').style.backgroundColor = '';
        
        console.log('Torneo reiniciado');
    }
}

// Inicializar el simulador cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const torneo = new TorneoApertura();
    console.log('Simulador del Torneo Apertura con sistema de fechas cargado');
});

// Verificar que los datos estén disponibles
if (typeof clubes === 'undefined') {
    console.error('No se encontraron los datos de clubes. Asegúrate de que clubes.js esté cargado.');
}
