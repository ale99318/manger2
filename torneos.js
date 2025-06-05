function separarPorTorneos(clubes) {
  // Definimos los rangos de cada torneo
  const torneos = {
    peru: { inicio: "51-1", fin: "51-18", lista: "lista-peru" },
    argentina: { inicio: "54-1", fin: "54-28", lista: "lista-argentina" },
    venezuela: { inicio: "58-1", fin: "58-14", lista: "lista-venezuela" },
    colombia: { inicio: "57-1", fin: "57-20", lista: "lista-colombia" },
    paraguay: { inicio: "595-2", fin: "595-12", lista: "lista-paraguay" },
    chile: { inicio: "56-1", fin: "56-16", lista: "lista-chile" },
    bolivia: { inicio: "591-1", fin: "591-16", lista: "lista-bolivia" },
    brasil: { inicio: "55-1", fin: "55-20", lista: "lista-brasil" },
    ecuador: { inicio: "593-1", fin: "593-16", lista: "lista-ecuador" },
    uruguay: { inicio: "598-1", fin: "598-16", lista: "lista-uruguay" }
  };

  // Función para extraer el número del ID (ejemplo: "51-5" -> [51, 5])
  function parseId(id) {
    const partes = id.split('-');
    return [parseInt(partes[0]), parseInt(partes[1])];
  }

  // Función para verificar si un ID está en el rango del torneo
  function estaEnRango(id, inicio, fin) {
    const [idPrefijo, idNumero] = parseId(id);
    const [inicioPrefijo, inicioNumero] = parseId(inicio);
    const [finPrefijo, finNumero] = parseId(fin);
    
    return idPrefijo === inicioPrefijo && 
           idNumero >= inicioNumero && 
           idNumero <= finNumero;
  }

  // Obtener el club seleccionado desde localStorage
  const clubSeleccionadoId = localStorage.getItem("selectedClub");
  let torneoAsignado = null;

  // Recorremos cada torneo
  Object.keys(torneos).forEach(pais => {
    const torneo = torneos[pais];
    const lista = document.getElementById(torneo.lista);
    
    // Limpiamos la lista
    lista.innerHTML = "";
    
    console.log(`\n=== TORNEO ${pais.toUpperCase()} ===`);
    
    // Filtramos los clubes que pertenecen a este torneo
    const clubesDelTorneo = clubes.filter(club => 
      estaEnRango(club.id, torneo.inicio, torneo.fin)
    );
    
    // Agregamos cada club a la lista HTML y mostramos en consola
    clubesDelTorneo.forEach(club => {
      // Crear elemento de lista para HTML
      const li = document.createElement("li");
      li.textContent = club.nombre;
      lista.appendChild(li);
      
      // Mostrar en consola
      console.log("ID:", club.id);
      console.log("Nombre:", club.nombre);
      
      // Verificar si el club seleccionado está en este torneo
      if (club.id === clubSeleccionadoId) {
        torneoAsignado = pais; // Asignar el torneo correspondiente
      }
    });
    
    if (clubesDelTorneo.length === 0) {
      console.log("No se encontraron clubes para este torneo");
    }
  });

  // Retornar el torneo asignado para el club seleccionado
  return torneoAsignado;
}

// Ejecutar la función
const torneoDelClubSeleccionado = separarPorTorneos(clubes);
console.log("Torneo asignado al club seleccionado:", torneoDelClubSeleccionado);
