// ==================== DATOS ESTÁTICOS PARA GENERACIÓN DE JUGADORES ====================

// ==================== NOMBRES MASCULINOS ====================
const nombres = [
    // Nombres tradicionales hispanos
    "Carlos", "Juan", "Pedro", "Luis", "Miguel", "Andrés", "Santiago", "Daniel", 
    "Fernando", "Pablo", "Diego", "Javier", "Alejandro", "Roberto", "Mario", 
    "Sergio", "Antonio", "Francisco", "José", "Manuel", "Ricardo", "Eduardo", 
    "Raúl", "Guillermo", "Gonzalo", "Mateo", "Sebastián", "Nicolás", "Gabriel", "Emilio",
    
    // Nombres modernos
    "Ángel", "Adrián", "Iván", "Óscar", "Víctor", "Rubén", "Álvaro", "Hugo", 
    "Bruno", "Lucas", "Martín", "Tomás", "Ignacio", "Rodrigo", "Cristian", "Fabián",
    "Maximiliano", "Leonardo", "Valentín", "Joaquín", "Agustín", "Benjamín", "Damián", "Julián",
    
    // Nombres internacionales comunes en fútbol
    "Alexander", "Christian", "Jonathan", "Kevin", "Brian", "Steven", "Michael", "David",
    "Anderson", "Jefferson", "Jackson", "Wilson", "Nelson", "Edison", "Ronaldo", "Ricardo",
    
    // Nombres con variaciones
    "José Luis", "Juan Carlos", "Luis Fernando", "Miguel Ángel", "Carlos Alberto", "Juan Pablo",
    "Diego Armando", "Luis Alberto", "José Antonio", "Juan Manuel", "Carlos Eduardo", "Luis Miguel",
    
    // Nombres menos comunes pero realistas
    "Patricio", "Esteban", "Mauricio", "Marcelo", "Claudio", "Hernán", "Leandro", "Facundo",
    "Ezequiel", "Gastón", "Nahuel", "Lautaro", "Thiago", "Enzo", "Franco", "Mauro",
    
    // Nombres de diferentes regiones
    "Yordan", "Yerson", "Yeison", "Brayan", "Jhon", "Jhonatan", "Yeferson", "Cristopher",
    "Ronaldinho", "Ronaldo", "Rivaldo", "Robinho", "Kaká", "Pelé", "Romário", "Bebeto"
];

// ==================== APELLIDOS ====================
const apellidos = [
    // Apellidos hispanos comunes
    "García", "López", "Martínez", "González", "Pérez", "Rodríguez", "Sánchez", 
    "Fernández", "Torres", "Ramírez", "Castro", "Vargas", "Herrera", "Mendoza", 
    "Silva", "Jiménez", "Morales", "Ruiz", "Ortega", "Delgado", "Cruz", "Flores", 
    "Ramos", "Aguilar", "Medina", "Romero", "Núñez", "Guerrero", "Peña", "Vega",
    
    // Apellidos con origen geográfico
    "Montoya", "Montero", "Montenegro", "Montes", "Ríos", "Lagos", "Campos", "Valles",
    "Serrano", "Cordero", "Pastrana", "Villanueva", "Villareal", "Casas", "Iglesias", "Puente",
    
    // Apellidos compuestos comunes
    "De la Cruz", "De la Rosa", "Del Valle", "De los Santos", "De la Torre", "Del Río",
    "Vásquez", "Velásquez", "Henríquez", "Domínguez", "Rodríguez", "Hernández", "Fernández", "Martínez",
    
    // Apellidos internacionales
    "Santos", "Oliveira", "Silva", "Costa", "Ferreira", "Alves", "Pereira", "Lima",
    "Barbosa", "Ribeiro", "Carvalho", "Gomes", "Martins", "Rocha", "Lopes", "Sousa",
    
    // Apellidos menos comunes
    "Espinoza", "Contreras", "Cabrera", "Figueroa", "Paredes", "Molina", "Carrasco", "Fuentes",
    "Ponce", "Salazar", "Cortés", "Navarro", "Cáceres", "Valdez", "Moreno", "Blanco",
    
    // Apellidos con terminaciones características
    "Álvarez", "Suárez", "Chávez", "Benítez", "Márquez", "Vázquez", "Bermúdez", "Méndez",
    "Díaz", "Ruíz", "Muñoz", "Veloz", "Feroz", "Quiroz", "Avilés", "Cortés",
    
    // Apellidos de diferentes países latinoamericanos
    "Quintero", "Zapata", "Cardona", "Murillo", "Palacios", "Restrepo", "Giraldo", "Henao",
    "Quispe", "Mamani", "Condori", "Huanca", "Choque", "Flores", "Vargas", "Morales",
    
    // Apellidos con historia futbolística
    "Maradona", "Pelé", "Ronaldinho", "Kaká", "Rivaldo", "Romário", "Bebeto", "Zico"
];

