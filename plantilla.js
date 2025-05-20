// Obtenemos el club seleccionado (por ejemplo, desde localStorage)
const clubSeleccionado = localStorage.getItem('selectedClub') || "Alianza Lima";

// Buscamos los datos del club
const club = clubes.find(c => c.nombre === clubSeleccionado);

// Mostramos información del club
document.getElementById('nombre-club').textContent = club.nombre;
document.getElementById('info-club').innerHTML = `
  <strong>Presupuesto:</strong> ${club.presupuesto.toLocaleString()}<br>
  <strong>Clásico:</strong> ${club.clasico}<br>
  <strong>Estadio:</strong> ${club.estadio}<br>
  <strong>Ciudad:</strong> ${club.ciudad}
`;

// Filtramos los jugadores que pertenecen a este club
const jugadoresDelClub = jugadores.filter(j => j.club === club.nombre);

// Creamos dinámicamente las tarjetas de jugador
const contenedor = document.getElementById('jugadores-container');
jugadoresDelClub.forEach(jugador => {
  // Obtenemos estadísticas del jugador (si existen)
  const stats = window.estadisticas[jugador.id] || {};
  
  // Valores por defecto si no hay estadísticas
  const cansancio = stats.cansancio || 0;
  const estadoAnimo = stats.estado_animo || "normal";
  const lesionado = stats.lesionado !== undefined ? stats.lesionado : false;
  
  // Creamos la tarjeta del jugador con la información solicitada
  const div = document.createElement('div');
  div.className = 'jugador';
  
  // Estado de lesión como texto simple
  const estadoLesion = lesionado ? "Lesionado" : "Disponible";
  
  div.innerHTML = `
    <h3>${jugador.nombre}</h3>
    <p><strong>Posición:</strong> ${jugador.posicion}</p>
    <p><strong>General:</strong> ${jugador.general}</p>
    <p><strong>Valor:</strong> ${jugador.valor.toLocaleString()}</p>
    <p><strong>Sueldo:</strong> ${jugador.sueldo ? jugador.sueldo.toLocaleString() : "N/A"}</p>
    <p><strong>Contrato:</strong> ${jugador.contrato} meses</p>
    <p><strong>Cansancio:</strong> ${cansancio}/20</p>
    <p><strong>Estado de ánimo:</strong> ${estadoAnimo}</p>
    <p><strong>Personalidad:</strong> ${jugador.personalidad || "N/A"}</p>
    <p><strong>Estado:</strong> ${estadoLesion}</p>
  `;
  
  contenedor.appendChild(div);
});

document.head.appendChild(estilos);
