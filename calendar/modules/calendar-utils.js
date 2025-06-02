// ==================== UTILIDADES DEL CALENDARIO ====================
class CalendarUtils {
    
    // ==================== FUNCIONES MATEMÁTICAS ====================
    
    // Generar número aleatorio entre min y max (inclusivo)
    static rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Generar número aleatorio con distribución normal
    static randNormal(mean, stdDev) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdDev + mean;
    }
    
    // Generar probabilidad ponderada
    static weightedRandom(items, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    }
    
    // ==================== CONFIGURACIONES DE LIGAS ====================
    
    static getConfigPorLiga() {
        return {
            "55": { 
                valorMin: 25000, valorMax: 180000, 
                sueldoMin: 1800, sueldoMax: 12000, 
                generalMin: 75, generalMax: 82,
                nombre: "Liga Premium"
            },
            "54": { 
                valorMin: 18000, valorMax: 150000, 
                sueldoMin: 1200, sueldoMax: 9000, 
                generalMin: 74, generalMax: 80,
                nombre: "Liga Elite"
            },
            "57": { 
                valorMin: 12000, valorMax: 120000, 
                sueldoMin: 900, sueldoMax: 7500, 
                generalMin: 70, generalMax: 77,
                nombre: "Liga Profesional A"
            },
            "56": { 
                valorMin: 10000, valorMax: 100000, 
                sueldoMin: 800, sueldoMax: 6500, 
                generalMin: 68, generalMax: 75,
                nombre: "Liga Profesional B"
            },
            "598": { 
                valorMin: 8000, valorMax: 85000, 
                sueldoMin: 700, sueldoMax: 5500, 
                generalMin: 69, generalMax: 76,
                nombre: "Liga Regional A"
            },
            "593": { 
                valorMin: 7000, valorMax: 75000, 
                sueldoMin: 600, sueldoMax: 4800, 
                generalMin: 68, generalMax: 74,
                nombre: "Liga Regional B"
            },
            "51": { 
                valorMin: 6000, valorMax: 65000, 
                sueldoMin: 500, sueldoMax: 4200, 
                generalMin: 65, generalMax: 72,
                nombre: "Liga Nacional"
            },
            "595": { 
                valorMin: 5000, valorMax: 55000, 
                sueldoMin: 450, sueldoMax: 3800, 
                generalMin: 65, generalMax: 72,
                nombre: "Liga Ascenso"
            },
            "58": { 
                valorMin: 4000, valorMax: 45000, 
                sueldoMin: 350, sueldoMax: 3000, 
                generalMin: 60, generalMax: 67,
                nombre: "Liga Amateur A"
            },
            "591": { 
                valorMin: 3500, valorMax: 40000, 
                sueldoMin: 300, sueldoMax: 2500, 
                generalMin: 60, generalMax: 68,
                nombre: "Liga Amateur B"
            }
        };
    }
    
    // Obtener configuración de liga por ID de club
    static getConfigForClub(clubId) {
        const ligaId = clubId.split('-')[0];
        const configs = this.getConfigPorLiga();
        return configs[ligaId] || configs["51"]; // Default a Liga Nacional
    }
    
    // ==================== CÁLCULOS DE VALOR Y SUELDO ====================
    
    // Calcular valor de mercado basado en habilidad
    static calcularValorPorHabilidad(general, potencial, config, edad = 25) {
        let factorBase = 1.0;
        const rangoGeneral = config.generalMax - config.generalMin;
        const posicionEnRango = (general - config.generalMin) / rangoGeneral;
        
        // Factor por posición en el rango de la liga
        if (posicionEnRango >= 0.9) factorBase = 1.4;
        else if (posicionEnRango >= 0.75) factorBase = 1.2;
        else if (posicionEnRango >= 0.6) factorBase = 1.1;
        else if (posicionEnRango >= 0.4) factorBase = 1.0;
        else if (posicionEnRango >= 0.2) factorBase = 0.9;
        else factorBase = 0.8;
        
        // Factor por potencial
        let factorPotencial = 1.0;
        if (potencial >= 90) factorPotencial = 1.3;
        else if (potencial >= 85) factorPotencial = 1.2;
        else if (potencial >= 80) factorPotencial = 1.1;
        
        // Factor por edad (jugadores jóvenes valen más)
        let factorEdad = 1.0;
        if (edad <= 22) factorEdad = 1.2;
        else if (edad <= 25) factorEdad = 1.1;
        else if (edad <= 28) factorEdad = 1.0;
        else if (edad <= 32) factorEdad = 0.9;
        else if (edad <= 35) factorEdad = 0.7;
        else factorEdad = 0.5;
        
        const rangoValor = config.valorMax - config.valorMin;
        const valorBase = config.valorMin + (rangoValor * posicionEnRango);
        
        return Math.round(valorBase * factorBase * factorPotencial * factorEdad);
    }
    
    // Calcular sueldo basado en valor de mercado
    static calcularSueldoPorValor(valor, config, experiencia = 0) {
        const porcentajeValor = (valor - config.valorMin) / (config.valorMax - config.valorMin);
        const rangoSueldo = config.sueldoMax - config.sueldoMin;
        const sueldoBase = config.sueldoMin + (rangoSueldo * porcentajeValor);
        
        // Factor por experiencia
        const factorExperiencia = 1 + (experiencia * 0.02); // 2% por año de experiencia
        
        // Variación aleatoria del ±20%
        const variacion = sueldoBase * 0.2;
        const sueldoFinal = sueldoBase * factorExperiencia + this.rand(-variacion, variacion);
        
        return Math.max(config.sueldoMin, Math.round(sueldoFinal));
    }
    
    // ==================== CÁLCULOS DE JUGADORES ====================
    
    // Calcular potencial basado en edad y habilidad actual
    static calcularPotencial(general, edad) {
        let potencialBase = general;
        
        // Los jugadores jóvenes tienen más margen de crecimiento
        if (edad <= 18) potencialBase += this.rand(10, 20);
        else if (edad <= 21) potencialBase += this.rand(5, 15);
        else if (edad <= 24) potencialBase += this.rand(2, 10);
        else if (edad <= 27) potencialBase += this.rand(0, 5);
        else potencialBase += this.rand(-2, 2);
        
        return Math.min(95, Math.max(general, potencialBase));
    }
    
    // Calcular degradación por edad
    static calcularDegradacionPorEdad(jugador) {
        let factorDegradacion = 0;
        
        if (jugador.edad >= 30) factorDegradacion = 0.001; // 0.1% por día
        if (jugador.edad >= 33) factorDegradacion = 0.002; // 0.2% por día
        if (jugador.edad >= 36) factorDegradacion = 0.003; // 0.3% por día
        
        return jugador.general * factorDegradacion;
    }
    
    // Calcular mejora por entrenamiento
    static calcularMejoraPorEntrenamiento(jugador, tipoEntrenamiento) {
        const factorEdad = jugador.edad <= 25 ? 1.2 : jugador.edad <= 30 ? 1.0 : 0.8;
        const factorPotencial = (jugador.potencial - jugador.general) / 20; // Más margen = más mejora
        
        let mejoraBase = 0;
        switch (tipoEntrenamiento) {
            case 'fisico':
                mejoraBase = 0.1;
                break;
            case 'tecnico':
                mejoraBase = 0.08;
                break;
            case 'tactico':
                mejoraBase = 0.06;
                break;
            default:
                mejoraBase = 0.05;
        }
        
        return mejoraBase * factorEdad * factorPotencial;
    }
    
    // ==================== UTILIDADES DE FECHA ====================
    
    // Verificar si es año bisiesto
    static isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    
    // Obtener días en un mes
    static getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    
    // Calcular diferencia en días entre dos fechas
    static daysDifference(date1, date2) {
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    
    // Formatear fecha en español
    static formatDateES(date, format = 'full') {
        const options = {
            full: { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            },
            short: { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            },
            monthYear: { 
                year: 'numeric', 
                month: 'long' 
            }
        };
        
        return date.toLocaleDateString('es-ES', options[format] || options.full);
    }
    
    // Obtener nombre del día de la semana
    static getDayName(date) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[date.getDay()];
    }
    
    // Obtener nombre del mes
    static getMonthName(monthIndex) {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[monthIndex];
    }
    
    // ==================== UTILIDADES DE VALIDACIÓN ====================
    
    // Validar fecha
    static isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }
    
    // Validar rango de edad
    static isValidAge(age) {
        return age >= 16 && age <= 45;
    }
    
    // Validar habilidad general
    static isValidGeneral(general) {
        return general >= 30 && general <= 95;
    }
    
    // Validar ID de club
    static isValidClubId(clubId) {
        return typeof clubId === 'string' && clubId.includes('-');
    }
    
    // ==================== UTILIDADES DE CONVERSIÓN ====================
    
    // Convertir valor a formato de moneda
    static formatCurrency(value, currency = '$') {
        return `${currency}${value.toLocaleString()}`;
    }
    
    // Convertir porcentaje
    static formatPercentage(value, decimals = 1) {
        return `${value.toFixed(decimals)}%`;
    }
    
    // Convertir tiempo en días a formato legible
    static formatDuration(days) {
        if (days < 7) return `${days} día${days !== 1 ? 's' : ''}`;
        if (days < 30) return `${Math.floor(days / 7)} semana${Math.floor(days / 7) !== 1 ? 's' : ''}`;
        if (days < 365) return `${Math.floor(days / 30)} mes${Math.floor(days / 30) !== 1 ? 'es' : ''}`;
        return `${Math.floor(days / 365)} año${Math.floor(days / 365) !== 1 ? 's' : ''}`;
    }
    
    // ==================== UTILIDADES DE DATOS ====================
    
    // Obtener club por ID
    static getClubById(clubId) {
        if (typeof clubes !== 'undefined') {
            return clubes.find(club => club.id === clubId);
        }
        return null;
    }
    
    // Obtener nombre del club
    static getClubName(clubId) {
        const club = this.getClubById(clubId);
        return club ? club.nombre : `Club ${clubId}`;
    }
    
    // Obtener liga por ID
    static getLigaName(ligaId) {
        const configs = this.getConfigPorLiga();
        return configs[ligaId] ? configs[ligaId].nombre : `Liga ${ligaId}`;
    }
    
    // ==================== UTILIDADES DE PROBABILIDAD ====================
    
    // Calcular probabilidad de lesión
    static calcularProbabilidadLesion(jugador, factorExterno = 1) {
        let probabilidadBase = jugador.propensionLesiones / 100;
        
           // Calcular probabilidad de lesión
    static calcularProbabilidadLesion(jugador, factorExterno = 1) {
        let probabilidadBase = jugador.propensionLesiones / 100;
        
        // Factores que aumentan la probabilidad
        const factorEdad = jugador.edad > 30 ? 1.2 : 1.0;
        const factorCansancio = 1 + (jugador.cansancio / 200); // Máximo +50%
        const factorEstadoFisico = jugador.estadoFisico < 70 ? 1.3 : 1.0;
        
        return probabilidadBase * factorEdad * factorCansancio * factorEstadoFisico * factorExterno;
    }
    
    // Calcular probabilidad de evento de indisciplina
    static calcularProbabilidadIndisciplina(jugador) {
        let probabilidadBase = 0.01; // 1% base
        
        // Factores según actitud
        const actitudesProblematicas = ['Fiestero', 'Rebelde', 'Impuntual', 'Polémico'];
        if (actitudesProblematicas.includes(jugador.actitud)) {
            probabilidadBase *= 3; // Triple probabilidad
        }
        
        // Factor por edad (jóvenes más propensos)
        if (jugador.edad <= 23) probabilidadBase *= 1.5;
        else if (jugador.edad >= 30) probabilidadBase *= 0.7;
        
        return Math.min(probabilidadBase, 0.1); // Máximo 10%
    }
    
    // Calcular probabilidad de retiro
    static calcularProbabilidadRetiro(jugador) {
        if (!jugador.ultimoAnio) return 0;
        
        let probabilidad = 0;
        if (jugador.edad >= 36) probabilidad = 0.3;
        if (jugador.edad >= 38) probabilidad = 0.5;
        if (jugador.edad >= 40) probabilidad = 0.8;
        if (jugador.edad >= 42) probabilidad = 1.0;
        
        // Jugadores elite se retiran más tarde
        if (jugador.general >= 80) probabilidad *= 0.7;
        
        return probabilidad;
    }
    
    // ==================== UTILIDADES DE RENDIMIENTO ====================
    
    // Calcular rendimiento del jugador
    static calcularRendimiento(jugador) {
        let rendimientoBase = jugador.general;
        
        // Factores que afectan el rendimiento
        const factorEstadoFisico = jugador.estadoFisico / 100;
        const factorCansancio = Math.max(0.5, (100 - jugador.cansancio) / 100);
        const factorLesion = jugador.lesion ? 0.3 : 1.0;
        
        return Math.round(rendimientoBase * factorEstadoFisico * factorCansancio * factorLesion);
    }
    
    // Calcular moral del jugador
    static calcularMoral(jugador, resultadosRecientes = []) {
        let moralBase = 75; // Moral base
        
        // Factor por actitud
        const actitudesPositivas = ['Motivado', 'Ambicioso', 'Profesional', 'Líder nato'];
        const actitudesNegativas = ['Conformista', 'Inseguro', 'Renegón'];
        
        if (actitudesPositivas.includes(jugador.actitud)) moralBase += 10;
        if (actitudesNegativas.includes(jugador.actitud)) moralBase -= 10;
        
        // Factor por resultados recientes
        const victorias = resultadosRecientes.filter(r => r === 'victoria').length;
        const derrotas = resultadosRecientes.filter(r => r === 'derrota').length;
        moralBase += (victorias * 5) - (derrotas * 3);
        
        return Math.max(0, Math.min(100, moralBase));
    }
    
    // ==================== UTILIDADES DE GENERACIÓN ====================
    
    // Generar nombre completo aleatorio
    static generarNombreCompleto() {
        if (typeof nombres === 'undefined' || typeof apellidos === 'undefined') {
            return 'Jugador Desconocido';
        }
        
        const nombre = nombres[this.rand(0, nombres.length - 1)];
        const apellido = apellidos[this.rand(0, apellidos.length - 1)];
        return `${nombre} ${apellido}`;
    }
    
    // Generar fecha de cumpleaños aleatoria
    static generarFechaCumpleanos() {
        const month = this.rand(1, 12);
        const daysInMonth = this.getDaysInMonth(2025, month);
        const day = this.rand(1, daysInMonth);
        
        return { month, day };
    }
    
    // Generar atributos físicos balanceados
    static generarAtributosFisicos(general, posicion) {
        const variacion = 10; // Variación máxima respecto al general
        
        let atributos = {
            sprint: this.rand(Math.max(30, general - variacion), Math.min(95, general + variacion)),
            resistencia: this.rand(Math.max(30, general - variacion), Math.min(95, general + variacion)),
            regate: this.rand(Math.max(30, general - variacion), Math.min(95, general + variacion)),
            pase: this.rand(Math.max(30, general - variacion), Math.min(95, general + variacion)),
            tiro: this.rand(Math.max(30, general - variacion), Math.min(95, general + variacion)),
            defensa: this.rand(Math.max(30, general - variacion), Math.min(95, general + variacion))
        };
        
        // Ajustar según posición
        switch (posicion) {
            case 'POR':
                atributos.defensa += 5;
                atributos.tiro -= 10;
                atributos.regate -= 5;
                break;
            case 'DEF':
                atributos.defensa += 8;
                atributos.tiro -= 8;
                break;
            case 'MED':
                atributos.pase += 5;
                atributos.resistencia += 3;
                break;
            case 'DEL':
                atributos.tiro += 8;
                atributos.regate += 5;
                atributos.defensa -= 8;
                break;
        }
        
        // Asegurar que estén en rango válido
        Object.keys(atributos).forEach(key => {
            atributos[key] = Math.max(30, Math.min(95, atributos[key]));
        });
        
        return atributos;
    }
    
    // ==================== UTILIDADES DE ANÁLISIS ====================
    
    // Analizar fortalezas del jugador
    static analizarFortalezas(jugador) {
        const atributos = {
            'Velocidad': jugador.sprint,
            'Resistencia': jugador.resistencia,
            'Regate': jugador.regate,
            'Pase': jugador.pase,
            'Tiro': jugador.tiro,
            'Defensa': jugador.defensa
        };
        
        const fortalezas = [];
        const debilidades = [];
        
        Object.entries(atributos).forEach(([nombre, valor]) => {
            if (valor >= 80) fortalezas.push(nombre);
            if (valor <= 60) debilidades.push(nombre);
        });
        
        return { fortalezas, debilidades };
    }
    
    // Calcular valor de mercado actualizado
    static actualizarValorMercado(jugador) {
        const config = this.getConfigForClub(jugador.clubId);
        return this.calcularValorPorHabilidad(
            jugador.general, 
            jugador.potencial, 
            config, 
            jugador.edad
        );
    }
    
    // ==================== UTILIDADES DE DEPURACIÓN ====================
    
    // Validar integridad de datos del jugador
    static validarJugador(jugador) {
        const errores = [];
        
        if (!jugador.id) errores.push('ID faltante');
        if (!this.isValidAge(jugador.edad)) errores.push('Edad inválida');
        if (!this.isValidGeneral(jugador.general)) errores.push('General inválido');
        if (!jugador.nombre || jugador.nombre.trim() === '') errores.push('Nombre faltante');
        if (!['POR', 'DEF', 'MED', 'DEL'].includes(jugador.posicion)) errores.push('Posición inválida');
        
        return {
            valido: errores.length === 0,
            errores: errores
        };
    }
    
    // Log de depuración
    static debug(mensaje, datos = null) {
        if (typeof console !== 'undefined' && console.log) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${timestamp}] CalendarUtils: ${mensaje}`, datos || '');
        }
    }
    
    // ==================== CONSTANTES ÚTILES ====================
    
    static get POSICIONES() {
        return ['POR', 'DEF', 'MED', 'DEL'];
    }
    
    static get MESES_ES() {
        return [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
    }
    
    static get DIAS_ES() {
        return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    }
    
    static get ACTITUDES_POSITIVAS() {
        return ['Motivado', 'Ambicioso', 'Profesional', 'Líder nato', 'Responsable'];
    }
    
    static get ACTITUDES_NEGATIVAS() {
        return ['Conformista', 'Inseguro', 'Renegón', 'Fiestero', 'Rebelde'];
    }
}

// ==================== FUNCIONES GLOBALES DE CONVENIENCIA ====================

// Funciones globales para compatibilidad con código existente
function rand(min, max) {
    return CalendarUtils.rand(min, max);
}

function formatCurrency(value) {
    return CalendarUtils.formatCurrency(value);
}

function getClubName(clubId) {
    return CalendarUtils.getClubName(clubId);
}

function calcularValorPorHabilidad(general, potencial, config, edad) {
    return CalendarUtils.calcularValorPorHabilidad(general, potencial, config, edad);
}

function calcularSueldoPorValor(valor, config, experiencia) {
    return CalendarUtils.calcularSueldoPorValor(valor, config, experiencia);
}
