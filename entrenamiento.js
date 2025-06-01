let jugadorActual = null;
let entrenamientoSeleccionado = null;

// Configuración de entrenamientos por posición
const entrenamientosPorPosicion = {
    'POR': [
        {
            id: 'arquero_reflejos',
            titulo: '🥅 Entrenamiento de Reflejos',
            descripcion: 'Mejora los reflejos y la agilidad del portero con ejercicios específicos de parada.',
            duracion: 2, // horas
            mejoras: { defensa: 3, resistencia: 2 },
            icono: '🥅'
        },
        {
            id: 'arquero_salida',
            titulo: '🏃‍♂️ Salida de Arco',
            descripcion: 'Entrena la velocidad de salida y el juego con los pies del portero.',
            duracion: 3,
            mejoras: { sprint: 2, pase: 2, defensa: 1 },
            icono: '🏃‍♂️'
        }
    ],
    'DEF': [
        {
            id: 'defensa_marcaje',
            titulo: '🛡️ Técnica de Marcaje',
            descripcion: 'Perfecciona las técnicas defensivas y el posicionamiento en el campo.',
            duracion: 2,
            mejoras: { defensa: 3, resistencia: 1 },
            icono: '🛡️'
        },
        {
            id: 'defensa_juego_aereo',
            titulo: '🦅 Juego Aéreo',
            descripcion: 'Mejora el juego de cabeza y la disputa de pelotas aéreas.',
            duracion: 3,
            mejoras: { defensa: 2, tiro: 1, resistencia: 2 },
            icono: '🦅'
        }
    ],
    'MED': [
        {
            id: 'medio_pase',
            titulo: '🎯 Precisión de Pase',
            descripcion: 'Entrena la precisión y visión de juego para mejorar la distribución del balón.',
            duracion: 2,
            mejoras: { pase: 3, regate: 1 },
            icono: '🎯'
        },
        {
            id: 'medio_vision',
            titulo: '👁️ Visión de Juego',
            descripcion: 'Desarrolla la capacidad de lectura del juego y creación de oportunidades.',
            duracion: 4,
            mejoras: { pase: 2, regate: 2, resistencia: 1 },
            icono: '👁️'
        }
    ],
    'DEL': [
        {
            id: 'delantero_definicion',
            titulo: '⚽ Definición',
            descripcion: 'Mejora la precisión y potencia en el remate al arco.',
            duracion: 2,
            mejoras: { tiro: 3, regate: 1 },
            icono: '⚽'
        },
        {
            id: 'delantero_velocidad',
            titulo: '💨 Velocidad de Ataque',
            descripcion: 'Entrena la explosividad en espacios cortos y la velocidad punta.',
            duracion: 3,
            mejoras: { sprint: 3, tiro: 1, resistencia: 1 },
            icono: '💨'
        }
    ]
};

// Entrenamientos generales
const entrenamientosGenerales = [
    {
        id: 'fisico_general',
        titulo: '💪 Preparación Física',
        descripcion: 'Mejora la condición física general y la resistencia del jugador.',
        duracion: 1,
        mejoras: { resistencia: 2, sprint: 1 },
        icono: '💪'
    },
    {
        id: 'tecnico_general',
        titulo: '⚽ Técnica Individual',
        descripcion: 'Trabajo técnico básico con el balón para mejorar el control y toque.',
        duracion: 2,
        mejoras: { regate: 2, pase: 1 },
        icono: '⚽'
    },
    {
        id: 'tactico_general',
        titulo: '🧠 Entrenamiento Táctico',
        descripcion: 'Mejora la comprensión táctica y la toma de decisiones en el campo.',
        duracion: 3,
        mejoras: { pase: 1, defensa: 1, resistencia: 1 },
        icono: '🧠'
    }
];

// Cambios de posición posibles
const cambiosPosicion = {
    'POR': ['DEF'],
    'DEF': ['MED', 'POR'],
    'MED': ['DEF', 'DEL'],
    'DEL': ['MED']
};

function cargarJugador() {
    const jugadorId = localStorage.getItem("jugadorParaEntrenar");
    if (!jugadorId) {
        document.getElementById("jugadorInfo").innerHTML = 
            '<div class="sin-jugador">❌ No se ha seleccionado ningún jugador para entrenar.</div>';
        return;
    }
    
    const jugadoresPorClubData = localStorage.getItem("jugadoresPorClub");
    const clubSeleccionado = localStorage.getItem("selectedClub");
    
    if (!jugadoresPorClubData || !clubSeleccionado) {
        document.getElementById("jugadorInfo").innerHTML = 
            '<div class="sin-jugador">❌ Error al cargar los datos del jugador.</div>';
        return;
    }
    
    try {
        const jugadoresPorClub = JSON.parse(jugadoresPorClubData);
        let clubId = null;
        
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.nombre === clubSeleccionado);
            clubId = club ? club.id : null;
        }
        
        if (!clubId || !jugadoresPorClub[clubId]) {
            document.getElementById("jugadorInfo").innerHTML = 
                '<div class="sin-jugador">❌ No se encontró el club.</div>';
            return;
        }
        
        jugadorActual = jugadoresPorClub[clubId][jugadorId];
        
        if (!jugadorActual) {
            document.getElementById("jugadorInfo").innerHTML = 
                '<div class="sin-jugador">❌ Jugador no encontrado.</div>';
            return;
        }
        
        mostrarInformacionJugador();
        cargarEntrenamientos();
        
    } catch (error) {
        console.error('Error al cargar jugador:', error);
        document.getElementById("jugadorInfo").innerHTML = 
            '<div class="sin-jugador">❌ Error al procesar los datos.</div>';
    }
}

