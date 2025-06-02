// Almacenar eventos de cumpleaños y retiros
let birthdays = [];
let retirements = [];
let inbox = []; // Combinación de ambos para bandeja de entrada
let currentDate = new Date(2025, 0, 1); // Fecha inicial por defecto

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();
    updateCurrentDate();
    updateInbox();
    displayInbox();
    displayBirthdays();
    displayRetirements();
});

// Cargar notificaciones desde localStorage
function loadNotifications() {
    const storedBirthdays = localStorage.getItem("birthdays");
    const storedRetirements = localStorage.getItem("retirements");
    const storedDate = localStorage.getItem("currentDate");
    
    if (storedBirthdays) {
        birthdays = JSON.parse(storedBirthdays);
    }
    
    if (storedRetirements) {
        retirements = JSON.parse(storedRetirements);
    }
    
    if (storedDate) {
        currentDate = new Date(storedDate);
    }
}

// Actualizar la bandeja de entrada combinando cumpleaños y retiros
function updateInbox() {
    inbox = [];
    
    birthdays.forEach(b => {
        inbox.push({
            type: 'birthday',
            id: b.id || Date.now() + Math.random().toString(36).substr(2, 9),
            nombre: b.nombre,
            edad: b.edad,
            club: b.club,
            date: b.date,
            read: b.read || false
        });
    });
    
    retirements.forEach(r => {
        inbox.push({
            type: 'retirement',
            id: r.id || Date.now() + Math.random().toString(36).substr(2, 9),
            nombre: r.nombre,
            edad: r.edad,
            posicion: r.posicion,
            general: r.general,
            club: r.club,
            date: r.date,
            read: r.read || false
        });
    });
    
    // Ordenar por fecha (más reciente primero)
    inbox.sort((a, b) => {
        const dateA = new Date(a.date.split(' ').reverse().join('-'));
        const dateB = new Date(b.date.split(' ').reverse().join('-'));
        return dateB - dateA;
    });
}

// Actualizar la fecha mostrada
function updateCurrentDate() {
    const dateElement = document.getElementById("current-date");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = currentDate.toLocaleDateString('es-ES', options);
}

// Mostrar bandeja de entrada
function displayInbox() {
    const inboxList = document.getElementById("inbox-list");
    if (inbox.length === 0) {
        inboxList.innerHTML = "<p class='no-mails'>No hay mensajes en la bandeja de entrada.</p>";
        return;
    }
    
    let html = "";
    inbox.forEach((mail, index) => {
        const icon = mail.type === 'birthday' ? '🎂' : '👴';
        const subject = mail.type === 'birthday' ? `Cumpleaños de ${mail.nombre}` : `Retiro de ${mail.nombre}`;
        const snippet = mail.type === 'birthday' ? `¡${mail.nombre} cumple ${mail.edad} años!` : `${mail.nombre} dice adiós al fútbol.`;
        
        html += `
            <div class="mail-preview ${mail.read ? '' : 'unread'}" onclick="openMail(${index}, 'inbox')">
                <div class="mail-info">
                    <div class="mail-subject">${icon} ${subject}</div>
                    <div class="mail-snippet">${snippet}</div>
                </div>
                <div class="mail-date-preview">${mail.date}</div>
            </div>
        `;
    });
    
    inboxList.innerHTML = html;
}

// Mostrar lista de cumpleaños
function displayBirthdays() {
    const birthdayList = document.getElementById("birthday-list");
    if (birthdays.length === 0) {
        birthdayList.innerHTML = "<p class='no-mails'>No hay correos de cumpleaños registrados.</p>";
        return;
    }
    
    let html = "";
    birthdays.forEach((event, index) => {
        html += `
            <div class="mail-preview ${event.read ? '' : 'unread'}" onclick="openMail(${index}, 'birthdays')">
                <div class="mail-info">
                    <div class="mail-subject">🎂 Cumpleaños de ${event.nombre}</div>
                    <div class="mail-snippet">¡${event.nombre} cumple ${event.edad} años!</div>
                </div>
                <div class="mail-date-preview">${event.date}</div>
            </div>
        `;
    });
    
    birthdayList.innerHTML = html;
}

// Mostrar lista de retiros
function displayRetirements() {
    const retirementList = document.getElementById("retirement-list");
    if (retirements.length === 0) {
        retirementList.innerHTML = "<p class='no-mails'>No hay correos de retiros registrados.</p>";
        return;
    }
    
    let html = "";
    retirements.forEach((event, index) => {
        html += `
            <div class="mail-preview ${event.read ? '' : 'unread'}" onclick="openMail(${index}, 'retirements')">
                <div class="mail-info">
                    <div class="mail-subject">👴 Retiro de ${event.nombre}</div>
                    <div class="mail-snippet">${event.nombre} dice adiós al fútbol.</div>
                </div>
                <div class="mail-date-preview">${event.date}</div>
            </div>
        `;
    });
    
    retirementList.innerHTML = html;
}

// Cambiar entre carpetas (pestañas)
function switchFolder(folderId) {
    const toolbarBtns = document.querySelectorAll(".toolbar-btn");
    const folderContents = document.querySelectorAll(".folder-content");
    
    toolbarBtns.forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick").includes(folderId)) {
            btn.classList.add("active");
        }
    });
    
    folderContents.forEach(content => {
        content.classList.remove("active");
        if (content.id === folderId) {
            content.classList.add("active");
        }
    });
}

