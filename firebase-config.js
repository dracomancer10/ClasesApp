// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTCqAyTNr8XKj7Tn28evAhJ1MKLnJxWwI",
  authDomain: "clasesapp-caf81.firebaseapp.com",
  projectId: "clasesapp-caf81",
  storageBucket: "clasesapp-caf81.firebasestorage.app",
  messagingSenderId: "560795640961",
  appId: "1:560795640961:web:2d845891ff39f6a13c1980"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Variables globales
let currentUser = null;
let isOnline = navigator.onLine;
let syncInProgress = false;

// Detectar cambios en la conectividad
window.addEventListener('online', () => {
  isOnline = true;
  console.log('Conexión restaurada');
  syncDataToFirebase();
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Sin conexión - usando datos locales');
});

// Autenticación anónima con manejo de errores
async function initializeAuth() {
  try {
    await signInAnonymously(auth);
    console.log('Autenticación anónima exitosa');
  } catch (error) {
    console.error('Error en autenticación:', error);
    // Si falla la autenticación, usar un ID fijo basado en el dominio para que todos los navegadores compartan datos
    if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
      console.log('Usando modo de desarrollo con ID fijo');
      // Usar un ID fijo basado en el dominio para que todos los navegadores compartan datos
      const domain = window.location.hostname || 'localhost';
      currentUser = { uid: 'shared-user-' + domain.replace(/[^a-zA-Z0-9]/g, '') };
      updateSyncStatus();
    }
  }
}

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('Usuario autenticado:', user.uid);
    // Cargar datos desde Firebase al autenticarse
    loadDataFromFirebase();
  } else {
    currentUser = null;
    console.log('Usuario no autenticado');
  }
  updateSyncStatus();
});

// Función para sincronizar datos a Firebase
async function syncDataToFirebase() {
  if (!currentUser || !isOnline || syncInProgress) return;
  
  syncInProgress = true;
  
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    
    // Recopilar todos los datos del localStorage
    const dataToSync = {
      lastSync: new Date().toISOString(),
      instituciones: JSON.parse(localStorage.getItem('clases_institutions') || '[]'),
      attendance: JSON.parse(localStorage.getItem('clases_attendance') || '[]'),
      selectedMonths: JSON.parse(localStorage.getItem('clases_selectedMonths') || '[]'),
      currentYear: JSON.parse(localStorage.getItem('clases_currentYear') || '2024'),
      annualReportPeriod: JSON.parse(localStorage.getItem('clases_annualReportPeriod') || '{}'),
      alumnos: JSON.parse(localStorage.getItem('alumnos_particulares') || '[]'),
      asistenciaAlumnos: JSON.parse(localStorage.getItem('asistencia_alumnos') || '[]'),
      pagosAlumnos: JSON.parse(localStorage.getItem('pagos_alumnos') || '[]'),
      weeklySchedule: JSON.parse(localStorage.getItem('weekly-schedule') || '[]'),
      gestorFinanciero: JSON.parse(localStorage.getItem('gestor_financiero_transactions') || '[]')
    };
    
    await setDoc(userDocRef, dataToSync, { merge: true });
    console.log('Datos sincronizados a Firebase');
    
    // Mostrar notificación de sincronización
    showSyncNotification('Datos sincronizados correctamente', 'success');
    
  } catch (error) {
    console.error('Error al sincronizar:', error);
    showSyncNotification('Error al sincronizar datos', 'error');
  } finally {
    syncInProgress = false;
  }
}

