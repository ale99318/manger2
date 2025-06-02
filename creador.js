// ==================== VARIABLES GLOBALES ORIGINALES ====================
let jugadores = [];
let jugadoresPorClub = {};
let cambiosSinGuardar = false;

const nombres = [
  "Carlos", "Juan", "Pedro", "Luis", "Miguel", "Andrés", "Santiago", "Daniel", 
  "Fernando", "Pablo", "Diego", "Javier", "Alejandro", "Roberto", "Mario", 
  "Sergio", "Antonio", "Francisco", "José", "Manuel", "Ricardo", "Eduardo", 
  "Raúl", "Guillermo", "Gonzalo", "Mateo", "Sebastián", "Nicolás", "Gabriel", "Emilio"
];

const apellidos = [
  "García", "López", "Martínez", "González", "Pérez", "Rodríguez", "Sánchez", 
  "Fernández", "Torres", "Ramírez", "Castro", "Vargas", "Herrera", "Mendoza", 
  "Silva", "Jiménez", "Morales", "Ruiz", "Ortega", "Delgado", "Cruz", "Flores", 
  "Ramos", "Aguilar", "Medina", "Romero", "Núñez", "Guerrero", "Peña", "Vega"
];

const posiciones = ["POR", "DEF", "MED", "DEL"];

// Configuración de precios y habilidades por liga (valores en USD)
const configPorLiga = {
  // Brasil (Liga más fuerte económicamente)
  "55": { 
    valorMin: 25000, valorMax: 180000, 
    sueldoMin: 1800, sueldoMax: 12000,
    generalMin: 75, generalMax: 82
  },
  // Argentina (Segunda liga más fuerte)
  "54": { 
    valorMin: 18000, valorMax: 150000, 
    sueldoMin: 1200, sueldoMax: 9000,
    generalMin: 74, generalMax: 80
  },
  // Colombia (Liga competitiva)
  "57": { 
    valorMin: 12000, valorMax: 120000, 
    sueldoMin: 900, sueldoMax: 7500,
    generalMin: 70, generalMax: 77
  },
  // Chile (Liga estable)
  "56": { 
    valorMin: 10000, valorMax: 100000, 
    sueldoMin: 800, sueldoMax: 6500,
    generalMin: 68, generalMax: 75
  },
  // Uruguay (Liga tradicional pero pequeña)
  "598": { 
    valorMin: 8000, valorMax: 85000, 
    sueldoMin: 700, sueldoMax: 5500,
    generalMin: 69, generalMax: 76
  },
  // Ecuador (Liga en crecimiento)
  "593": { 
    valorMin: 7000, valorMax: 75000, 
    sueldoMin: 600, sueldoMax: 4800,
    generalMin: 68, generalMax: 74
  },
  // Perú (Liga competitiva pero con menos recursos)
  "51": { 
    valorMin: 6000, valorMax: 65000, 
    sueldoMin: 500, sueldoMax: 4200,
    generalMin: 65, generalMax: 72
  },
  // Paraguay (Liga pequeña)
  "595": { 
    valorMin: 5000, valorMax: 55000, 
    sueldoMin: 450, sueldoMax: 3800,
    generalMin: 65, generalMax: 72
  },
  // Venezuela (Crisis económica)
  "58": { 
    valorMin: 4000, valorMax: 45000, 
    sueldoMin: 350, sueldoMax: 3000,
    generalMin: 60, generalMax: 67
  },
  // Bolivia (Liga con menos recursos)
  "591": { 
    valorMin: 3500, valorMax: 40000, 
    sueldoMin: 300, sueldoMax: 2500,
    generalMin: 60, generalMax: 68
  }
};

// ==================== FUNCIONES ORIGINALES ====================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function obtenerConfigLiga(clubId) {
  const ligaId = clubId.split('-')[0];
  return configPorLiga[ligaId] || configPorLiga["51"]; // Default a Perú si no se encuentra
}

