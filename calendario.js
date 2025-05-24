function avanzarDia() {
    const fechaActual = obtenerFechaJuego();
    fechaActual.setDate(fechaActual.getDate() + 1);
    guardarFechaJuego(fechaActual);
    actualizarInterfazFecha();
    verificarEdadYRetiro();
    verificarContratos();
}

function obtenerFechaJuego() {
    const fechaGuardada = localStorage.getItem("fechaJuego");
    return fechaGuardada ? new Date(fechaGuardada) : new Date("2025-01-01");
}

function guardarFechaJuego(fecha) {
    localStorage.setItem("fechaJuego", fecha.toISOString());
}

function actualizarInterfazFecha() {
    const fecha = obtenerFechaJuego();
    document.getElementById("fechaActual").textContent = fecha.toDateString();
}

function verificarEdadYRetiro() {
    let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const fechaActual = obtenerFechaJuego();
    let jugadoresRetirados = [];

    jugadores.forEach(jugador => {
        if (jugador.retirado) return;

        const edad = calcularEdad(jugador.fechaNacimiento, fechaActual);
        if (edad >= 40) {
            jugador.retirado = true;
            jugadoresRetirados.push(jugador.nombre);
            console.log(`🏁 ${jugador.nombre} se ha retirado a los ${edad} años.`);
        }
    });

    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    actualizarListaJugadores();

    if (jugadoresRetirados.length > 0) {
        alert("Se han retirado los siguientes jugadores: " + jugadoresRetirados.join(", "));
    }
}

function verificarContratos() {
    let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const fechaActual = obtenerFechaJuego();

    let contratosVencidos = [];
    let contratosPorVencer = [];
    let contratosActivos = 0;
    let contratosSinFecha = 0;

    console.log("📋 Verificando contratos...");

    jugadores.forEach(jugador => {
        if (jugador.retirado) return;

        if (jugador.contrato && jugador.contrato.fechaVencimiento) {
            const fechaVencimiento = new Date(jugador.contrato.fechaVencimiento);
            const diasParaVencer = Math.ceil((fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24));

            if (diasParaVencer < 0) {
                contratosVencidos.push({
                    jugador: jugador,
                    diasVencido: Math.abs(diasParaVencer)
                });
                console.log(`⚠️ Contrato vencido: ${jugador.nombre}`);
            } else if (diasParaVencer <= 30) {
                contratosPorVencer.push({
                    jugador: jugador,
                    diasRestantes: diasParaVencer
                });
                contratosActivos++;
            } else {
                contratosActivos++;
            }
        } else if (typeof jugador.contrato === 'number') {
            const fechaInicio = new Date("2025-01-01");
            const fechaVencimiento = new Date(fechaInicio);
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + jugador.contrato);

            const diasParaVencer = Math.ceil((fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24));

            if (diasParaVencer < 0) {
                contratosVencidos.push({
                    jugador: jugador,
                    diasVencido: Math.abs(diasParaVencer)
                });
                console.log(`⚠️ Contrato vencido (antiguo): ${jugador.nombre}`);
            } else if (diasParaVencer <= 30) {
                contratosPorVencer.push({
                    jugador: jugador,
                    diasRestantes: diasParaVencer
                });
                contratosActivos++;
            } else {
                contratosActivos++;
            }
        } else if (jugador.contrato) {
            contratosSinFecha++;
        }
    });

    actualizarInfoContratos(contratosActivos, contratosSinFecha, jugadores.length);
    mostrarContratosVencidos(contratosVencidos);
    mostrarContratosPorVencer(contratosPorVencer);
}

function calcularEdad(fechaNacimiento, fechaActual) {
    const nacimiento = new Date(fechaNacimiento);
    let edad = fechaActual.getFullYear() - nacimiento.getFullYear();
    const mes = fechaActual.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function actualizarInfoContratos(activos, sinFecha, total) {
    document.getElementById("contratosActivos").textContent = activos;
    document.getElementById("contratosSinFecha").textContent = sinFecha;
    document.getElementById("totalJugadores").textContent = total;
}

function mostrarContratosVencidos(lista) {
    const contenedor = document.getElementById("contratosVencidos");
    contenedor.innerHTML = "";
    lista.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.jugador.nombre} (vencido hace ${item.diasVencido} días)`;
        contenedor.appendChild(li);
    });
}

function mostrarContratosPorVencer(lista) {
    const contenedor = document.getElementById("contratosPorVencer");
    contenedor.innerHTML = "";
    lista.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.jugador.nombre} (vence en ${item.diasRestantes} días)`;
        contenedor.appendChild(li);
    });
}

function actualizarListaJugadores() {
    // Esto deberías tenerlo implementado para refrescar tu lista en pantalla.
}
