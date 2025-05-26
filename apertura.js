class TorneoApertura {
    constructor() {
        this.equipos = [];
        this.fixture = [];
        this.fechaActual = 0;
        this.totalFechas = 18;
        this.partidosJugados = 0;
        this.torneoIniciado = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('btn-iniciar').addEventListener('click', () => this.iniciarTorneo());
        document.getElementById('btn-simular-fecha').addEventListener('click', () => this.simularFecha());
        document.getElementById('btn-simular-todo').addEventListener('click', () => this.simularTodo());
        document.getElementById('btn-reiniciar').addEventListener('click', () => this.reiniciarTorneo());
    }

    obtenerEquiposPeruanos() {
        return clubes.filter(club => {
            const [prefijo] = club.id.split('-');
            return prefijo === '51';
        }).slice(0, 18); // Solo tomamos 18 equipos
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
            pj: 0, // Partidos jugados
            g: 0,  // Ganados
            e: 0,  // Empatados
            p: 0,  // Perdidos
            gf: 0, // Goles a favor
            gc: 0, // Goles en contra
            dg: 0, // Diferencia de goles
            pts: 0 // Puntos
        }));

        this.generarFixture();
        this.actualizarTabla();
        this.mostrarFixture();
        this.torneoIniciado = true;
        
        document.getElementById('btn-iniciar').disabled = true;
        document.getElementById('btn-simular-fecha').disabled = false;
        document.getElementById('btn-simular-todo').disabled = false;
        
        console.log('Torneo Apertura iniciado con', this.equipos.length, 'equipos');
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
                    local = 0; // El primer equipo siempre es local en la primera mitad
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
                partidos: partidos
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
            // Gana local
            local.g++;
            local.pts += 3;
            visitante.p++;
        } else if (golesLocal < golesVisitante) {
            // Gana visitante
            visitante.g++;
            visitante.pts += 3;
            local.p++;
        } else {
            // Empate
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
        
        if (this.fechaActual >= this.totalFechas) {
            this.finalizarTorneo();
        }
        
        console.log(`Fecha ${this.fechaActual} simulada`);
    }

    simularTodo() {
        if (!this.torneoIniciado) {
            alert('Primero debes iniciar el torneo');
            return;
        }
        
        while (this.fechaActual < this.totalFechas) {
            this.simularFecha();
        }
    }

    finalizarTorneo() {
        document.getElementById('btn-simular-fecha').disabled = true;
        document.getElementById('btn-simular-todo').disabled = true;
        
        const campeon = this.equipos[0];
        alert(`¡Torneo Apertura finalizado!\n\nCampeón: ${campeon.nombre}\nPuntos: ${campeon.pts}\nPartidos: ${campeon.pj}`);
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
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td style="text-align: left; font-weight: bold;">${equipo.nombre}</td>
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
    }

    mostrarFixture() {
        const container = document.getElementById('fechas-container');
        container.innerHTML = '';
        
        this.fixture.forEach((fecha, index) => {
            const fechaDiv = document.createElement('div');
            fechaDiv.className = 'fecha';
            fechaDiv.innerHTML = `
                <h4>Fecha ${fecha.numero}</h4>
                <div class="partidos">
                    ${fecha.partidos.map(partido => `
                        <div class="partido">
                            <div class="equipo-local">${partido.local.nombre}</div>
                            <div class="${partido.jugado ? 'resultado' : 'vs'}">
                                ${partido.jugado ? partido.resultado : 'VS'}
                            </div>
                            <div class="equipo-visitante">${partido.visitante.nombre}</div>
                        </div>
                    `).join('')}
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
        
        document.getElementById('tabla-body').innerHTML = '';
        document.getElementById('fechas-container').innerHTML = '';
        
        document.getElementById('btn-iniciar').disabled = false;
        document.getElementById('btn-simular-fecha').disabled = true;
        document.getElementById('btn-simular-todo').disabled = true;
        
        console.log('Torneo reiniciado');
    }
}

// Inicializar el simulador cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const torneo = new TorneoApertura();
    console.log('Simulador del Torneo Apertura cargado');
});

// Verificar que los datos estén disponibles
if (typeof clubes === 'undefined') {
    console.error('No se encontraron los datos de clubes. Asegúrate de que clubes.js esté cargado.');
}