function mostrarInformacionJugador() {
    document.getElementById("jugadorInfo").innerHTML = `
        <div class="jugador-nombre">${jugadorActual.nombre}</div>
        <div style="font-size: 18px; margin-bottom: 15px;">
            <span style="background: rgba(255,255,255,0.3); padding: 5px 15px; border-radius: 20px;">
                ${jugadorActual.posicion} • ${jugadorActual.edad} años • General: ${jugadorActual.general}
            </span>
        </div>
        <div class="jugador-stats">
            <div class="stat-item">
                <div class="stat-value">${jugadorActual.sprint}</div>
                <div class="stat-label">Sprint</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${jugadorActual.regate}</div>
                <div class="stat-label">Regate</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${jugadorActual.pase}</div>
                <div class="stat-label">Pase</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${jugadorActual.tiro}</div>
                <div class="stat-label">Tiro</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${jugadorActual.defensa}</div>
                <div class="stat-label">Defensa</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${jugadorActual.resistencia}</div>
                <div class="stat-label">Resistencia</div>
            </div>
        </div>
    `;
}

function cargarEntrenamientos() {
    // Entrenamientos especializados
    const entrenamientosEsp = entrenamientosPorPosicion[jugadorActual.posicion] || [];
    document.getElementById("entrenamientosEspecializados").innerHTML = 
        entrenamientosEsp.map(ent => crearTarjetaEntrenamiento(ent)).join('');
    
    // Entrenamientos generales
    document.getElementById("entrenamientosGenerales").innerHTML = 
        entrenamientosGenerales.map(ent => crearTarjetaEntrenamiento(ent)).join('');
    
    // Cambios de posición
    const posicionesPosibles = cambiosPosicion[jugadorActual.posicion] || [];
    const cambiosHtml = posicionesPosibles.map(posicion => {
        const nombrePosicion = {
            'POR': 'Portero',
            'DEF': 'Defensa',
            'MED': 'Mediocampista',
            'DEL': 'Delantero'
        };
        
        return crearTarjetaCambioPosicion(posicion, nombrePosicion[posicion]);
    }).join('');
    
    document.getElementById("cambiosPosicion").innerHTML = cambiosHtml || 
        '<div style="text-align: center; color: #666; font-style: italic;">No hay cambios de posición disponibles para esta posición.</div>';
    
    document.getElementById("entrenamientosContainer").style.display = 'block';
}

