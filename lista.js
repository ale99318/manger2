function mostrarClubes(clubes) {
  // Buscamos el elemento <ul id="lista-clubes"> del HTML
  const lista = document.getElementById("lista-clubes");
  // Limpiamos el contenido anterior (por si ya había algo)
  lista.innerHTML = "";
  // Recorremos cada club del array "clubes"
  clubes.forEach(club => {
    // Creamos un nuevo elemento <li> (un ítem de lista)
    const li = document.createElement("li");
    // Le ponemos como texto el nombre del club
    li.textContent = club.nombre;
    // Agregamos el <li> dentro del <ul>
    lista.appendChild(li);
    
    // Mostramos en consola el ID y nombre de cada club
    console.log("ID:", club.id);
    console.log("Nombre:", club.nombre);
  });
}
// Ejecutamos la función pasándole el array "clubes"
mostrarClubes(clubes);
// Aquí guardamos el array para usarlo en otro archivo o página
localStorage.setItem("clubes", JSON.stringify(clubes));