function calcularValorPorHabilidad(general, potencial, config) {
  // Factor base según el rating general (ajustado a los nuevos rangos)
  let factorBase = 1.0;
  const rangoGeneral = config.generalMax - config.generalMin;
  const posicionEnRango = (general - config.generalMin) / rangoGeneral;
  
  if (posicionEnRango >= 0.9) factorBase = 1.4;      // Top 10%
  else if (posicionEnRango >= 0.75) factorBase = 1.2; // Top 25%
  else if (posicionEnRango >= 0.6) factorBase = 1.1;  // Arriba del 60%
  else if (posicionEnRango >= 0.4) factorBase = 1.0;  // Promedio
  else if (posicionEnRango >= 0.2) factorBase = 0.9;  // Bajo promedio
  else factorBase = 0.8;                              // Bottom 20%
  
  // Factor potencial (ajustado)
  let factorPotencial = 1.0;
  if (potencial >= 90) factorPotencial = 1.3;
  else if (potencial >= 85) factorPotencial = 1.2;
  else if (potencial >= 80) factorPotencial = 1.1;
  
  const rangoValor = config.valorMax - config.valorMin;
  const valorBase = config.valorMin + (rangoValor * posicionEnRango);
  
  return Math.round(valorBase * factorBase * factorPotencial);
}

function calcularSueldoPorValor(valor, config) {
  // El sueldo está relacionado con el valor pero con cierta variación
  const porcentajeValor = (valor - config.valorMin) / (config.valorMax - config.valorMin);
  const rangoSueldo = config.sueldoMax - config.sueldoMin;
  const sueldoBase = config.sueldoMin + (rangoSueldo * porcentajeValor);
  
  // Añadir variación random del ±20%
  const variacion = sueldoBase * 0.2;
  const sueldoFinal = sueldoBase + rand(-variacion, variacion);
  
  return Math.max(config.sueldoMin, Math.round(sueldoFinal));
}

function generarJugador(clubId, jugadorId) {
  const nombre = nombres[rand(0, nombres.length-1)];
  const apellido = apellidos[rand(0, apellidos.length-1)];
  const config = obtenerConfigLiga(clubId);
  
  // Generar habilidad general según la liga
  const general = rand(config.generalMin, config.generalMax);
  
  // El potencial debe ser igual o mayor al general, con límite superior basado en la liga
  const potencialMin = Math.max(general, config.generalMin + 5);
  const potencialMax = Math.min(95, config.generalMax + 10);
  const potencial = rand(potencialMin, potencialMax);
  
  // Calcular valor basado en habilidades y liga
  const valor = calcularValorPorHabilidad(general, potencial, config);
  
  // Calcular sueldo basado en valor
  const sueldo = calcularSueldoPorValor(valor, config);
  
  // Generar fecha de nacimiento aleatoria (solo mes y día, el año no importa porque usamos edad directamente)
  const birthdayMonth = rand(1, 12); // Mes de 1 a 12
  const birthdayDay = rand(1, new Date(2025, birthdayMonth, 0).getDate()); // Día válido para el mes
  
  return {
    id: jugadorId,
    clubId: clubId,
    nombre: `${nombre} ${apellido}`,
    edad: rand(18, 35),
    birthdayMonth: birthdayMonth,
    birthdayDay: birthdayDay,
    posicion: posiciones[rand(0, posiciones.length-1)],
    general: general,
    potencial: potencial,
    sprint: rand(50, 95),
    regate: rand(50, 95),
    pase: rand(50, 95),
    tiro: rand(50, 95),
    defensa: rand(40, 90),
    resistencia: rand(60, 95),
    valor: valor,
    sueldo: sueldo
  };
}

function actualizarEstadoGuardado(guardado) {
  const btnContinuar = document.getElementById("btnContinuar");
  const btnGuardar = document.getElementById("btnGuardar");
  
  if (guardado) {
    cambiosSinGuardar = false;
    btnContinuar.disabled = false;
    btnContinuar.classList.remove("disabled");
    
    // Agregar indicador de guardado
    let statusIndicator = document.querySelector(".save-status");
    if (statusIndicator) {
      statusIndicator.remove();
    }
    
    statusIndicator = document.createElement("span");
    statusIndicator.className = "save-status saved";
    statusIndicator.textContent = "✅ Guardado";
    btnGuardar.parentNode.insertBefore(statusIndicator, btnGuardar.nextSibling);
  } else {
    cambiosSinGuardar = true;
    btnContinuar.disabled = true;
    btnContinuar.classList.add("disabled");
    
    // Agregar indicador de no guardado
    let statusIndicator = document.querySelector(".save-status");
    if (statusIndicator) {
      statusIndicator.remove();
    }
    
    statusIndicator = document.createElement("span");
    statusIndicator.className = "save-status unsaved";
    statusIndicator.textContent = "⚠️ Sin guardar";
    btnGuardar.parentNode.insertBefore(statusIndicator, btnGuardar.nextSibling);
  }
}