function crearTarjetaEntrenamiento(entrenamiento) {
    return `
        <div class="entrenamiento-card" onclick="seleccionarEntrenamiento('${entrenamiento.id}', 'normal')">
            <div class="entrenamiento-titulo">
                <span>${entrenamiento.icono}</span>
                ${entrenamiento.titulo}
            </div>
            <div class="entrenamiento-descripcion">${entrenamiento.descripcion}</div>
            <div class="entrenamiento-beneficios">
                ${Object.entries(entrenamiento.mejoras).map(([stat, valor]) => `
                    <div class="beneficio-item">
                        <span class="beneficio-stat">${stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
                        <span class="beneficio-valor">+${valor}</span>
                    </div>
                `).join('')}
            </div>
            <div class="entrenamiento-tiempo">
                <span>⏱️ Duración</span>
                <span class="tiempo-duracion">${entrenamiento.duracion}h</span>
            </div>
        </div>
    `;
}

function crearTarjetaCambioPosicion(posicion, nombrePosicion) {
    return `
        <div class="entrenamiento-card cambio-posicion" onclick="seleccionarEntrenamiento('${posicion}', 'cambio_posicion')">
            <div class="entrenamiento-titulo">
                <span>🔄</span>
                Cambiar a ${nombrePosicion}
            </div>
            <div class="entrenamiento-descripcion">
                Reentrena al jugador para adaptarse a la posición de ${nombrePosicion}. 
                Este proceso toma más tiempo pero abre nuevas posibilidades tácticas.
            </div>
            <div class="entrenamiento-beneficios">
                <div class="beneficio-item">
                    <span class="beneficio-stat">Nueva Posición:</span>
                    <span class="beneficio-valor">${posicion}</span>
                </div>
                <div class="beneficio-item">
                    <span class="beneficio-stat">Mejora General:</span>
                    <span class="beneficio-valor">+1-3</span>
                </div>
            </div>
            <div class="entrenamiento-tiempo">
                <span>⏱️ Duración</span>
                <span class="tiempo-duracion">8h</span>
            </div>
        </div>
    `;
}

function seleccionarEntrenamiento(entrenamientoId, tipo) {
    entrenamientoSeleccionado = { id: entrenamientoId, tipo: tipo };
    
    let descripcionModal = '';
    let duracion = 0;
    
    if (tipo === 'cambio_posicion') {
        const nombrePosicion = {
            'POR': 'Portero',
            'DEF': 'Defensa', 
            'MED': 'Mediocampista',
            'DEL': 'Delantero'
        };
        descripcionModal = `¿Estás seguro de que quieres cambiar a ${jugadorActual.nombre} de ${jugadorActual.posicion} a ${nombrePosicion[entrenamientoId]}? Este entrenamiento tomará 8 horas y mejorará sus habilidades generales.`;
        duracion = 8;
    } else {
        // Buscar el entrenamiento en todas las listas
        let entrenamiento = null;
        const todosEntrenamientos = [
            ...(entrenamientosPorPosicion[jugadorActual.posicion] || []),
            ...entrenamientosGenerales
        ];
        
        entrenamiento = todosEntrenamientos.find(e => e.id === entrenamientoId);
        
        if (entrenamiento) {
            descripcionModal = `¿Quieres iniciar "${entrenamiento.titulo}" para ${jugadorActual.nombre}? Este entrenamiento tomará ${entrenamiento.duracion} hora(s) y mejorará: ${Object.entries(entrenamiento.mejoras).map(([stat, valor]) => `${stat} +${valor}`).join(', ')}.`;
            duracion = entrenamiento.duracion;
        }
    }
    
    document.getElementById("modalDescripcion").textContent = descripcionModal;
    document.getElementById("confirmacionModal").style.display = 'block';
}

function confirmarEntrenamiento() {
    if (!entrenamientoSeleccionado) return;
    
    const jugadorId = localStorage.getItem("jugadorParaEntrenar");
    const ahora = new Date().getTime();
    let duracion = 0;
    let tipo = '';
    let mejoras = {};
    let nuevaPosicion = null;
    
    if (entrenamientoSeleccionado.tipo === 'cambio_posicion') {
        duracion = 8;
        tipo = `Cambio a ${entrenamientoSeleccionado.id}`;
        mejoras = {
            sprint: Math.floor(Math.random() * 3) + 1,
            regate: Math.floor(Math.random() * 3) + 1,
            pase: Math.floor(Math.random() * 3) + 1,
            tiro: Math.floor(Math.random() * 3) + 1,
            defensa: Math.floor(Math.random() * 3) + 1,
            resistencia: Math.floor(Math.random() * 3) + 1
        };
        nuevaPosicion = entrenamientoSeleccionado.id;
    } else {
        // Buscar el entrenamiento
        const todosEntrenamientos = [
            ...(entrenamientosPorPosicion[jugadorActual.posicion] || []),
            ...entrenamientosGenerales
        ];
        
        const entrenamiento = todosEntrenamientos.find(e => e.id === entrenamientoSeleccionado.id);
        if (entrenamiento) {
            duracion = entrenamiento.duracion;
            tipo = entrenamiento.titulo;
            mejoras = entrenamiento.mejoras;
        }
    }
    
    // Guardar entrenamiento activo
    const entrenamientosActivos = JSON.parse(localStorage.getItem("entrenamientosActivos") || "{}");
    entrenamientosActivos[jugadorId] = {
        tipo: tipo,
        iniciadoEn: ahora,
        finalizaEn: ahora + (duracion * 60 * 60 * 1000), // duracion en horas convertida a ms
        mejoras: mejoras,
        nuevaPosicion: nuevaPosicion
    };
    
    localStorage.setItem("entrenamientosActivos", JSON.stringify(entrenamientosActivos));
    
    cerrarModal();
    
    // Mostrar confirmación y redirigir
    alert(`¡Entrenamiento iniciado! ${jugadorActual.nombre} estará entrenando "${tipo}" durante ${duracion} hora(s). Podrás recoger los resultados cuando termine.`);
    
    // Volver a la lista de jugadores
    history.back();
}

function cerrarModal() {
    document.getElementById("confirmacionModal").style.display = 'none';
    entrenamientoSeleccionado = null;
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById("confirmacionModal");
    if (event.target === modal) {
        cerrarModal();
    }
}

// Cargar jugador al iniciar la página
window.addEventListener('load', cargarJugador);