// ==================== POSICIONES ====================
const posiciones = ["POR", "DEF", "MED", "DEL"];

// Descripción detallada de posiciones
const posicionesDetalle = {
    "POR": {
        nombre: "Portero",
        descripcion: "Guardameta, arquero",
        atributosPrincipales: ["reflejos", "posicionamiento", "saque"],
        atributosSecundarios: ["liderazgo", "comunicacion"]
    },
    "DEF": {
        nombre: "Defensor",
        descripcion: "Defensa central, lateral",
        atributosPrincipales: ["defensa", "fuerza", "salto"],
        atributosSecundarios: ["pase", "velocidad"]
    },
    "MED": {
        nombre: "Mediocampista",
        descripcion: "Centrocampista, volante",
        atributosPrincipales: ["pase", "resistencia", "vision"],
        atributosSecundarios: ["regate", "tiro"]
    },
    "DEL": {
        nombre: "Delantero",
        descripcion: "Atacante, ariete",
        atributosPrincipales: ["tiro", "regate", "velocidad"],
        atributosSecundarios: ["fuerza", "salto"]
    }
};

// ==================== NACIONALIDADES ====================
const nacionalidades = [
    // Sudamérica
    "Argentina", "Brasil", "Chile", "Colombia", "Ecuador", "Paraguay", 
    "Perú", "Uruguay", "Venezuela", "Bolivia",
    
    // Centroamérica y Caribe
    "México", "Costa Rica", "Guatemala", "Honduras", "El Salvador", 
    "Nicaragua", "Panamá", "Jamaica", "Trinidad y Tobago",
    
    // Europa (para jugadores naturalizados o extranjeros)
    "España", "Italia", "Francia", "Alemania", "Portugal", "Inglaterra",
    "Holanda", "Bélgica", "Croacia", "Serbia",
    
    // África (jugadores naturalizados)
    "Nigeria", "Ghana", "Camerún", "Senegal", "Costa de Marfil",
    
    // Otros
    "Estados Unidos", "Canadá", "Japón", "Corea del Sur", "Australia"
];

// ==================== APODOS Y SOBRENOMBRES ====================
const apodos = [
    // Apodos por características físicas
    "El Flaco", "El Gordo", "El Negro", "El Rubio", "El Pelado", "El Chino",
    "El Gigante", "El Enano", "El Oso", "El Gato", "El Tigre", "El León",
    
    // Apodos por habilidades
    "El Mago", "El Artista", "El Genio", "El Crack", "El Fenómeno", "El Maestro",
    "El Tanque", "El Bulldozer", "El Muro", "El Rayo", "La Bala", "El Cohete",
    
    // Apodos regionales
    "El Pibe", "El Charrúa", "El Cafetero", "El Inca", "El Gaucho", "El Llanero",
    "El Azteca", "El Tico", "El Canalero", "El Catracho", "El Chapín", "El Pinolero",
    
    // Apodos creativos
    "El Loco", "El Profesor", "El Capitán", "El Jefe", "El Rey", "El Príncipe",
    "El Diablo", "El Ángel", "El Santo", "El Brujo", "El Chamán", "El Guerrero"
];

// ==================== CIUDADES DE ORIGEN ====================
const ciudadesOrigen = [
    // Argentina
    "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata",
    
    // Brasil
    "São Paulo", "Río de Janeiro", "Salvador", "Brasília", "Fortaleza", "Belo Horizonte",
    
    // Colombia
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga",
    
    // México
    "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León",
    
    // Chile
    "Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco",
    
    // Perú
    "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos",
    
    // Otras ciudades importantes
    "Montevideo", "Caracas", "Quito", "La Paz", "Asunción", "San José"
];

