// ==================== INICIADOR DEL CALENDARIO ====================

document.addEventListener('DOMContentLoaded', () => {
    // Verificar elementos requeridos
    const requiredElements = ['current-date-full', 'year-month', 'week-days'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('Elementos faltantes para el calendario:', missingElements);
    }
    
    try {
        window.autoCalendar = new AutoCalendar();
    } catch (error) {
        console.error('Error inicializando AutoCalendar:', error);
    }
});

// Limpiar cuando se cierre la página
window.addEventListener('beforeunload', () => {
    if (window.autoCalendar) {
        window.autoCalendar.destroy();
    }
});
