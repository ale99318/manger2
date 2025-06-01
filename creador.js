// Variables globales
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

// Configuración de precios por liga (valores en USD)
const configPorLiga = {
  // Brasil (Liga más fuerte económicamente)
  "55": { 
    valorMin: 25000, valorMax: 180000, 
    sueldoMin: 1800, sueldoMax: 12000 
  },
  // Argentina (Segunda liga más fuerte)
  "54": { 
    valorMin: 18000, valorMax: 150000, 
    sueldoMin: 1200, sueldoMax: 9000 
  },
  // Colombia (Liga competitiva)
  "57": { 
    valorMin: 12000, valorMax: 120000, 
    sueldoMin: 900, sueldoMax: 7500 
  },
  // Chile (Liga estable)
  "56": { 
    valorMin: 10000, valorMax: 100000, 
    sueldoMin: 800, sueldoMax: 6500 
  },
  // Uruguay (Liga tradicional pero pequeña)
  "598": { 
    valorMin: 8000, valorMax: 85000, 
    sueldoMin: 700, sueldoMax: 5500 
  },
  // Ecuador (Liga en crecimiento)
  "593": { 
    valorMin: 7000, valorMax: 75000, 
    sueldoMin: 600, sueldoMax: 4800 
  },
  // Perú (Liga competitiva pero con menos recursos)
  "51": { 
    valorMin: 6000, valorMax: 65000, 
    sueldoMin: 500, sueldoMax: 4200 
  },
  // Paraguay (Liga pequeña)
  "595": { 
    valorMin: 5000, valorMax: 55000, 
    sueldoMin: 450, sueldoMax: 3800 
  },
  // Venezuela (Crisis económica)
  "58": { 
    valorMin: 4000, valorMax: 45000, 
    sueldoMin: 350, sueldoMax: 3000 
  },
  // Bolivia (Liga con menos recursos)
  "591": { 
    valorMin: 3500, valorMax: 40000, 
    sueldoMin: 300, sueldoMax: 2500 
  }
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function obtenerConfigLiga(clubId) {
  const ligaId = clubId.split('-')[0];
  return configPorLiga[ligaId] || configPorLiga["51"]; // Default a Perú si no se encuentra
}

function calcularValorPorHabilidad(general, potencial, config) {
  // Factor base según el rating general
  let factorBase = 1.0;
  if (general >= 85) factorBase = 1.4;
  else if (general >= 80) factorBase = 1.2;
  else if (general >= 75) factorBase = 1.1;
  else if (general >= 70) factorBase = 1.0;
  else if (general >= 65) factorBase = 0.9;
  else factorBase = 0.8;
  
  // Factor potencial
  let factorPotencial = 1.0;
  if (potencial >= 90) factorPotencial = 1.3;
  else if (potencial >= 85) factorPotencial = 1.2;
  else if (potencial >= 80) factorPotencial = 1.1;
  
  const rangoValor = config.valorMax - config.valorMin;
  const valorBase = config.valorMin + (rangoValor * 0.5);
  
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
  
  const general = rand(60, 90);
  const potencial = rand(Math.max(general, 70), 95);
  
  // Calcular valor basado en habilidades y liga
  const valor = calcularValorPorHabilidad(general, potencial, config);
  
  // Calcular sueldo basado en valor
  const sueldo = calcularSueldoPorValor(valor, config);
  
  return {
    id: jugadorId,
    clubId: clubId,
    nombre: `${nombre} ${apellido}`,
    edad: rand(18, 35),
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
});
