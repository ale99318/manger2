// Al cargar la página
document.addEventListener("DOMContentLoaded", function() { 
    // Primero debemos asegurarnos de que los jugadores del archivo .txt
    // estén guardados en localStorage (esto es lo que faltaba en tu código)
    if (!localStorage.getItem("jugadores") && typeof window.jugadores !== 'undefined') {
        localStorage.setItem("jugadores", JSON.stringify(window.jugadores));
        console.log("Jugadores inicializados en localStorage");
    }

    // Obtener el nombre del club guardado en localStorage
    const selectedClub = localStorage.getItem("selectedClub");
    
    // Validar si hay club seleccionado
    if (!selectedClub) {
        alert("No hay club seleccionado.");
        // Opcional: redirigir o detener ejecución
        return;
    }
    
    // Mostrar el nombre del club
    document.getElementById("nombre-club").textContent = selectedClub;
    
    // Obtener la lista de jugadores
    let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    
    // **NUEVA FUNCIONALIDAD: Procesar contratos firmados**
    procesarContratosFirmados(jugadores, selectedClub);
    
    // Obtener jugadores vendidos y cedidos
    let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
    let jugadoresCedidos = JSON.parse(localStorage.getItem("jugadoresCedidos") || "[]");
    
    // Filtrar jugadores del club que no están vendidos ni cedidos
    const jugadoresDelClub = jugadores.filter(jugador => 
        jugador.club === selectedClub && 
        !jugadoresVendidos.includes(jugador.nombre) &&
        !jugadoresCedidos.some(cedido => cedido.nombre === jugador.nombre)
    );
    
    // Crear botón de resetear ventas
    const botonResetear = document.createElement("button");
    botonResetear.textContent = "Resetear Transferencias";
    botonResetear.classList.add("btn-reset");
    botonResetear.onclick = resetearTransferencias;
    document.querySelector(".seccion-club").appendChild(botonResetear);
    
    // Contenedor para mostrar info del club
    const contenedor = document.getElementById("info-club");
    contenedor.innerHTML = "";
    
    // **NUEVA SECCIÓN: Mostrar nuevos fichajes**
    mostrarNuevosFichajes(contenedor, selectedClub);
    
    // Título jugadores disponibles
    const tituloDisponibles = document.createElement("h2");
    tituloDisponibles.textContent = "Jugadores Disponibles";
    contenedor.appendChild(tituloDisponibles);
    
    // Agregar jugadores disponibles
    jugadoresDelClub.forEach(jugador => {
        const div = document.createElement("div");
        div.classList.add("jugador-item");
        
        // **MODIFICACIÓN: Marcar nuevos fichajes**
        if (jugador.nuevoFichaje) {
            div.classList.add("nuevo-fichaje");
        }
        
        // Información del jugador
        const infoJugador = document.createElement("div");
        infoJugador.classList.add("info-jugador");
        
        // **MODIFICACIÓN: Mostrar información del contrato si es nuevo fichaje**
        let infoContrato = '';
        if (jugador.contrato) {
            infoContrato = `
                <div class="info-contrato">
                    <small>Contrato: ${jugador.contrato.anos} años - ${formatearPrecio(jugador.contrato.salarioSemanal)}/sem</small>
                </div>
            `;
        }
        
        infoJugador.innerHTML = `
            <strong>${jugador.nombre}</strong> - ${jugador.posicion} (${jugador.edad} años)
            ${jugador.nuevoFichaje ? '<span class="badge-nuevo">¡NUEVO!</span>' : ''}
            <div class="stats">
                <span>General: ${jugador.general}</span>
                <span>Valor: $${(jugador.valor/1000000).toFixed(1)}M</span>
            </div>
            ${infoContrato}
        `;
        div.appendChild(infoJugador);
        
        // Botón de venta
        const botonVender = document.createElement("button");
        botonVender.textContent = "Poner en venta";
        botonVender.classList.add("btn-vender");
        botonVender.onclick = () => ponerEnVenta(jugador);
        div.appendChild(botonVender);
        
        // Botón de préstamo
        const botonPrestar = document.createElement("button");
        botonPrestar.textContent = "Prestar jugador";
        botonPrestar.classList.add("btn-prestar");
        botonPrestar.onclick = () => prestarJugador(jugador);
        div.appendChild(botonPrestar);
        
        contenedor.appendChild(div);
    });
    
    // Mostrar jugadores cedidos si hay
    const jugadoresCedidosDelClub = jugadoresCedidos.filter(cedido => {
        const jugadorCompleto = jugadores.find(j => j.nombre === cedido.nombre);
        return jugadorCompleto && jugadorCompleto.club === selectedClub;
    });
    
    if (jugadoresCedidosDelClub.length > 0) {
        const tituloCedidos = document.createElement("h2");
        tituloCedidos.textContent = "Jugadores Cedidos";
        tituloCedidos.style.marginTop = "20px";
        contenedor.appendChild(tituloCedidos);
        
        jugadoresCedidosDelClub.forEach(cedido => {
            const div = document.createElement("div");
            div.classList.add("jugador-cedido");
            div.textContent = `${cedido.nombre} (Cedido al ${cedido.club} hasta ${cedido.finPrestamo})`;
            contenedor.appendChild(div);
        });
    }
});