// Función para cargar datos desde Firebase
async function loadDataFromFirebase() {
  if (!currentUser || !isOnline) return;
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      let cambios = false;
      // Restaurar datos al localStorage solo si son diferentes
      function setIfChanged(key, value) {
        const current = localStorage.getItem(key);
        if (JSON.stringify(value) !== current) {
          localStorage.setItem(key, JSON.stringify(value));
          cambios = true;
        }
      }
      if (data.instituciones) setIfChanged('clases_institutions', data.instituciones);
      if (data.attendance) setIfChanged('clases_attendance', data.attendance);
      if (data.selectedMonths) setIfChanged('clases_selectedMonths', data.selectedMonths);
      if (data.currentYear) setIfChanged('clases_currentYear', data.currentYear);
      if (data.annualReportPeriod) setIfChanged('clases_annualReportPeriod', data.annualReportPeriod);
      if (data.alumnos) setIfChanged('alumnos_particulares', data.alumnos);
      if (data.asistenciaAlumnos) setIfChanged('asistencia_alumnos', data.asistenciaAlumnos);
      if (data.pagosAlumnos) setIfChanged('pagos_alumnos', data.pagosAlumnos);
      if (data.weeklySchedule) setIfChanged('weekly-schedule', data.weeklySchedule);
      if (data.gestorFinanciero) setIfChanged('gestor_financiero_transactions', data.gestorFinanciero);
      // Solo recargar si hay cambios y NO es móvil
      if (cambios && window.innerWidth > 768) {
        window.location.reload();
      }
      showSyncNotification('Datos cargados desde la nube', 'success');
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
    showSyncNotification('Error al cargar datos desde la nube', 'error');
  }
}

// Función para mostrar notificaciones de sincronización
function showSyncNotification(message, type = 'info') {
  // Crear notificación
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Función para sincronizar automáticamente cuando cambian los datos
function setupAutoSync() {
  // Interceptar cambios en localStorage
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    
    // Sincronizar después de un breve delay para evitar múltiples sincronizaciones
    if (key.startsWith('clases_') || key === 'alumnos_particulares' || 
        key === 'asistencia_alumnos' || key === 'pagos_alumnos' || 
        key === 'weekly-schedule' || key === 'gestor_financiero_transactions') {
      setTimeout(syncDataToFirebase, 1000);
    }
  };
}

// Función para obtener el estado de sincronización
function getSyncStatus() {
  return {
    isOnline,
    isAuthenticated: !!currentUser,
    lastSync: localStorage.getItem('lastFirebaseSync')
  };
}

// Función para actualizar el indicador de estado de sincronización
function updateSyncStatus() {
  const syncIndicator = document.getElementById('syncIndicator');
  const syncText = document.getElementById('syncText');
  const manualSyncBtn = document.getElementById('manualSyncBtn');
  
  if (!syncIndicator || !syncText) return;
  
  if (!isOnline) {
    syncIndicator.className = 'w-2 h-2 rounded-full bg-red-500';
    syncText.textContent = 'Sin conexión';
    if (manualSyncBtn) manualSyncBtn.style.display = 'none';
  } else if (!currentUser) {
    syncIndicator.className = 'w-2 h-2 rounded-full bg-yellow-500';
    syncText.textContent = 'Conectando...';
    if (manualSyncBtn) manualSyncBtn.style.display = 'none';
  } else {
    syncIndicator.className = 'w-2 h-2 rounded-full bg-green-500';
    syncText.textContent = 'Sincronizado';
    if (manualSyncBtn) manualSyncBtn.style.display = 'inline-block';
  }
}

// Inicializar cuando se carga el script
document.addEventListener('DOMContentLoaded', () => {
  initializeAuth();
  setupAutoSync();
  updateSyncStatus();
  
  // Actualizar estado de sincronización cada 5 segundos
  setInterval(updateSyncStatus, 5000);
  
  // Configurar botón de sincronización manual
  const manualSyncBtn = document.getElementById('manualSyncBtn');
  if (manualSyncBtn) {
    manualSyncBtn.onclick = () => {
      syncDataToFirebase();
      manualSyncBtn.disabled = true;
      manualSyncBtn.textContent = 'Sincronizando...';
      setTimeout(() => {
        manualSyncBtn.disabled = false;
        manualSyncBtn.textContent = '🔄 Sincronizar';
      }, 3000);
    };
  }
});

// Exportar funciones para uso global
window.FirebaseSync = {
  syncDataToFirebase,
  loadDataFromFirebase,
  getSyncStatus,
  showSyncNotification,
  updateSyncStatus
}; 