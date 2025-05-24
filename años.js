document.addEventListener('DOMContentLoaded', function() {
    // === CONFIGURACIÓN INICIAL ===
    const equipoNombre = "Mi Equipo"; // Nombre de tu equipo (puedes cambiarlo)
    let anoActualJuego = parseInt(localStorage.getItem("anoJuego") || "1");
    
    // Verificar que existan los datos de jugadores
    if (!window.jugadores) {
        console.error("No hay datos de jugadores cargados");
        return;
    }
    
    // === FUNCIONES PRINCIPALES ===
    
    // Obtener jugadores que NO son de mi equipo
    function obtenerJugadoresDisponibles() {
        const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        
        return jugadores.filter(jugador => {
            return jugador.club !== equipoNombre;
        });
    }
    
    // Envejecer todos los jugadores un año
    function envejecerTodosLosJugadores() {
        const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        
        jugadores.forEach(jugador => {
            jugador.edad += 1;
        });
        
        // Guardar los jugadores actualizados
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        
        console.log(`✅ Todos los jugadores envejecieron 1 año`);
        return jugadores;
    }
    
    // Avanzar un año en el juego
    function avanzarUnAno() {
        anoActualJuego += 1;
        localStorage.setItem("anoJuego", anoActualJuego.toString());
        
        // Envejecer a todos los jugadores
        envejecerTodosLosJugadores();
        
        // Actualizar la interfaz
        actualizarInterfaz();
        
        console.log(`🗓️ Avanzó al año ${anoActualJuego} del juego`);
    }
    
    // Crear tarjeta de jugador
    function crearTarjetaJugador(jugador) {
        const tarjeta = document.createElement('div');
        tarjeta.style.cssText = `
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        tarjeta.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #333;">${jugador.nombre}</h3>
            <p style="margin: 5px 0; color: #666;">
                <strong>Posición:</strong> ${jugador.posicion}
            </p>
            <p style="margin: 5px 0; color: #666;">
                <strong>Club:</strong> ${jugador.club}
            </p>
            <p style="margin: 5px 0; color: #666;">
                <strong>Edad:</strong> ${jugador.edad} años
            </p>
            <p style="margin: 5px 0; color: #666;">
                <strong>Overall:</strong> ${jugador.general || 'N/A'}
            </p>
        `;
        
        return tarjeta;
    }
    
    // Mostrar todos los jugadores disponibles
    function mostrarJugadores() {
        const grid = document.getElementById('playersGrid');
        if (!grid) return;
        
        const jugadoresDisponibles = obtenerJugadoresDisponibles();
        grid.innerHTML = '';
        
        if (jugadoresDisponibles.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #888;">No hay jugadores disponibles</p>';
            return;
        }
        
        // Aplicar estilos al grid
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            padding: 20px;
        `;
        
        // Crear tarjetas para cada jugador
        jugadoresDisponibles.forEach(jugador => {
            const tarjeta = crearTarjetaJugador(jugador);
            grid.appendChild(tarjeta);
        });
        
        // Actualizar contador
        const totalElement = document.getElementById('totalJugadores');
        if (totalElement) {
            totalElement.textContent = jugadoresDisponibles.length;
        }
        
        console.log(`📋 Mostrando ${jugadoresDisponibles.length} jugadores disponibles`);
    }
    
    // Actualizar toda la interfaz
    function actualizarInterfaz() {
        // Actualizar año actual
        const anoElement = document.getElementById('anoActual');
        if (anoElement) {
            anoElement.textContent = anoActualJuego;
        }
        
        // Actualizar nombre del equipo
        const equipoElement = document.getElementById('teamName');
        if (equipoElement) {
            equipoElement.textContent = equipoNombre;
        }
        
        // Mostrar jugadores actualizados
        mostrarJugadores();
    }
    
    // === EVENTOS ===
    
    // Botón para avanzar año
    const botonAvanzar = document.getElementById('avanzarAno');
    if (botonAvanzar) {
        botonAvanzar.addEventListener('click', avanzarUnAno);
        
        // Estilos para el botón
        botonAvanzar.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin: 10px;
        `;
        
        botonAvanzar.addEventListener('mouseenter', function() {
            this.style.background = '#0056b3';
        });
        
        botonAvanzar.addEventListener('mouseleave', function() {
            this.style.background = '#007bff';
        });
    }
    
    // === INICIALIZACIÓN ===
    
    // Aplicar estilos básicos al body
    document.body.style.cssText = `
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
    `;
    
    // Estilos para el container
    const container = document.querySelector('.container');
    if (container) {
        container.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        `;
    }
    
    // Estilos para los controles
    const controls = document.querySelector('.controls');
    if (controls) {
        controls.style.cssText = `
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        `;
    }
    
    // Inicializar la interfaz
    actualizarInterfaz();
    
    // === LOGS INICIALES ===
    console.log(`=== SISTEMA DE JUGADORES ===`);
    console.log(`Equipo: ${equipoNombre}`);
    console.log(`Año actual del juego: ${anoActualJuego}`);
    
    const totalJugadores = JSON.parse(localStorage.getItem("jugadores") || "[]").length;
    const jugadoresDisponibles = obtenerJugadoresDisponibles().length;
    
    console.log(`Total de jugadores en la base: ${totalJugadores}`);
    console.log(`Jugadores disponibles (no son de ${equipoNombre}): ${jugadoresDisponibles}`);
});