// **NUEVA FUNCIÓN: Procesar contratos firmados**
function procesarContratosFirmados(jugadores, selectedClub) {
    const contratoFirmado = localStorage.getItem('contratoFirmado');
    
    if (contratoFirmado) {
        try {
            const contrato = JSON.parse(contratoFirmado);
            const jugadorContratado = contrato.jugador;
            
            console.log('Procesando contrato firmado:', jugadorContratado.nombre);
            
            // Verificar si el jugador ya existe en la lista
            const jugadorExistente = jugadores.find(j => j.nombre === jugadorContratado.nombre);
            
            if (!jugadorExistente) {
                // Crear nuevo jugador con toda la información del contrato
                const nuevoJugador = {
                    ...jugadorContratado,
                    id: jugadores.length + 1, // Asignar nuevo ID
                    club: selectedClub, // Asignar al club actual
                    nuevoFichaje: true, // Marcar como nuevo fichaje
                    fechaContratacion: new Date().toISOString(),
                    contrato: {
                        anos: contrato.anos,
                        salarioSemanal: contrato.salarioSemanal,
                        salarioAnual: contrato.salarioSemanal * 52,
                        bonusGol: contrato.bonusGol || 0,
                        bonusPorteriaLimpia: contrato.bonusPorteriaLimpia || 0,
                        bonusGoleador: contrato.bonusGoleador || 0,
                        fechaFirma: contrato.fechaFirma,
                        fechaVencimiento: calcularFechaVencimiento(contrato.fechaFirma, contrato.anos)
                    }
                };
                
                // Agregar el jugador a la lista
                jugadores.push(nuevoJugador);
                
                // Guardar la lista actualizada
                localStorage.setItem("jugadores", JSON.stringify(jugadores));
                
                // Guardar historial de fichajes
                guardarHistorialFichaje(nuevoJugador, contrato);
                
                console.log('Nuevo jugador agregado a la plantilla:', nuevoJugador.nombre);
            } else if (jugadorExistente.club !== selectedClub) {
                // Si el jugador existe pero está en otro club, transferirlo
                jugadorExistente.club = selectedClub;
                jugadorExistente.nuevoFichaje = true;
                jugadorExistente.fechaContratacion = new Date().toISOString();
                jugadorExistente.contrato = {
                    anos: contrato.anos,
                    salarioSemanal: contrato.salarioSemanal,
                    salarioAnual: contrato.salarioSemanal * 52,
                    bonusGol: contrato.bonusGol || 0,
                    bonusPorteriaLimpia: contrato.bonusPorteriaLimpia || 0,
                    bonusGoleador: contrato.bonusGoleador || 0,
                    fechaFirma: contrato.fechaFirma,
                    fechaVencimiento: calcularFechaVencimiento(contrato.fechaFirma, contrato.anos)
                };
                
                localStorage.setItem("jugadores", JSON.stringify(jugadores));
                guardarHistorialFichaje(jugadorExistente, contrato);
                
                console.log('Jugador transferido al club:', jugadorExistente.nombre);
            }
            
            // Limpiar el contrato procesado
            localStorage.removeItem('contratoFirmado');
            
        } catch (error) {
            console.error('Error procesando contrato firmado:', error);
            localStorage.removeItem('contratoFirmado'); // Limpiar dato corrupto
        }
    }
}

