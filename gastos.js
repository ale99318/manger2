// Variables globales
let selectedClub = '';
let jugadores = [];
let finanzas = {
    saldo: 100000000, // Saldo inicial de 100M
    fichajes: [],
    ventas: [],
    salarios: []
};

// Al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    inicializarDatos();
    cargarDatos();
    mostrarDatos();
});

// Inicializar datos básicos
function inicializarDatos() {
    selectedClub = localStorage.getItem("selectedClub") || "Mi Club";
    jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    
    // Inicializar finanzas si no existen
    const finanzasGuardadas = localStorage.getItem("finanzasClub");
    if (finanzasGuardadas) {
        finanzas = JSON.parse(finanzasGuardadas);
    } else {
        // Crear finanzas iniciales
        finanzas = {
            saldo: 100000000, // 100 millones inicial
            fichajes: [],
            ventas: [],
            salarios: []
        };
        guardarFinanzas();
    }
    
    document.getElementById("nombre-club").textContent = selectedClub;
}

// Cargar y procesar datos de fichajes y ventas
function cargarDatos() {
    procesarFichajes();
    procesarVentas();
    calcularSalarios();
}

// Procesar fichajes del historial
function procesarFichajes() {
    const historialFichajes = JSON.parse(localStorage.getItem('historialFichajes') || '[]');
    const fichajesDelClub = historialFichajes.filter(fichaje => fichaje.club === selectedClub);
    
    // Limpiar fichajes anteriores del club actual
    finanzas.fichajes = finanzas.fichajes.filter(f => f.club !== selectedClub);
    
    fichajesDelClub.forEach(fichaje => {
        // Estimar costo del fichaje basado en las estadísticas del jugador
        const costoEstimado = estimarCostoFichaje(fichaje.estadisticas);
        
        const fichajeFinanciero = {
            id: Date.now() + Math.random(),
            jugador: fichaje.jugador,
            club: fichaje.club,
            fecha: fichaje.fecha,
            costo: costoEstimado,
            salarioSemanal: fichaje.contrato.salarioSemanal,
            años: fichaje.contrato.anos,
            tipo: 'fichaje'
        };
        
        // Verificar si ya existe para evitar duplicados
        const existeFichaje = finanzas.fichajes.find(f => 
            f.jugador === fichaje.jugador && f.club === fichaje.club
        );
        
        if (!existeFichaje) {
            finanzas.fichajes.push(fichajeFinanciero);
            finanzas.saldo -= costoEstimado; // Restar del saldo
        }
    });
}

// Procesar ventas realizadas
function procesarVentas() {
    const historialTransferencias = JSON.parse(localStorage.getItem('historialTransferencias') || '[]');
    const ventasDelClub = historialTransferencias.filter(venta => 
        venta.clubVendedor === selectedClub
    );
    
    // Limpiar ventas anteriores del club actual
    finanzas.ventas = finanzas.ventas.filter(v => v.clubVendedor !== selectedClub);
    
    ventasDelClub.forEach(venta => {
        const ventaFinanciera = {
            id: Date.now() + Math.random(),
            jugador: venta.jugador,
            clubVendedor: venta.clubVendedor,
            clubComprador: venta.clubComprador,
            fecha: venta.fecha,
            precio: venta.precio,
            tipo: 'venta'
        };
        
        // Verificar si ya existe para evitar duplicados
        const existeVenta = finanzas.ventas.find(v => 
            v.jugador === venta.jugador && v.clubVendedor === venta.clubVendedor
        );
        
        if (!existeVenta) {
            finanzas.ventas.push(ventaFinanciera);
            finanzas.saldo += venta.precio; // Sumar al saldo
        }
    });
}

// Calcular salarios actuales
function calcularSalarios() {
    const jugadoresDelClub = jugadores.filter(jugador => jugador.club === selectedClub);
    
    finanzas.salarios = [];
    
    jugadoresDelClub.forEach(jugador => {
        let salarioSemanal = 0;
        
        if (jugador.contrato && jugador.contrato.salarioSemanal) {
            salarioSemanal = jugador.contrato.salarioSemanal;
        } else {
            // Estimar salario basado en estadísticas si no tiene contrato
            salarioSemanal = estimarSalario(jugador);
        }
        
        finanzas.salarios.push({
            jugador: jugador.nombre,
            posicion: jugador.posicion,
            salarioSemanal: salarioSemanal,
            salarioAnual: salarioSemanal * 52,
            general: jugador.general
        });
    });
}

// Mostrar todos los datos en la interfaz
function mostrarDatos() {
    mostrarSaldo();
    mostrarResumen();
    mostrarFichajes();
    mostrarVentas();
    mostrarSalarios();
    guardarFinanzas();
}

// Mostrar saldo actual
function mostrarSaldo() {
    document.getElementById("saldo-actual").textContent = formatearPrecio(finanzas.saldo);
}

// Mostrar resumen financiero
function mostrarResumen() {
    const totalIngresos = finanzas.ventas.reduce((sum, venta) => sum + venta.precio, 0);
    const totalGastos = finanzas.fichajes.reduce((sum, fichaje) => sum + fichaje.costo, 0);
    const totalSalarios = finanzas.salarios.reduce((sum, salario) => sum + salario.salarioSemanal, 0);
    
    document.getElementById("ingresos-totales").textContent = formatearPrecio(totalIngresos);
    document.getElementById("gastos-totales").textContent = formatearPrecio(totalGastos);
    document.getElementById("salarios-semanales").textContent = formatearPrecio(totalSalarios);
}