// Abrir un correo para ver el contenido completo
function openMail(index, folder) {
    let mail;
    if (folder === 'inbox') {
        mail = inbox[index];
    } else if (folder === 'birthdays') {
        mail = birthdays[index];
        birthdays[index].read = true;
        localStorage.setItem("birthdays", JSON.stringify(birthdays));
    } else if (folder === 'retirements') {
        mail = retirements[index];
        retirements[index].read = true;
        localStorage.setItem("retirements", JSON.stringify(retirements));
    }
    
    // Actualizar estado de lectura en inbox también
    if (folder !== 'inbox') {
        const inboxMail = inbox.find(m => m.id === mail.id);
        if (inboxMail) {
            inboxMail.read = true;
        }
    }
    
    // Mostrar visor de correo
    const mailViewer = document.getElementById("mail-viewer");
    const mailSubject = document.getElementById("mail-subject");
    const mailFrom = document.getElementById("mail-from");
    const mailDate = document.getElementById("mail-date");
    const mailBody = document.getElementById("mail-body");
    
    mailSubject.textContent = mail.type === 'birthday' ? `🎂 Cumpleaños de ${mail.nombre}` : `👴 Retiro de ${mail.nombre}`;
    mailFrom.textContent = "De: Sistema de Notificaciones";
    mailDate.textContent = `Fecha: ${mail.date}`;
    
    if (mail.type === 'birthday') {
        mailBody.innerHTML = `
            <p>¡Feliz cumpleaños a <strong>${mail.nombre}</strong>!</p>
            <p>Ahora tiene <strong>${mail.edad} años</strong> y sigue siendo parte de <strong>${mail.club}</strong>.</p>
            <p>¡Deseémosle lo mejor en este día especial y en su carrera futbolística!</p>
            <p>Atentamente,<br>El Sistema de Gestión de Jugadores</p>
        `;
    } else {
        mailBody.innerHTML = `
            <p>Lamentamos anunciar el retiro de <strong>${mail.nombre}</strong> del fútbol profesional.</p>
            <p>Con <strong>${mail.edad} años</strong>, posición <strong>${mail.posicion}</strong> y una calificación general de <strong>${mail.general}</strong>, 
            deja un legado en <strong>${mail.club}</strong>.</p>
            <p>¡Gracias por todo lo que diste al deporte, ${mail.nombre}! Te deseamos lo mejor en tu nueva etapa.</p>
            <p>Atentamente,<br>El Sistema de Gestión de Jugadores</p>
        `;
    }
    
    mailViewer.style.display = "flex";
    updateInbox();
    displayInbox();
    if (folder === 'birthdays') displayBirthdays();
    if (folder === 'retirements') displayRetirements();
}

// Cerrar el visor de correo
function closeMailViewer() {
    const mailViewer = document.getElementById("mail-viewer");
    mailViewer.style.display = "none";
}

// Limpiar todo el buzón
function clearMailbox() {
    if (confirm("¿Estás seguro de que deseas limpiar todo el buzón? Todos los correos serán eliminados permanentemente.")) {
        birthdays = [];
        retirements = [];
        inbox = [];
        localStorage.removeItem("birthdays");
        localStorage.removeItem("retirements");
        displayInbox();
        displayBirthdays();
        displayRetirements();
        alert("✅ Buzón limpiado con éxito. Todos los correos han sido eliminados.");
    }
}

// Volver al calendario (ajusta la URL según tu estructura de archivos)
function backToCalendar() {
    window.location.href = "index.html"; // Cambia esto si tu archivo principal tiene otro nombre
}

// Funciones para que el sistema de calendario actualice las notificaciones (pueden integrarse desde el otro script)
function addBirthdayEvent(event) {
    const dateStr = currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    event.date = dateStr;
    event.read = false; // Nuevo correo no leído
    event.id = Date.now() + Math.random().toString(36).substr(2, 9); // ID único
    birthdays.unshift(event);
    localStorage.setItem("birthdays", JSON.stringify(birthdays));
    updateInbox();
    if (document.getElementById("inbox-list")) {
        displayInbox();
    }
}

function addRetirementEvent(event) {
    const dateStr = currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    event.date = dateStr;
    event.read = false; // Nuevo correo no leído
    event.id = Date.now() + Math.random().toString(36).substr(2, 9); // ID único
    retirements.unshift(event);
    localStorage.setItem("retirements", JSON.stringify(retirements));
    updateInbox();
    if (document.getElementById("inbox-list")) {
        displayInbox();
    }
}

function updateCurrentDateForNotifications(date) {
    currentDate = new Date(date);
    localStorage.setItem("currentDate", currentDate.toISOString());
    updateCurrentDate();
}

// Para probar las notificaciones, descomenta estas líneas:
// addBirthdayEvent({ nombre: "Juan Pérez", edad: 25, club: "Club Ejemplo" });
// addRetirementEvent({ nombre: "Carlos Gómez", edad: 36, posicion: "DEF", general: 78, club: "Club Ejemplo" });