function generarJugadores() {
  if (typeof clubes === 'undefined') {
    alert("❌ Error: No se pudo cargar el archivo clubes.js");
    return;
  }
  
  jugadoresPorClub = {};
  let jugadorIdGlobal = 0;
  
  clubes.forEach(club => {
    jugadoresPorClub[club.id] = [];
    
    // Generar entre 20-25 jugadores por club
    const cantidadJugadores = rand(20, 25);
    
    for (let i = 0; i < cantidadJugadores; i++) {
      const jugador = generarJugador(club.id, jugadorIdGlobal++);
      jugadoresPorClub[club.id].push(jugador);
    }
  });
  
  // Mostrar jugadores del club seleccionado o todos si no hay selección
  const clubSeleccionado = localStorage.getItem("selectedClub");
  if (clubSeleccionado) {
    const clubId = clubes.find(c => c.nombre === clubSeleccionado)?.id;
    if (clubId && jugadoresPorClub[clubId]) {
      jugadores = jugadoresPorClub[clubId];
    }
  } else {
    // Si no hay club seleccionado, mostrar todos los jugadores
    jugadores = [];
    Object.values(jugadoresPorClub).forEach(clubJugadores => {
      jugadores = jugadores.concat(clubJugadores);
    });
  }
  
  mostrarEstadisticas();
  mostrar();
  
  // Marcar como no guardado
  actualizarEstadoGuardado(false);
}

function mostrarEstadisticas() {
  const totalJugadores = Object.values(jugadoresPorClub).reduce((total, jugadores) => total + jugadores.length, 0);
  const totalClubes = Object.keys(jugadoresPorClub).length;
  
  document.getElementById("statsContainer").innerHTML = `
    <div class="stats-summary">
      <strong>📊 Generación Completada:</strong> 
      ${totalJugadores} jugadores creados para ${totalClubes} clubes
      ${localStorage.getItem("selectedClub") ? ` | Mostrando: ${localStorage.getItem("selectedClub")}` : ' | Mostrando: Todos los jugadores'}
    </div>
  `;
}

function mostrar() {
  if (jugadores.length === 0) {
    document.getElementById("contenedor").innerHTML = "<p style='text-align:center; color:#666;'>No hay jugadores para mostrar. Haz clic en 'Generar Jugadores'.</p>";
    return;
  }

  let html = `<table>
    <tr>
      <th>ID</th><th>Nombre</th><th>Edad</th><th>Pos</th><th>GEN</th><th>POT</th>
      <th>SPR</th><th>REG</th><th>PAS</th><th>TIR</th><th>DEF</th><th>RES</th>
      <th>Valor ($)</th><th>Sueldo ($)</th>
    </tr>`;
  
  jugadores.forEach((j, i) => {
    html += `<tr>
      <td>${j.id}</td>
      <td><input type="text" value="${j.nombre}" onchange="editar(${i}, 'nombre', this.value)"></td>
      <td><input type="number" value="${j.edad}" min="16" max="40" onchange="editar(${i}, 'edad', this.value)"></td>
      <td>
        <select onchange="editar(${i}, 'posicion', this.value)">
          <option value="POR" ${j.posicion==='POR'?'selected':''}>POR</option>
          <option value="DEF" ${j.posicion==='DEF'?'selected':''}>DEF</option>
          <option value="MED" ${j.posicion==='MED'?'selected':''}>MED</option>
          <option value="DEL" ${j.posicion==='DEL'?'selected':''}>DEL</option>
        </select>
      </td>
      <td><input type="number" value="${j.general}" min="30" max="99" onchange="editar(${i}, 'general', this.value)"></td>
      <td><input type="number" value="${j.potencial}" min="30" max="99" onchange="editar(${i}, 'potencial', this.value)"></td>
      <td><input type="number" value="${j.sprint}" min="30" max="99" onchange="editar(${i}, 'sprint', this.value)"></td>
      <td><input type="number" value="${j.regate}" min="30" max="99" onchange="editar(${i}, 'regate', this.value)"></td>
      <td><input type="number" value="${j.pase}" min="30" max="99" onchange="editar(${i}, 'pase', this.value)"></td>
      <td><input type="number" value="${j.tiro}" min="30" max="99" onchange="editar(${i}, 'tiro', this.value)"></td>
      <td><input type="number" value="${j.defensa}" min="30" max="99" onchange="editar(${i}, 'defensa', this.value)"></td>
      <td><input type="number" value="${j.resistencia}" min="30" max="99" onchange="editar(${i}, 'resistencia', this.value)"></td>
      <td><input type="number" value="${j.valor}" min="3000" onchange="editar(${i}, 'valor', this.value)"></td>
      <td><input type="number" value="${j.sueldo}" min="250" onchange="editar(${i}, 'sueldo', this.value)"></td>
    </tr>`;
  });
  
  html += "</table>";
  document.getElementById("contenedor").innerHTML = html;
}

