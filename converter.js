// Mapeo de posiciones
const positionMap = {
    'Portero': 'Portero',
    'Defensa central': 'Defensa central',
    'Lateral izquierdo': 'Lateral izquierdo',
    'Lateral derecho': 'Lateral derecho',
    'Pivote': 'Mediocentro defensivo',
    'Mediocentro': 'Mediocentro',
    'Mediocentro ofensivo': 'Mediocentro ofensivo',
    'Extremo izquierdo': 'Extremo izquierdo',
    'Extremo derecho': 'Extremo derecho',
    'Delantero centro': 'Delantero'
};

// Estados de ánimo aleatorios
const moods = ['😊', '😐', '🙂', '😤', '💪', '🎯'];

// Personalidades
const personalities = ['líder', 'motivador', 'tranquilo', 'ambicioso', 'veterano', 'promesa'];

// Función para calcular edad desde fecha de nacimiento
function calculateAge(birthDate) {
    if (!birthDate) return 25; // Edad por defecto
    
    const parts = birthDate.split('/');
    if (parts.length !== 3) return 25;
    
    const birth = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Función para extraer valor monetario
function parseValue(valueStr) {
    if (!valueStr || valueStr === '-') return 50000;
    
    const cleanValue = valueStr.replace(/[^\d,]/g, '');
    if (cleanValue.includes(',')) {
        return parseFloat(cleanValue.replace(',', '.')) * 1000000;
    }
    return parseInt(cleanValue) * 1000 || 50000;
}

// Función para generar estadísticas basadas en posición y edad
function generateStats(position, age, value) {
    const baseStat = Math.max(50, Math.min(85, 70 - (age - 25) * 0.5));
    const valueFactor = Math.log10(value / 50000) * 5;
    
    let stats = {
        general: Math.round(baseStat + valueFactor),
        potencial: 0,
        progreso: age < 23 ? Math.random() * 30 + 20 : Math.random() * 10,
        sprint: Math.round(baseStat + Math.random() * 10 - 5),
        regate: Math.round(baseStat + Math.random() * 10 - 5),
        pase: Math.round(baseStat + Math.random() * 10 - 5),
        tiro: Math.round(baseStat + Math.random() * 10 - 5),
        defensa: Math.round(baseStat + Math.random() * 10 - 5),
        liderazgo: Math.round(baseStat + (age - 25) * 2),
        resistencia: Math.round(Math.max(50, baseStat - (age - 25) * 1.5))
    };

    // Ajustes por posición
    switch(position) {
        case 'Portero':
            stats.defensa += 15;
            stats.tiro -= 20;
            stats.regate -= 10;
            stats.sprint -= 5;
            break;
        case 'Defensa central':
            stats.defensa += 10;
            stats.tiro -= 15;
            stats.liderazgo += 5;
            break;
        case 'Lateral izquierdo':
        case 'Lateral derecho':
            stats.sprint += 8;
            stats.pase += 5;
            stats.defensa += 5;
            break;
        case 'Mediocentro defensivo':
            stats.defensa += 8;
            stats.pase += 5;
            stats.liderazgo += 3;
            break;
        case 'Mediocentro':
        case 'Mediocentro ofensivo':
            stats.pase += 10;
            stats.regate += 5;
            break;
        case 'Extremo izquierdo':
        case 'Extremo derecho':
            stats.sprint += 10;
            stats.regate += 8;
            stats.tiro += 5;
            break;
        case 'Delantero':
            stats.tiro += 12;
            stats.regate += 5;
            stats.defensa -= 10;
            break;
    }

    // Calcular potencial
    if (age < 21) {
        stats.potencial = stats.general + Math.random() * 15 + 5;
    } else if (age < 26) {
        stats.potencial = stats.general + Math.random() * 8;
    } else {
        stats.potencial = Math.max(stats.general - 2, stats.general + Math.random() * 4 - 2);
    }

    // Asegurar que las estadísticas estén en rangos válidos
    Object.keys(stats).forEach(key => {
        if (key !== 'progreso') {
            stats[key] = Math.max(30, Math.min(95, Math.round(stats[key])));
        }
    });

    return stats;
}

// Función principal para convertir jugadores
function convertPlayers() {
    const inputData = document.getElementById('inputData').value.trim();
    
    if (!inputData) {
        showStatus('Por favor, ingresa los datos de los jugadores.', 'error');
        return;
    }

    try {
        const lines = inputData.split('\n').filter(line => line.trim());
        const players = [];
        let id = 1;

        for (let line of lines) {
            // Saltar líneas de encabezado o vacías
            if (line.includes('Jugadores') || line.includes('F. Nacim') || line.includes('Nac.') || !line.trim()) {
                continue;
            }

            // Parsear cada línea
            const parts = line.split('\t');
            if (parts.length < 4) continue;

            // Extraer información básica
            let playerName = '';
            let position = '';
            let birthInfo = '';
            let nationality = '';
            let value = '';

            // Buscar el nombre del jugador (puede estar duplicado)
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] && parts[i].trim() && !parts[i].match(/^\d+$/)) {
                    if (parts[i].includes('\t') || parts[i].includes('  ')) {
                        const subParts = parts[i].split(/\s{2,}|\t/);
                        playerName = subParts[0] || subParts[1];
                        if (subParts.length > 1) {
                            position = subParts[subParts.length - 1];
                        }
                    } else {
                        playerName = parts[i];
                    }
                    break;
                }
            }

            // Buscar posición si no se encontró
            if (!position) {
                const positionKeywords = ['Portero', 'Defensa', 'Lateral', 'Pivote', 'Mediocentro', 'Extremo', 'Delantero'];
                for (let part of parts) {
                    for (let keyword of positionKeywords) {
                        if (part && part.includes(keyword)) {
                            position = part.trim();
                            break;
                        }
                    }
                    if (position) break;
                }
            }

            // Buscar información de fecha/edad
            for (let part of parts) {
                if (part && part.includes('/') && part.includes('(')) {
                    birthInfo = part;
                    break;
                }
            }

            // Buscar nacionalidad
            const countries = ['Perú', 'Bolivia', 'Argentina', 'Ecuador', 'Uruguay', 'Italia', 'Líbano'];
            for (let part of parts) {
                for (let country of countries) {
                    if (part && part.includes(country)) {
                        nationality = country;
                        break;
                    }
                }
                if (nationality) break;
            }

            // Buscar valor
            for (let part of parts) {
                if (part && (part.includes('mil €') || part.includes('mill. €'))) {
                    value = part;
                    break;
                }
            }

            // Si no encontramos datos suficientes, continuar
            if (!playerName || !position) continue;

            // Limpiar nombre
            playerName = playerName.replace(/\s+/g, ' ').trim();
            
            // Extraer edad
            let age = 25; // Edad por defecto
            if (birthInfo) {
                const ageMatch = birthInfo.match(/\((\d+)\)/);
                if (ageMatch) {
                    age = parseInt(ageMatch[1]);
                }
            }

            // Limpiar posición y mapear
            position = position.trim();
            const mappedPosition = positionMap[position] || position;

            // Parsear valor
            const playerValue = parseValue(value);

            // Generar estadísticas
            const stats = generateStats(mappedPosition, age, playerValue);

            // Crear objeto jugador
            const player = {
                id: id++,
                nombre: playerName,
                club: "Alianza Lima",
                edad: age,
                posicion: mappedPosition,
                general: stats.general,
                potencial: stats.potencial,
                progreso: Math.round(stats.progreso),
                sprint: stats.sprint,
                regate: stats.regate,
                pase: stats.pase,
                tiro: stats.tiro,
                defensa: stats.defensa,
                liderazgo: stats.liderazgo,
                personalidad: personalities[Math.floor(Math.random() * personalities.length)],
                motivacion: Math.round(Math.random() * 20 + 70),
                estado_animo: moods[Math.floor(Math.random() * moods.length)],
                energia: Math.round(Math.random() * 20 + 80),
                resistencia: stats.resistencia,
                lesionado: false,
                felicidad: Math.round(Math.random() * 20 + 70),
                minutos_jugados: Math.round(Math.random() * 300),
                titular: Math.random() > 0.5,
                valor: playerValue,
                sueldo: Math.round(playerValue * 0.02),
                contrato: Math.round(Math.random() * 24 + 12)
            };

            players.push(player);
        }

        if (players.length === 0) {
            showStatus('No se pudieron procesar los datos. Verifica el formato.', 'error');
            return;
        }

        // Generar código JavaScript
        let jsCode = 'const jugadores = [\n';
        
        players.forEach((player, index) => {
            jsCode += '  {\n';
            Object.entries(player).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    jsCode += `    ${key}: "${value}",\n`;
                } else {
                    jsCode += `    ${key}: ${value},\n`;
                }
            });
            jsCode += '  }';
            if (index < players.length - 1) {
                jsCode += ',';
            }
            jsCode += '\n';
        });
        
        jsCode += '];';

        document.getElementById('output').value = jsCode;
        showStatus(`Se procesaron ${players.length} jugadores exitosamente.`, 'success');

    } catch (error) {
        showStatus('Error al procesar los datos: ' + error.message, 'error');
    }
}

// Función para limpiar todo
function clearAll() {
    document.getElementById('inputData').value = '';
    document.getElementById('output').value = '';
    document.getElementById('status').style.display = 'none';
}

// Función para copiar al portapapeles
function copyToClipboard() {
    const output = document.getElementById('output');
    if (!output.value) {
        showStatus('No hay contenido para copiar.', 'error');
        return;
    }
    
    output.select();
    document.execCommand('copy');
    showStatus('Código copiado al portapapeles.', 'success');
}

// Función para mostrar mensajes de estado
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    
    if (type === 'success') {
        statusDiv.style.backgroundColor = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.border = '1px solid #c3e6cb';
    } else {
        statusDiv.style.backgroundColor = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.style.border = '1px solid #f5c6cb';
    }
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Cargar datos de ejemplo al cargar la página
window.onload = function() {
    const exampleData = `1	Ángelo Campos	Ángelo Campos

    
    document.getElementById('inputData').value = exampleData;
};