// ==================== CARACTERÍSTICAS ESPECIALES ====================
const caracteristicasEspeciales = [
    // Pie hábil
    "Diestro", "Zurdo", "Ambidiestro",
    
    // Especialidades
    "Especialista en tiros libres", "Especialista en penales", "Especialista en corners",
    "Especialista en saques largos", "Especialista en marcaje", "Especialista en coberturas",
    
    // Fortalezas físicas
    "Muy rápido", "Muy fuerte", "Muy resistente", "Muy ágil", "Muy alto", "Muy bajo",
    "Buen salto", "Buenos reflejos", "Buena técnica", "Buena visión de juego",
    
    // Características mentales
    "Líder natural", "Muy competitivo", "Muy tranquilo", "Muy agresivo", "Muy técnico",
    "Muy inteligente", "Muy trabajador", "Muy disciplinado", "Muy creativo", "Muy versátil"
];

// ==================== DATOS DE CONFIGURACIÓN ====================

// Distribución de posiciones en un equipo típico
const distribucionPosiciones = {
    "POR": 0.12,  // 12% porteros (3 de 25)
    "DEF": 0.36,  // 36% defensores (9 de 25)
    "MED": 0.32,  // 32% mediocampistas (8 de 25)
    "DEL": 0.20   // 20% delanteros (5 de 25)
};

// Rangos de edad por posición
const rangoEdadPorPosicion = {
    "POR": { min: 18, max: 40, promedio: 28 },
    "DEF": { min: 17, max: 38, promedio: 26 },
    "MED": { min: 17, max: 36, promedio: 25 },
    "DEL": { min: 17, max: 35, promedio: 24 }
};

// Atributos base por posición
const atributosBasePorPosicion = {
    "POR": {
        sprint: { min: 40, max: 70 },
        resistencia: { min: 60, max: 85 },
        regate: { min: 30, max: 60 },
        pase: { min: 50, max: 80 },
        tiro: { min: 20, max: 50 },
        defensa: { min: 70, max: 95 }
    },
    "DEF": {
        sprint: { min: 50, max: 85 },
        resistencia: { min: 65, max: 90 },
        regate: { min: 40, max: 70 },
        pase: { min: 55, max: 85 },
        tiro: { min: 30, max: 65 },
        defensa: { min: 75, max: 95 }
    },
    "MED": {
        sprint: { min: 55, max: 90 },
        resistencia: { min: 70, max: 95 },
        regate: { min: 60, max: 90 },
        pase: { min: 70, max: 95 },
        tiro: { min: 50, max: 85 },
        defensa: { min: 50, max: 80 }
    },
    "DEL": {
        sprint: { min: 65, max: 95 },
        resistencia: { min: 60, max: 85 },
        regate: { min: 70, max: 95 },
        pase: { min: 55, max: 85 },
        tiro: { min: 75, max: 95 },
        defensa: { min: 30, max: 60 }
    }
};

// ==================== FUNCIONES AUXILIARES ====================

// Obtener nombre aleatorio
function getNombreAleatorio() {
    return nombres[Math.floor(Math.random() * nombres.length)];
}

// Obtener apellido aleatorio
function getApellidoAleatorio() {
    return apellidos[Math.floor(Math.random() * apellidos.length)];
}

// Obtener nombre completo aleatorio
function getNombreCompletoAleatorio() {
    const nombre = getNombreAleatorio();
    const apellido = getApellidoAleatorio();
    return `${nombre} ${apellido}`;
}

// Obtener posición aleatoria con distribución realista
function getPosicionAleatoria() {
    const random = Math.random();
    let acumulado = 0;
    
    for (const [posicion, probabilidad] of Object.entries(distribucionPosiciones)) {
        acumulado += probabilidad;
        if (random <= acumulado) {
            return posicion;
        }
    }
    
    return "MED"; // Fallback
}

// Obtener nacionalidad aleatoria con peso hacia latinoamericanas
function getNacionalidadAleatoria() {
    const pesoLatino = 0.7; // 70% probabilidad de ser latinoamericano
    const random = Math.random();
    
    const nacionalidadesLatinas = [
        "Argentina", "Brasil", "Chile", "Colombia", "Ecuador", "Paraguay", 
        "Perú", "Uruguay", "Venezuela", "Bolivia", "México", "Costa Rica", 
        "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Panamá"
    ];
    
    if (random < pesoLatino) {
        return nacionalidadesLatinas[Math.floor(Math.random() * nacionalidadesLatinas.length)];
    } else {
        return nacionalidades[Math.floor(Math.random() * nacionalidades.length)];
    }
}

