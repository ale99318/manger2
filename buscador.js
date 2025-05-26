function buscarJugador() {
  const nombre = document.getElementById("nombreJugador").value.trim().replace(/ /g, "_");
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${nombre}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById("resultado");
      contenedor.innerHTML = "";

      if (data.player) {
        const jugador = data.player[0];
        contenedor.innerHTML = `
          <h2>${jugador.strPlayer}</h2>
          <p><strong>Nacionalidad:</strong> ${jugador.strNationality}</p>
          <p><strong>Equipo:</strong> ${jugador.strTeam}</p>
          <p><strong>Posición:</strong> ${jugador.strPosition}</p>
          ${jugador.strCutout ? `<img src="${jugador.strCutout}" alt="Imagen del jugador">` : ""}
        `;
      } else {
        contenedor.textContent = "Jugador no encontrado.";
      }
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("resultado").textContent = "Error al buscar jugador.";
    });
}
