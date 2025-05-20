// Variables globales
let presupuestoClub = 1000000; // Valor inicial del presupuesto en euros (ajustar según necesidades)
const jugadores = []; // Este array debería contener tus jugadores actuales

// Función para actualizar la visualización del presupuesto en la interfaz
function actualizarPresupuesto() {
    const elementoPresupuesto = document.getElementById('presupuesto-club');
    if (elementoPresupuesto) {
        elementoPresupuesto.textContent = `Presupuesto: ${formatearDinero(presupuestoClub)}`;
    }
}

// Función para formatear cantidades de dinero
function formatearDinero(cantidad) {
    return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(cantidad);
}

// Función para vender un jugador
function venderJugador(id, valor) {
    // Encuentra el elemento del jugador en el DOM
    const jugadorElement = document.getElementById(`jugador-${id}`);
    
    if (jugadorElement) {
        // Aumenta el presupuesto con el valor del jugador
        presupuestoClub += valor;
        
        // Actualiza la visualización del presupuesto
        actualizarPresupuesto();
        
        // Elimina el jugador del DOM con animación
        jugadorElement.style.transition = "opacity 0.5s, transform 0.5s";
        jugadorElement.style.opacity = "0";
        jugadorElement.style.transform = "scale(0.8)";
        
        // Después de la animación, elimina completamente el elemento
        setTimeout(() => {
            jugadorElement.remove();
            
            // También elimina el jugador del array si es necesario
            const index = jugadores.findIndex(jugador => jugador.id === id);
            if (index !== -1) {
                jugadores.splice(index, 1);
            }
            
            // Opcionalmente, guarda el estado actualizado en localStorage
            guardarEstado();
            
            // Muestra una notificación de venta exitosa
            mostrarNotificacion(`Jugador vendido por ${formatearDinero(valor)}`);
        }, 500);
    }
}

// Función para mostrar una notificación temporal
function mostrarNotificacion(mensaje) {
    // Verifica si ya existe una notificación
    let notificacion = document.getElementById('notificacion-venta');
    
    if (!notificacion) {
        // Crea el elemento de notificación si no existe
        notificacion = document.createElement('div');
        notificacion.id = 'notificacion-venta';
        notificacion.style.position = 'fixed';
        notificacion.style.bottom = '20px';
        notificacion.style.right = '20px';
        notificacion.style.padding = '15px 20px';
        notificacion.style.backgroundColor = 'var(--color-accent)';
        notificacion.style.color = 'white';
        notificacion.style.borderRadius = '5px';
        notificacion.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
        notificacion.style.zIndex = '1000';
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateY(20px)';
        notificacion.style.transition = 'opacity 0.3s, transform 0.3s';
        
        document.body.appendChild(notificacion);
    }
    
    // Actualiza el contenido y muestra la notificación
    notificacion.textContent = mensaje;
    
    // Pequeña demora para asegurar que la transición funcione
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateY(0)';
    }, 10);
    
    // Oculta la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateY(20px)';
        
        // Elimina el elemento después de la transición
        setTimeout(() => {
            if (notificacion && notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Función para guardar el estado actual (jugadores y presupuesto)
function guardarEstado() {
    localStorage.setItem('presupuestoClub', presupuestoClub);
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
}

// Función para cargar el estado guardado
function cargarEstado() {
    const presupuestoGuardado = localStorage.getItem('presupuestoClub');
    const jugadoresGuardados = localStorage.getItem('jugadores');
    
    if (presupuestoGuardado) {
        presupuestoClub = parseFloat(presupuestoGuardado);
        actualizarPresupuesto();
    }
    
    if (jugadoresGuardados) {
        // Aquí podrías implementar la lógica para restaurar los jugadores si es necesario
    }
}

// Función para añadir botones de vender a las tarjetas de jugadores existentes
function agregarBotonesVender() {
    const tarjetasJugadores = document.querySelectorAll('.jugador');
    
    tarjetasJugadores.forEach(tarjeta => {
        // Extrae el ID y valor del jugador (ajusta según tu estructura de datos)
        const id = tarjeta.dataset.id || tarjeta.id.replace('jugador-', '');
        
        // Busca el valor del jugador (puedes ajustar esto según dónde guardes esta información)
        let valor = 0;
        const valorElement = tarjeta.querySelector('.valor-jugador');
        if (valorElement) {
            // Extrae solo los números del texto del valor
            valor = parseInt(valorElement.textContent.replace(/[^0-9]/g, ''));
        }
        
        // Añade ID al elemento si no lo tiene
        if (!tarjeta.id) {
            tarjeta.id = `jugador-${id}`;
        }
        
        // Verifica si ya existe un botón de vender
        const headerElement = tarjeta.querySelector('.jugador-header');
        if (headerElement && !headerElement.querySelector('.btn-vender')) {
            // Crear botón de vender
            const btnVender = document.createElement('button');
            btnVender.className = 'btn-vender';
            btnVender.textContent = 'Vender';
            
            // Añadir evento al botón
            btnVender.addEventListener('click', function() {
                venderJugador(id, valor);
            });
            
            // Añadir el botón al header
            headerElement.appendChild(btnVender);
        }
    });
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarEstado();
    agregarBotonesVender();
    
    // Observador para añadir botones a nuevas tarjetas de jugadores que se añadan dinámicamente
    const observador = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                agregarBotonesVender();
            }
        });
    });
    
    // Configuración del observador (observa los cambios en el contenedor de jugadores)
    const contenedorJugadores = document.getElementById('jugadores-container');
    if (contenedorJugadores) {
        observador.observe(contenedorJugadores, { childList: true, subtree: true });
    }
});