// **NUEVA FUNCIÓN: Mostrar sección de nuevos fichajes**
function mostrarNuevosFichajes(contenedor, selectedClub) {
    const historialFichajes = JSON.parse(localStorage.getItem('historialFichajes') || '[]');
    const fichajesRecientes = historialFichajes
        .filter(fichaje => fichaje.club === selectedClub)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3); // Mostrar últimos 3 fichajes
    
    if (fichajesRecientes.length > 0) {
        const tituloFichajes = document.createElement("h2");
        tituloFichajes.textContent = "Últimos Fichajes";
        tituloFichajes.style.color = "#4CAF50";
        contenedor.appendChild(tituloFichajes);
        
        const contenedorFichajes = document.createElement("div");
        contenedorFichajes.classList.add("fichajes-recientes");
        
        fichajesRecientes.forEach(fichaje => {
            const div = document.createElement("div");
            div.classList.add("fichaje-item");
            
            const fechaFichaje = new Date(fichaje.fecha).toLocaleDateString();
            div.innerHTML = `
                <div class="fichaje-info">
                    <strong>${fichaje.jugador}</strong> - ${fichaje.posicion}
                    <div class="fichaje-detalles">
                        <span>Fichado el ${fechaFichaje}</span>
                        <span>Contrato: ${fichaje.contrato.anos} años</span>
                        <span>Salario: ${formatearPrecio(fichaje.contrato.salarioSemanal)}/sem</span>
                    </div>
                </div>
            `;
            
            contenedorFichajes.appendChild(div);
        });
        
        contenedor.appendChild(contenedorFichajes);
        
        // Separador
        const separador = document.createElement("hr");
        separador.style.margin = "20px 0";
        contenedor.appendChild(separador);
    }
}

// **NUEVA FUNCIÓN: Calcular fecha de vencimiento del contrato**
function calcularFechaVencimiento(fechaFirma, anos) {
    const fecha = new Date(fechaFirma);
    fecha.setFullYear(fecha.getFullYear() + anos);
    return fecha.toISOString();
}

// **NUEVA FUNCIÓN: Guardar historial de fichajes**
function guardarHistorialFichaje(jugador, contrato) {
    let historial = JSON.parse(localStorage.getItem('historialFichajes') || '[]');
    
    const fichaje = {
        jugador: jugador.nombre,
        posicion: jugador.posicion,
        club: jugador.club,
        fecha: new Date().toISOString(),
        contrato: {
            anos: contrato.anos,
            salarioSemanal: contrato.salarioSemanal,
            salarioAnual: contrato.salarioSemanal * 52
        },
        estadisticas: {
            general: jugador.general,
            potencial: jugador.potencial,
            edad: jugador.edad
        }
    };
    
    historial.unshift(fichaje); // Agregar al inicio
    
    // Mantener solo los últimos 20 fichajes
    if (historial.length > 20) {
        historial = historial.slice(0, 20);
    }
    
    localStorage.setItem('historialFichajes', JSON.stringify(historial));
}

// **NUEVA FUNCIÓN: Formatear precios**
function formatearPrecio(precio) {
    if (precio >= 1000000) {
        return `$${(precio / 1000000).toFixed(1)}M`;
    } else if (precio >= 1000) {
        return `$${(precio / 1000).toFixed(0)}K`;
    } else {
        return `$${precio}`;
    }
}

// **FUNCIÓN MODIFICADA: Agregar limpieza de fichajes al resetear**
function resetearTransferencias() {
    if (confirm("¿Estás seguro de que deseas resetear todas las transferencias y fichajes?")) {
        localStorage.removeItem("jugadoresVendidos");
        localStorage.removeItem("jugadoresCedidos");
        localStorage.removeItem("historialTransferencias");
        localStorage.removeItem("historialFichajes"); // **NUEVO**
        localStorage.removeItem("contratoFirmado"); // **NUEVO**
        
        // Obtener y actualizar jugadores
        const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        jugadores.forEach(jugador => {
            jugador.enVenta = false;
            // **NUEVO: Limpiar marcas de nuevo fichaje**
            if (jugador.nuevoFichaje) {
                delete jugador.nuevoFichaje;
                delete jugador.fechaContratacion;
                delete jugador.contrato;
            }
        });
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        
        alert("Transferencias y fichajes reseteados correctamente");
        location.reload();
    }
}

// Función para poner en venta a un jugador
function ponerEnVenta(jugador) {
    // Obtener lista completa de jugadores
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    
    // Encontrar y marcar el jugador en venta
    const jugadorIndex = jugadores.findIndex(j => j.id === jugador.id);
    if (jugadorIndex !== -1) {
        jugadores[jugadorIndex].enVenta = true;
        
        // Guardar jugador seleccionado y lista de jugadores
        localStorage.setItem("jugadorEnTransferencia", jugador.nombre);
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        
        // Redirigir a ofertas.html
        window.location.href = "ventas.html";
    }
}

// Función para prestar un jugador
function prestarJugador(jugador) {
    // Guardar jugador seleccionado para préstamo
    localStorage.setItem("jugadorEnPrestamo", jugador.nombre);
    
    // Redirigir a página de préstamos
    window.location.href = "prestamos.html";
}