// Obtener apodo aleatorio (opcional, 30% de probabilidad)
function getApodoAleatorio() {
    if (Math.random() < 0.3) {
        return apodos[Math.floor(Math.random() * apodos.length)];
    }
    return null;
}

// Obtener ciudad de origen aleatoria
function getCiudadOrigenAleatoria() {
    return ciudadesOrigen[Math.floor(Math.random() * ciudadesOrigen.length)];
}

// Obtener característica especial aleatoria (20% de probabilidad)
function getCaracteristicaEspecial() {
    if (Math.random() < 0.2) {
        return caracteristicasEspeciales[Math.floor(Math.random() * caracteristicasEspeciales.length)];
    }
    return null;
}

// Obtener edad apropiada para la posición
function getEdadPorPosicion(posicion) {
    const rango = rangoEdadPorPosicion[posicion] || rangoEdadPorPosicion["MED"];
    const min = rango.min;
    const max = rango.max;
    const promedio = rango.promedio;
    
    // Distribución normal centrada en el promedio
    let edad = Math.round(promedio + (Math.random() - 0.5) * 8);
    
    // Asegurar que esté en el rango válido
    edad = Math.max(min, Math.min(max, edad));
    
    return edad;
}

// Generar atributos balanceados por posición
function getAtributosPorPosicion(posicion, general) {
    const base = atributosBasePorPosicion[posicion] || atributosBasePorPosicion["MED"];
    const variacion = 5; // Variación aleatoria
    
    const atributos = {};
    
    Object.keys(base).forEach(atributo => {
        const rango = base[atributo];
        let valor = Math.floor(Math.random() * (rango.max - rango.min + 1)) + rango.min;
        
        // Ajustar según el general del jugador
        const factorGeneral = general / 70; // Factor basado en general promedio de 70
        valor = Math.round(valor * factorGeneral);
        
        // Agregar variación aleatoria
        valor += Math.floor(Math.random() * (variacion * 2 + 1)) - variacion;
        
        // Asegurar que esté en rango válido
        atributos[atributo] = Math.max(30, Math.min(95, valor));
    });
    
    return atributos;
}

// ==================== PLANTILLAS DE NOMBRES POR REGIÓN ====================

const nombresPorRegion = {
    "argentina": {
        nombres: ["Lionel", "Diego", "Carlos", "Gabriel", "Sergio", "Gonzalo", "Ángel", "Nicolás"],
        apellidos: ["Messi", "Maradona", "Tevez", "Batistuta", "Agüero", "Higuaín", "Di María", "Otamendi"]
    },
    "brasil": {
        nombres: ["Ronaldinho", "Kaká", "Pelé", "Ronaldo", "Rivaldo", "Romário", "Bebeto", "Zico"],
        apellidos: ["Silva", "Santos", "Oliveira", "Costa", "Ferreira", "Alves", "Pereira", "Lima"]
    },
    "colombia": {
        nombres: ["James", "Radamel", "Carlos", "Juan", "Fredy", "Teófilo", "René", "Iván"],
        apellidos: ["Rodríguez", "Falcao", "Valderrama", "Cuadrado", "Guarín", "Gutiérrez", "Higuita", "Córdoba"]
    },
    "mexico": {
        nombres: ["Hugo", "Rafael", "Cuauhtémoc", "Javier", "Carlos", "Andrés", "Omar", "Giovani"],
        apellidos: ["Sánchez", "Márquez", "Blanco", "Hernández", "Vela", "Guardado", "Bravo", "Dos Santos"]
    }
};

// Obtener nombre por región específica
function getNombrePorRegion(region) {
    const regionData = nombresPorRegion[region.toLowerCase()];
    if (!regionData) {
        return getNombreCompletoAleatorio();
    }
    
    const nombre = regionData.nombres[Math.floor(Math.random() * regionData.nombres.length)];
    const apellido = regionData.apellidos[Math.floor(Math.random() * regionData.apellidos.length)];
    
    return `${nombre} ${apellido}`;
}

// ==================== GENERADORES ESPECIALIZADOS ====================

// Generar jugador joven promesa
function generarJovenPromesa() {
    return {
        nombre: getNombreCompletoAleatorio(),
        edad: Math.floor(Math.random() * 5) + 16, // 16-20 años
        posicion: getPosicionAleatoria(),
        nacionalidad: getNacionalidadAleatoria(),
        ciudadOrigen: getCiudadOrigenAleatoria(),
        caracteristica: "Joven promesa",
        potencialAlto: true
    };
}

