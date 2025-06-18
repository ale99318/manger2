// ==================== CALENDARIO - UTILIDADES Y CONVERSIONES ====================

// Extender AutoCalendar con funcionalidades de utilidades
Object.assign(AutoCalendar.prototype, {
    
    // Convertir nombre de club a ID
    getClubIdFromName(clubName) {
        if (typeof clubes !== 'undefined' && clubes) {
            const club = clubes.find(c => c.nombre === clubName);
            return club ? club.id : null;
        }
        return null;
    },

    // Convertir ID de club a nombre
    getClubNameFromId(clubId) {
        if (typeof clubes !== 'undefined' && clubes) {
            const club = clubes.find(c => c.id === clubId);
            return club ? club.nombre : `Club ${clubId}`;
        }
        return `Club ${clubId}`;
    },

    // Comparar si dos fechas son el mismo día
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
});