function editar(indice, campo, valor) {
  if (campo === 'edad' || campo === 'general' || campo === 'potencial' || 
      campo === 'sprint' || campo === 'regate' || campo === 'pase' || 
      campo === 'tiro' || campo === 'defensa' || campo === 'resistencia' || 
      campo === 'valor' || campo === 'sueldo') {
    jugadores[indice][campo] = parseInt(valor);
  } else {
    jugadores[indice][campo] = valor;
  }
  
  // Actualizar también en jugadoresPorClub
  if (jugadores[indice].clubId && jugadoresPorClub[jugadores[indice].clubId]) {
    const jugadorEnClub = jugadoresPorClub[jugadores[indice].clubId].find(j => j.id === jugadores[indice].id);
    if (jugadorEnClub) {
      jugadorEnClub[campo] = jugadores[indice][campo];
    }
  }
  
  // Marcar como no guardado
  actualizarEstadoGuardado(false);
}

function guardar() {
  if (Object.keys(jugadoresPorClub).length === 0) {
    alert("⚠️ No hay jugadores para guardar. Genera jugadores primero.");
    return;
  }
  
  localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
  localStorage.setItem("jugadoresGenerados", "true");
  
  // Marcar como guardado
  actualizarEstadoGuardado(true);
  
  alert("✅ Jugadores guardados correctamente");
}

function continuarAlMenu() {
  if (cambiosSinGuardar) {
    alert("⚠️ Debes guardar los cambios antes de continuar al menú.");
    return;
  }
  
  // Verificar que los jugadores estén guardados
  if (Object.keys(jugadoresPorClub).length > 0) {
    localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
    localStorage.setItem("jugadoresGenerados", "true");
    
    // Redireccionar al menú
    window.location.href = "menu.html";
  } else {
    alert("⚠️ Debes generar jugadores antes de continuar.");
  }
}

// Funciones globales para otros archivos
window.obtenerJugadores = function() {
  const data = localStorage.getItem("jugadoresPorClub");
  if (!data) return [];
  
  const jugadoresPorClub = JSON.parse(data);
  let todosLosJugadores = [];
  Object.values(jugadoresPorClub).forEach(clubJugadores => {
    todosLosJugadores = todosLosJugadores.concat(clubJugadores);
  });
  return todosLosJugadores;
}

window.obtenerJugadoresPorClub = function(clubId = null) {
  const data = localStorage.getItem("jugadoresPorClub");
  if (!data) return clubId ? [] : {};
  
  const jugadoresPorClub = JSON.parse(data);
  return clubId ? (jugadoresPorClub[clubId] || []) : jugadoresPorClub;
}

// ==================== SISTEMA DE CALENDARIO ====================
class AutoCalendar {
    constructor() {
        this.startDate = new Date(2025, 0, 1); // 1 de enero 2025
        this.endDate = new Date(2040, 11, 31); // 31 de diciembre 2040
        this.currentDate = new Date(this.startDate);
        this.interval = null;
        this.isPaused = false;
        this.intervalTime = 5000; // 5 segundos
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadPlayersData();
        this.start();
    }
    
    initializeElements() {
        this.currentDateElement = document.getElementById('current-date');
        this.yearMonthElement = document.getElementById('year-month');
        this.daysGridElement = document.getElementById('days-grid');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressText = document.getElementById('progress-text');
        this.progressFill = document.getElementById('progress-fill');
        
        // Agregar elemento para mostrar información de jugadores
        this.createPlayersInfoElement();
    }
    