// Generar veterano experimentado
function generarVeterano() {
    return {
        nombre: getNombreCompletoAleatorio(),
        edad: Math.floor(Math.random() * 8) + 32, // 32-39 años
        posicion: getPosicionAleatoria(),
        nacionalidad: getNacionalidadAleatoria(),
        ciudadOrigen: getCiudadOrigenAleatoria(),
        caracteristica: "Veterano experimentado",
        experiencia: true
    };
}

// Generar capitán/líder
function generarCapitan() {
    return {
        nombre: getNombreCompletoAleatorio(),
        edad: Math.floor(Math.random() * 8) + 25, // 25-32 años
        posicion: Math.random() < 0.5 ? "DEF" : "MED", // Más probable que sea defensor o mediocampista
        nacionalidad: getNacionalidadAleatoria(),
        ciudadOrigen: getCiudadOrigenAleatoria(),
        caracteristica: "Líder natural",
        apodo: "El Capitán",
        liderazgo: true
    };
}

// ==================== VALIDACIÓN DE DATOS ====================

// Validar que todos los arrays tengan contenido
function validarDatos() {
    const errores = [];
    
    if (nombres.length === 0) errores.push("Array de nombres vacío");
    if (apellidos.length === 0) errores.push("Array de apellidos vacío");
    if (posiciones.length === 0) errores.push("Array de posiciones vacío");
    if (nacionalidades.length === 0) errores.push("Array de nacionalidades vacío");
    
    // Validar distribución de posiciones
    const sumaDistribucion = Object.values(distribucionPosiciones).reduce((a, b) => a + b, 0);
    if (Math.abs(sumaDistribucion - 1.0) > 0.01) {
        errores.push("Distribución de posiciones no suma 1.0");
    }
    
    return {
        valido: errores.length === 0,
        errores: errores
    };
}

// ==================== ESTADÍSTICAS DE DATOS ====================

// Obtener estadísticas de los datos disponibles
function getEstadisticasDatos() {
    return {
        totalNombres: nombres.length,
        totalApellidos: apellidos.length,
        totalPosiciones: posiciones.length,
        totalNacionalidades: nacionalidades.length,
        totalApodos: apodos.length,
        totalCiudades: ciudadesOrigen.length,
        totalCaracteristicas: caracteristicasEspeciales.length,
        combinacionesPosibles: nombres.length * apellidos.length,
        regionesEspeciales: Object.keys(nombresPorRegion).length
    };
}

// ==================== EXPORTACIÓN PARA COMPATIBILIDAD ====================

// Para compatibilidad con código existente que espera variables globales
if (typeof window !== 'undefined') {
    window.nombres = nombres;
    window.apellidos = apellidos;
    window.posiciones = posiciones;
    window.nacionalidades = nacionalidades;
    window.apodos = apodos;
    window.ciudadesOrigen = ciudadesOrigen;
    window.caracteristicasEspeciales = caracteristicasEspeciales;
    
    // Funciones globales
    window.getNombreAleatorio = getNombreAleatorio;
    window.getApellidoAleatorio = getApellidoAleatorio;
    window.getNombreCompletoAleatorio = getNombreCompletoAleatorio;
    window.getPosicionAleatoria = getPosicionAleatoria;
    window.getNacionalidadAleatoria = getNacionalidadAleatoria;
}

// ==================== CONFIGURACIÓN DE DEBUG ====================

// Función para mostrar información de debug
function debugNombres() {
    console.log("=== DATOS DE NOMBRES CARGADOS ===");
    console.log("Nombres disponibles:", nombres.length);
    console.log("Apellidos disponibles:", apellidos.length);
    console.log("Posiciones:", posiciones);
    console.log("Nacionalidades:", nacionalidades.length);
    console.log("Combinaciones posibles:", nombres.length * apellidos.length);
    console.log("Validación:", validarDatos());
    console.log("Estadísticas:", getEstadisticasDatos());
    
    // Ejemplos de generación
    console.log("\n=== EJEMPLOS DE GENERACIÓN ===");
    console.log("Nombre aleatorio:", getNombreCompletoAleatorio());
    console.log("Joven promesa:", generarJovenPromesa());
    console.log("Veterano:", generarVeterano());
    console.log("Capitán:", generarCapitan());
}

// Ejecutar debug si está en modo desarrollo
if (typeof console !== 'undefined' && window.location.hostname === 'localhost') {
    debugNombres();
}
