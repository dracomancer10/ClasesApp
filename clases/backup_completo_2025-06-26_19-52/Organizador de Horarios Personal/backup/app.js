// Backup de app.js generado automáticamente
// Fecha de backup: (se puede actualizar manualmente)

// ...código original de app.js aquí... 

// Constantes y configuración
const DAYS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 7); // 7:00 a 23:00
const STORAGE_KEY = "weekly-schedule";

// Estado de la aplicación
let activities = [];
let editingId = null;

// Elementos del DOM
const timelineContainer = document.querySelector('.timeline-container');
const timeSlots = document.querySelector('.time-slots');
const timelineBody = document.querySelector('.timeline-body');
const modal = document.getElementById('activityModal');
const activityForm = document.getElementById('activityForm');
const addActivityBtn = document.getElementById('addActivityBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Funciones de utilidad
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function getTimeSlotWidth() {
    return timeSlots.querySelector('.time-slot').offsetWidth;
}

function calculateActivityPosition(start, end) {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    const startPosition = ((startMinutes - 7 * 60) / 60) * getTimeSlotWidth();
    const width = ((endMinutes - startMinutes) / 60) * getTimeSlotWidth();
    return { startPosition, width };
}

// Gestión de datos
function loadActivities() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        activities = JSON.parse(data);
    }
    renderTimeline();
}

function saveActivities() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

// Renderizado
function renderTimeSlots() {
    timeSlots.innerHTML = '';
    HOURS.forEach(hour => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = `${hour}:00`;
        timeSlots.appendChild(slot);
    });
}

function renderTimeline() {
    timelineBody.innerHTML = '';
    
    DAYS.forEach(day => {
        const dayRow = document.createElement('div');
        dayRow.className = 'day-row';
        
        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = day;
        dayRow.appendChild(dayName);
        
        const activitiesContainer = document.createElement('div');
        activitiesContainer.className = 'activities-container';
        
        const dayActivities = activities
            .filter(a => a.day === day)
            .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
        
        // Para cada actividad, calcular la columna de inicio y el span
        dayActivities.forEach(activity => {
            // Calcular columna de inicio (1-based para grid)
            const startHour = parseInt(activity.start.split(':')[0], 10);
            const startMin = parseInt(activity.start.split(':')[1], 10);
            const endHour = parseInt(activity.end.split(':')[0], 10);
            const endMin = parseInt(activity.end.split(':')[1], 10);
            const startCol = (startHour - 7) + (startMin / 60) + 1;
            const endCol = (endHour - 7) + (endMin / 60) + 1;
            const colStart = Math.round(startCol);
            const colEnd = Math.round(endCol);
            const colSpan = Math.max(1, colEnd - colStart);

            const activityElement = document.createElement('div');
            activityElement.className = 'activity';
            activityElement.style.gridColumn = `${colStart} / span ${colSpan}`;
            activityElement.style.backgroundColor = activity.color;
            
            // Crear el contenido de la actividad
            const activityContent = document.createElement('div');
            activityContent.className = 'activity-content';
            activityContent.innerHTML = `
                <div class="activity-name">${activity.name}</div>
                <div class="activity-time">${activity.start}-${activity.end}</div>
            `;
            activityElement.appendChild(activityContent);
            
            activityElement.addEventListener('click', () => openModal(activity));
            activitiesContainer.appendChild(activityElement);
        });
        
        dayRow.appendChild(activitiesContainer);
        timelineBody.appendChild(dayRow);
    });
}

// Gestión del modal
function openModal(activity = null) {
    editingId = activity ? activity.id : null;
    document.getElementById('modalTitle').textContent = activity ? 'Editar Actividad' : 'Nueva Actividad';
    activityForm.reset();
    
    if (activity) {
        document.getElementById('activityName').value = activity.name;
        document.getElementById('activityDay').value = activity.day;
        document.getElementById('activityStart').value = activity.start;
        document.getElementById('activityEnd').value = activity.end;
        document.getElementById('activityColor').value = activity.color;
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    editingId = null;
    activityForm.reset();
}

// Event Listeners
activityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('activityName').value,
        day: document.getElementById('activityDay').value,
        start: document.getElementById('activityStart').value,
        end: document.getElementById('activityEnd').value,
        color: document.getElementById('activityColor').value
    };
    
    if (timeToMinutes(formData.start) >= timeToMinutes(formData.end)) {
        alert('La hora de fin debe ser mayor que la de inicio');
        return;
    }
    
    if (editingId) {
        const index = activities.findIndex(a => a.id === editingId);
        activities[index] = { ...activities[index], ...formData };
    } else {
        const newId = activities.length ? Math.max(...activities.map(a => a.id)) + 1 : 1;
        activities.push({ id: newId, ...formData });
    }
    
    saveActivities();
    renderTimeline();
    closeModal();
});

addActivityBtn.addEventListener('click', () => openModal());
document.querySelector('.close-btn').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);

// Exportación
exportJsonBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'calendario-semanal.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

exportPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Calendario Semanal', 14, 20);
    
    // Contenido
    doc.setFontSize(12);
    let y = 40;
    
    DAYS.forEach(day => {
        doc.setFontSize(14);
        doc.text(day, 14, y);
        y += 10;
        
        doc.setFontSize(12);
        const dayActivities = activities
            .filter(a => a.day === day)
            .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
        
        dayActivities.forEach(activity => {
            const text = `${activity.start}-${activity.end}: ${activity.name}`;
            doc.text(text, 20, y);
            y += 8;
        });
        
        y += 10;
    });
    
    doc.save('calendario-semanal.pdf');
});

// Inicialización
window.addEventListener('load', () => {
    renderTimeSlots();
    loadActivities();
    
    // Ajustar el ancho de las actividades cuando cambia el tamaño de la ventana
    window.addEventListener('resize', renderTimeline);
}); 