    createPlayersInfoElement() {
        const playersInfo = document.createElement('div');
        playersInfo.id = 'players-info';
        playersInfo.className = 'players-info';
        playersInfo.innerHTML = `
            <h3>📊 Estado de Jugadores</h3>
            <div id="players-stats"></div>
            <div id="retirement-log"></div>
        `;
        
        const container = document.querySelector('.container');
        container.appendChild(playersInfo);
    }
    
    setupEventListeners() {
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    loadPlayersData() {
        // Cargar jugadores desde localStorage si existen
        const jugadoresData = localStorage.getItem("jugadoresPorClub");
        if (jugadoresData) {
            jugadoresPorClub = JSON.parse(jugadoresData);
            this.updatePlayersStats();
        }
    }
    
    start() {
        this.updateDisplay();
        this.interval = setInterval(() => {
            this.nextDay();
        }, this.intervalTime);
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    togglePause() {
        if (this.isPaused) {
            this.start();
            this.pauseBtn.textContent = 'Pausar';
            this.pauseBtn.classList.remove('paused');
            this.isPaused = false;
        } else {
            this.stop();
            this.pauseBtn.textContent = 'Continuar';
            this.pauseBtn.classList.add('paused');
            this.isPaused = true;
        }
    }
    
    reset() {
        this.stop();
        this.currentDate = new Date(this.startDate);
        this.isPaused = false;
        this.pauseBtn.textContent = 'Pausar';
        this.pauseBtn.classList.remove('paused');
        
        // Recargar jugadores originales
        this.loadPlayersData();
        this.clearRetirementLog();
        this.start();
    }
    
    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        
        // Verificar cumpleaños de jugadores
        this.checkBirthdays();
        
        if (this.currentDate > this.endDate) {
            this.currentDate = new Date(this.startDate);
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.updateDateInfo();
        this.updateCalendar();
        this.updateProgress();
    }
    
    updateDateInfo() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        this.currentDateElement.textContent = this.currentDate.toLocaleDateString('es-ES', options);
        
        const monthYear = this.currentDate.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long' 
        });
        this.yearMonthElement.textContent = monthYear;
    }
    
    updateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = this.currentDate.getDate();
        
        // Primer día del mes
        const firstDay = new Date(year, month, 1);
        // Último día del mes
        const lastDay = new Date(year, month + 1, 0);
        
        // Ajustar el primer día para que lunes sea 0
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;
        
        // Limpiar el grid
        this.daysGridElement.innerHTML = '';
        
        // Días del mes anterior
        const prevMonth = new Date(year, month, 0);
        for (let i = startDay - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(
                prevMonth.getDate() - i, 
                'other-month'
            );
            this.daysGridElement.appendChild(dayElement);
        }
        
        // Días del mes actual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const isToday = day === today;
            const dayElement = this.createDayElement(
                day, 
                isToday ? 'current' : ''
            );
            this.daysGridElement.appendChild(dayElement);
        }
        
        // Días del mes siguiente para completar la grilla
        const totalCells = this.daysGridElement.children.length;
        const remainingCells = 42 - totalCells; // 6 semanas × 7 días
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'other-month');
            this.daysGridElement.appendChild(dayElement);
        }
    }
    
    createDayElement(day, className = '') {
        const dayElement = document.createElement('div');
        dayElement.className = `day ${className}`;
        dayElement.textContent = day;
        return dayElement;
    }
    
    updateProgress() {
        const totalDays = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
        const currentDays = Math.ceil((this.currentDate - this.startDate) / (1000 * 60 * 60 * 24));
        const percentage = (currentDays / totalDays) * 100;
        
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `Progreso: ${currentDays} de ${totalDays} días (${percentage.toFixed(2)}%)`;
    }
    
    // ==================== FUNCIONES DE JUGADORES CON CALENDARIO ====================
    
    checkBirthdays() {
        const currentMonth = this.currentDate.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1 para 1-12
        const currentDay = this.currentDate.getDate();
        let birthdayPlayers = [];
        let totalRetirements = 0;
        const retiredPlayers = [];
        
        // Procesar cada club
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            
            // Verificar cumpleaños y procesar retiros
            for (let i = jugadoresClub.length - 1; i >= 0; i--) {
                const jugador = jugadoresClub[i];
                
                // Verificar si es el cumpleaños del jugador
                if (jugador.birthdayMonth === currentMonth && jugador.birthdayDay === currentDay) {
                    jugador.edad += 1;
                    birthdayPlayers.push({
                        nombre: jugador.nombre,
                        edad: jugador.edad,
                        club: this.getClubName(clubId)
                    });
                    
                    // Verificar retiro en el cumpleaños
                    if (this.shouldPlayerRetire(jugador)) {
                        retiredPlayers.push({
                            nombre: jugador.nombre,
                            edad: jugador.edad,
                            club: this.getClubName(clubId),
                            posicion: jugador.posicion,
                            general: jugador.general
                        });
                        
                        // Remover jugador del array
                        jugadoresClub.splice(i, 1);
                        totalRetirements++;
                    }
                }
            }
        });
        
        // Guardar cambios en localStorage si hubo cambios
        if (birthdayPlayers.length > 0) {
            this.savePlayersData();
            this.updatePlayersStats();
            this.logBirthdaysAndRetirements(birthdayPlayers, retiredPlayers, this.currentDate);
        }
        
        // Generar nuevos jugadores para reemplazar retirados
        if (totalRetirements > 0) {
            this.generateReplacementPlayers(totalRetirements);
        }
    }
    
    shouldPlayerRetire(jugador) {
        if (jugador.edad < 36) return false;
        
        // Probabilidad de retiro basada en edad
        let retirementChance = 0;
        
        if (jugador.edad >= 36) retirementChance = 0.95; // 95%
        if (jugador.edad >= 38) retirementChance = 0.98; // 98%
        if (jugador.edad >= 40) retirementChance = 1.0;  // 100%
        
        // Jugadores con mayor habilidad tienden a retirarse más tarde
        if (jugador.general >= 80) {
            retirementChance *= 0.8; // Reducir probabilidad para jugadores elite
        }
        
        return Math.random() < retirementChance;
    }
    
    generateReplacementPlayers(count) {
        if (count === 0) return;
        
        console.log(`👶 Generando ${count} jugadores jóvenes para reemplazar retirados`);
        
        // Distribuir nuevos jugadores entre los clubes
        const clubIds = Object.keys(jugadoresPorClub);
        let playersGenerated = 0;
        
        while (playersGenerated < count && clubIds.length > 0) {
            clubIds.forEach(clubId => {
                if (playersGenerated >= count) return;
                
                const newPlayer = this.generateYoungPlayer(clubId);
                jugadoresPorClub[clubId].push(newPlayer);
                playersGenerated++;
            });
        }
        
        this.savePlayersData();
    }
    
    generateYoungPlayer(clubId) {
        // Generar ID único
        const maxId = this.getMaxPlayerId() + 1;
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const config = obtenerConfigLiga(clubId);
        
        // Jugadores jóvenes (16-22 años) con potencial
        const edad = 16 + Math.floor(Math.random() * 7);
        const general = rand(config.generalMin, config.generalMax);
        const potencial = rand(Math.max(general, config.generalMin + 5), Math.min(95, config.generalMax + 10));
        const valor = calcularValorPorHabilidad(general, potencial, config);
        const sueldo = calcularSueldoPorValor(valor, config);
        
        // Generar fecha de nacimiento aleatoria
        const birthdayMonth = rand(1, 12); // Mes de 1 a 12
        const birthdayDay = rand(1, new Date(2025, birthdayMonth, 0).getDate()); // Día válido para el mes
        
        return {
            id: maxId,
            clubId: clubId,
            nombre: `${nombre} ${apellido}`,
            edad: edad,
            birthdayMonth: birthdayMonth,
            birthdayDay: birthdayDay,
            posicion: posiciones[Math.floor(Math.random() * posiciones.length)],
            general: general,
            potencial: potencial,
            sprint: rand(50, 95),
            regate: rand(50, 95),
            pase: rand(50, 95),
            tiro: rand(50, 95),
            defensa: rand(40, 90),
            resistencia: rand(60, 95),
            valor: valor,
            sueldo: sueldo
        };
    }
    
    getMaxPlayerId() {
        let maxId = 0;
        Object.values(jugadoresPorClub).forEach(jugadores => {
            jugadores.forEach(jugador => {
                if (jugador.id > maxId) maxId = jugador.id;
            });
        });
        return maxId;
    }
    
    getClubName(clubId) {
        // Intentar obtener el nombre del club desde el sistema de clubes
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    }
    
    savePlayersData() {
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
    }
    
    updatePlayersStats() {
        const statsElement = document.getElementById('players-stats');
        if (!statsElement) return;
        
        let totalPlayers = 0;
        let totalClubs = 0;
        let avgAge = 0;
        let ageSum = 0;
        
        Object.keys(jugadoresPorClub).forEach(clubId => {
            const jugadoresClub = jugadoresPorClub[clubId];
            totalPlayers += jugadoresClub.length;
            totalClubs++;
            
            jugadoresClub.forEach(jugador => {
                ageSum += jugador.edad;
            });
        });
        
        avgAge = totalPlayers > 0 ? (ageSum / totalPlayers).toFixed(1) : 0;
        
        statsElement.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">👥 Total Jugadores:</span>
                    <span class="stat-value">${totalPlayers}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">🏟️ Clubes:</span>
                    <span class="stat-value">${totalClubs}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">📊 Edad Promedio:</span>
                    <span class="stat-value">${avgAge} años</span>
                </div>
            </div>
        `;
    }
    
    logBirthdaysAndRetirements(birthdayPlayers, retiredPlayers, date) {
        const logElement = document.getElementById('retirement-log');
        if (!logElement) return;
        
        const currentDateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        let logHTML = `<p class="retirement-summary">📅 ${currentDateStr}: `;
        
        if (birthdayPlayers.length > 0) {
            logHTML += `${birthdayPlayers.length} jugador(es) cumplen años`;
        }
        
        if (retiredPlayers.length > 0) {
            logHTML += `, ${retiredPlayers.length} se retiraron`;
        }
        
        logHTML += `</p>`;
        
        if (birthdayPlayers.length > 0) {
            logHTML += '<ul class="birthday-list">';
            birthdayPlayers.forEach(player => {
                logHTML += `<li>🎂 ${player.nombre} ahora tiene ${player.edad} años - ${player.club}</li>`;
            });
            logHTML += '</ul>';
        }
        
        if (retiredPlayers.length > 0) {
            logHTML += '<ul class="retirement-list">';
            retiredPlayers.forEach(player => {
                logHTML += `<li>👴 ${player.nombre} (${player.edad} años, ${player.posicion}, GEN: ${player.general}) - ${player.club}</li>`;
            });
            logHTML += '</ul>';
        }
        
        logElement.innerHTML = logHTML;
    }
    
    clearRetirementLog() {
        const logElement = document.getElementById('retirement-log');
        if (logElement) {
            logElement.innerHTML = '';
        }
    }
}

// Cargar datos al iniciar
window.addEventListener("DOMContentLoaded", () => {
    // Verificar si ya se generaron jugadores previamente
    const yaGenerados = localStorage.getItem("jugadoresGenerados");
    
    if (yaGenerados === "true") {
        // Si ya se generaron, redirigir directamente al menú
        window.location.href = "menu.html";
        return;
    }
    
    // Verificar si ya existen jugadores guardados
    const jugadoresExistentes = localStorage.getItem("jugadoresPorClub");
    
    if (jugadoresExistentes) {
        jugadoresPorClub = JSON.parse(jugadoresExistentes);
        
        // Mostrar jugadores del club seleccionado o todos
        const clubSeleccionado = localStorage.getItem("selectedClub");
        if (clubSeleccionado && typeof clubes !== 'undefined') {
            const clubId = clubes.find(c => c.nombre === clubSeleccionado)?.id;
            if (clubId && jugadoresPorClub[clubId]) {
                jugadores = jugadoresPorClub[clubId];
            }
        } else {
            // Mostrar todos los jugadores
            jugadores = [];
            Object.values(jugadoresPorClub).forEach(clubJugadores => {
                jugadores = jugadores.concat(clubJugadores);
            });
        }
        
        if (jugadores.length > 0) {
            mostrarEstadisticas();
            mostrar();
            // Marcar como guardado si ya hay jugadores
            actualizarEstadoGuardado(true);
        }
    } else {
        // Si no hay jugadores, el botón continuar debe estar deshabilitado
        actualizarEstadoGuardado(false);
    }
    
    // Inicializar el calendario
    new AutoCalendar();
});
