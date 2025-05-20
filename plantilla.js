// Obtenemos el club seleccionado (por ejemplo, desde localStorage)
const clubSeleccionado = localStorage.getItem('selectedClub') || "Alianza Lima";

// Buscamos los datos del club
const club = clubes.find(c => c.nombre === clubSeleccionado);

// Mostramos información del club
document.getElementById('nombre-club').textContent = club.nombre;
document.getElementById('info-club').innerHTML = `
  <strong>Presupuesto:</strong> $${club.presupuesto.toLocaleString()}<br>
  <strong>Clásico:</strong> ${club.clasico}<br>
  <strong>Estadio:</strong> ${club.estadio}<br>
  <strong>Ciudad:</strong> ${club.ciudad}
`;

// Filtramos los jugadores que pertenecen a este club
const jugadoresDelClub = jugadores.filter(j => j.club === club.nombre);

// Creamos dinámicamente las tarjetas de jugador
const contenedor = document.getElementById('jugadores-container');

jugadoresDelClub.forEach(jugador => {
  const div = document.createElement('div');
  div.className = 'jugador';

  div.innerHTML = `
    <h3>${jugador.nombre}</h3>
    <p><strong>Posición:</strong> ${jugador.posicion}</p>
    <p><strong>General:</strong> ${jugador.general}</p>
    <p><strong>Valor:</strong> $${jugador.valor.toLocaleString()}</p>
    <p><strong>Contrato:</strong> ${jugador.contrato} meses</p>
  `;

  contenedor.appendChild(div);
});