// Mostrar lista de fichajes
function mostrarFichajes() {
    const container = document.getElementById("lista-fichajes");
    container.innerHTML = "";
    
    if (finanzas.fichajes.length === 0) {
        container.innerHTML = '<div class="mensaje-vacio">No hay fichajes registrados</div>';
        return;
    }
    
    finanzas.fichajes.forEach(fichaje => {
        const div = document.createElement("div");
        div.classList.add("transaccion-item", "gasto");
        
        const fecha = new Date(fichaje.fecha).toLocaleDateString();
        
        div.innerHTML = `
            <div class="transaccion-info">
                <h4>${fichaje.jugador}</h4>
                <p>Fichado el ${fecha}</p>
                <p>Contrato: ${fichaje.años} años - ${formatearPrecio(fichaje.salarioSemanal)}/sem</p>
            </div>
            <div class="transaccion-monto negativo">-${formatearPrecio(fichaje.costo)}</div>
        `;
        
        container.appendChild(div);
    });
}

// Mostrar lista de ventas
function mostrarVentas() {
    const container = document.getElementById("lista-ventas");
    container.innerHTML = "";
    
    if (finanzas.ventas.length === 0) {
        container.innerHTML = '<div class="mensaje-vacio">No hay ventas registradas</div>';
        return;
    }
    
    finanzas.ventas.forEach(venta => {
        const div = document.createElement("div");
        div.classList.add("transaccion-item", "ingreso");
        
        const fecha = new Date(venta.fecha).toLocaleDateString();
        
        div.innerHTML = `
            <div class="transaccion-info">
                <h4>${venta.jugador}</h4>
                <p>Vendido el ${fecha}</p>
                <p>Comprador: ${venta.clubComprador}</p>
            </div>
            <div class="transaccion-monto positivo">+${formatearPrecio(venta.precio)}</div>
        `;
        
        container.appendChild(div);
    });
}

// Mostrar lista de salarios
function mostrarSalarios() {
    const container = document.getElementById("lista-salarios");
    container.innerHTML = "";
    
    if (finanzas.salarios.length === 0) {
        container.innerHTML = '<div class="mensaje-vacio">No hay jugadores con salarios registrados</div>';
        return;
    }
    
    // Ordenar por salario descendente
    finanzas.salarios.sort((a, b) => b.salarioSemanal - a.salarioSemanal);
    
    finanzas.salarios.forEach(salario => {
        const div = document.createElement("div");
        div.classList.add("transaccion-item", "gasto");
        
        div.innerHTML = `
            <div class="transaccion-info">
                <h4>${salario.jugador}</h4>
                <p>Posición: ${salario.posicion}</p>
                <p>General: ${salario.general} - Salario Anual: ${formatearPrecio(salario.salarioAnual)}</p>
            </div>
            <div class="transaccion-monto negativo">${formatearPrecio(salario.salarioSemanal)}/sem</div>
        `;
        
        container.appendChild(div);
    });
}

// Funciones auxiliares
function estimarCostoFichaje(estadisticas) {
    const base = estadisticas.general * 1000000; // 1M por punto de general
    const factorEdad = estadisticas.edad < 25 ? 1.5 : estadisticas.edad > 30 ? 0.7 : 1;
    const factorPotencial = estadisticas.potencial ? (estadisticas.potencial / 100) : 1;
    
    return Math.round(base * factorEdad * factorPotencial);
}

function estimarSalario(jugador) {
    const salarioBase = jugador.general * 5000; // 5K por punto de general
    const factorEdad = jugador.edad < 25 ? 1.2 : jugador.edad > 32 ? 0.8 : 1;
    
    return Math.round(salarioBase * factorEdad);
}

function formatearPrecio(precio) {
    if (precio >= 1000000) {
        return `$${(precio / 1000000).toFixed(1)}M`;
    } else if (precio >= 1000) {
        return `$${(precio / 1000).toFixed(0)}K`;
    } else {
        return `$${precio.toLocaleString()}`;
    }
}

function guardarFinanzas() {
    localStorage.setItem("finanzasClub", JSON.stringify(finanzas));
}

// Funciones de interfaz
function mostrarTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');
}

// Modal para ajustar saldo
function mostrarModalSaldo() {
    document.getElementById("modal-saldo").style.display = "block";
    document.getElementById("nuevo-saldo").value = finanzas.saldo;
}

function cerrarModal() {
    document.getElementById("modal-saldo").style.display = "none";
}

function confirmarSaldo() {
    const nuevoSaldo = parseFloat(document.getElementById("nuevo-saldo").value);
    
    if (isNaN(nuevoSaldo) || nuevoSaldo < 0) {
        alert("Por favor ingrese un saldo válido");
        return;
    }
    
    finanzas.saldo = nuevoSaldo;
    guardarFinanzas();
    mostrarSaldo();
    cerrarModal();
    alert("Saldo actualizado correctamente");
}

// Event listeners
document.getElementById("btn-ajustar-saldo").addEventListener("click", mostrarModalSaldo);
document.querySelector(".close").addEventListener("click", cerrarModal);

window.addEventListener("click", function(event) {
    const modal = document.getElementById("modal-saldo");
    if (event.target === modal) {
        cerrarModal();
    }
});

// Funciones de navegación y reseteo
function resetearFinanzas() {
    if (confirm("¿Estás seguro de que deseas resetear todas las finanzas? Esto establecerá el saldo en $100M y borrará todo el historial financiero.")) {
        finanzas = {
            saldo: 100000000,
            fichajes: [],
            ventas: [],
            salarios: []
        };
        
        guardarFinanzas();
        mostrarDatos();
        alert("Finanzas reseteadas correctamente");
    }
}

function volverAlClub() {
    window.location.href = "club.html";
}
