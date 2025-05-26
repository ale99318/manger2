import { clubes } from './clubes.js';
import { obtenerClubesDelTorneo } from './torneos.js';
import { ligaPeruana } from './ligaperuana.js';

function inicializarTest() {
    const resultsDiv = document.getElementById('results');
    const torneoInfoDiv = document.getElementById('torneo-info');
    const tablaBody = document.getElementById('tabla-body');

    try {
        // 1. Obtener clubes peruanos
        const clubesPeru = obtenerClubesDelTorneo("peru", clubes);
        
        // Verificación de datos
        if (!clubesPeru || clubesPeru.length === 0) {
            throw new Error('No se encontraron clubes peruanos');
        }

        if (clubesPeru.length !== ligaPeruana.equipos) {
            console.warn(`Se esperaban ${ligaPeruana.equipos} equipos, pero se encontraron ${clubesPeru.length}`);
        }

        resultsDiv.innerHTML = '<div class="success">✓ Datos cargados correctamente</div>';

        // Mostrar información del torneo
        torneoInfoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${ligaPeruana.nombre}</p>
            <p><strong>Equipos encontrados:</strong> ${clubesPeru.length}</p>
            <p><strong>Equipos esperados:</strong> ${ligaPeruana.equipos}</p>
            <p><strong>Partidos por equipo:</strong> ${ligaPeruana.partidosPorEquipo}</p>
        `;

        // 2. Crear tabla de posiciones inicial (con todos los campos necesarios)
        const tablaPosiciones = clubesPeru.map(club => ({
            nombre: club.nombre,
            puntos: 0,
            partidosJugados: 0,
            partidosGanados: 0,
            partidosEmpatados: 0,
            partidosPerdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferenciaGoles: 0
        }));

        // 3. Mostrar la tabla en HTML
        tablaBody.innerHTML = '';
        tablaPosiciones.forEach((equipo, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${equipo.nombre}</td>
                <td>${equipo.puntos}</td>
                <td>${equipo.partidosJugados}</td>
                <td>${equipo.partidosGanados}</td>
                <td>${equipo.partidosEmpatados}</td>
                <td>${equipo.partidosPerdidos}</td>
                <td>${equipo.golesFavor}</td>
                <td>${equipo.golesContra}</td>
                <td>${equipo.diferenciaGoles}</td>
            `;
            tablaBody.appendChild(row);
        });

        // 4. Mostrar la tabla en consola
        console.log(`\nTABLA DE POSICIONES - ${ligaPeruana.nombre}`);
        tablaPosiciones.forEach((equipo, index) => {
            console.log(`${index + 1}. ${equipo.nombre} - ${equipo.puntos} pts`);
        });

    } catch (error) {
        resultsDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
        console.error('Error al inicializar:', error);
    }
}

// Ejecutar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', inicializarTest);
