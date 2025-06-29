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
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Sin conexión - usando datos locales');
});

// Usar un ID de usuario fijo para que todos los navegadores compartan datos
function getFixedUserId() {
  const domain = window.location.hostname || 'localhost';
  return 'shared-user-' + domain.replace(/[^a-zA-Z0-9]/g, '');
}

// Autenticación simplificada
async function initializeAuth() {
  try {
    // Intentar autenticación anónima
    await signInAnonymously(auth);
    console.log('Autenticación anónima exitosa');
  } catch (error) {
    console.error('Error en autenticación:', error);
    // Si falla, usar ID fijo
    console.log('Usando ID fijo para sincronización');
    currentUser = { uid: getFixedUserId() };
    updateSyncStatus();
  }
}

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('Usuario autenticado:', user.uid);
  } else {
    currentUser = { uid: getFixedUserId() };
    console.log('Usando ID fijo:', currentUser.uid);
  }
  updateSyncStatus();
  
  // Cargar datos una sola vez al inicializar
  if (isOnline) {
    loadDataFromFirebase();
  }
});

// Función para sincronizar datos a Firebase
async function syncDataToFirebase() {
  if (!currentUser || !isOnline || syncInProgress) return;
  
  syncInProgress = true;
  console.log('Iniciando sincronización a Firebase...');
  
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
    console.log('✅ Datos sincronizados a Firebase exitosamente');
    
    showSyncNotification('Datos sincronizados correctamente', 'success');
    
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    showSyncNotification('Error al sincronizar datos', 'error');
  } finally {
    syncInProgress = false;
  }
}

// Función para cargar datos desde Firebase
async function loadDataFromFirebase() {
  if (!currentUser || !isOnline) {
    console.log('No se puede cargar desde Firebase: sin conexión o usuario');
    return;
  }
  
  try {
    console.log('Cargando datos desde Firebase...');
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      let datosCargados = 0;
      
      // Cargar datos al localStorage
      const datosParaCargar = [
        { key: 'clases_institutions', value: data.instituciones },
        { key: 'clases_attendance', value: data.attendance },
        { key: 'clases_selectedMonths', value: data.selectedMonths },
        { key: 'clases_currentYear', value: data.currentYear },
        { key: 'clases_annualReportPeriod', value: data.annualReportPeriod },
        { key: 'alumnos_particulares', value: data.alumnos },
        { key: 'asistencia_alumnos', value: data.asistenciaAlumnos },
        { key: 'pagos_alumnos', value: data.pagosAlumnos },
        { key: 'weekly-schedule', value: data.weeklySchedule },
        { key: 'gestor_financiero_transactions', value: data.gestorFinanciero }
      ];
      
      datosParaCargar.forEach(({ key, value }) => {
        if (value) {
          localStorage.setItem(key, JSON.stringify(value));
          datosCargados++;
          console.log(`✅ Cargado: ${key}`);
        }
      });
      
      if (datosCargados > 0) {
        console.log(`✅ Se cargaron ${datosCargados} tipos de datos desde Firebase`);
        showSyncNotification(`Datos cargados desde la nube (${datosCargados} tipos)`, 'success');
      } else {
        console.log('ℹ️ No hay datos nuevos para cargar desde Firebase');
      }
    } else {
      console.log('ℹ️ No hay datos en Firebase para este usuario');
    }
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
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
  console.log('Configurando sincronización automática...');
  
  // Interceptar cambios en localStorage
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    
    // Solo mostrar en consola, NO sincronizar automáticamente
    if (key.startsWith('clases_') || key === 'alumnos_particulares' || 
        key === 'asistencia_alumnos' || key === 'pagos_alumnos' || 
        key === 'weekly-schedule' || key === 'gestor_financiero_transactions') {
      console.log('💾 Dato guardado localmente:', key);
    }
  };
}

// Función para obtener el estado de sincronización
function getSyncStatus() {
  return {
    isOnline,
    isAuthenticated: !!currentUser,
    userId: currentUser ? currentUser.uid : 'none',
    lastSync: localStorage.getItem('lastFirebaseSync')
  };
}

// Función para actualizar el indicador de estado de sincronización
function updateSyncStatus() {
  const syncIndicator = document.getElementById('syncIndicator');
  const syncText = document.getElementById('syncText');
  const manualSyncBtn = document.getElementById('manualSyncBtn');
  const forceLoadBtn = document.getElementById('forceLoadBtn');
  
  if (!syncIndicator || !syncText) return;
  
  if (!isOnline) {
    syncIndicator.className = 'w-2 h-2 rounded-full bg-red-500';
    syncText.textContent = 'Sin conexión';
    if (manualSyncBtn) manualSyncBtn.style.display = 'none';
    if (forceLoadBtn) forceLoadBtn.style.display = 'none';
  } else if (!currentUser) {
    syncIndicator.className = 'w-2 h-2 rounded-full bg-yellow-500';
    syncText.textContent = 'Conectando...';
    if (manualSyncBtn) manualSyncBtn.style.display = 'none';
    if (forceLoadBtn) forceLoadBtn.style.display = 'none';
  } else {
    syncIndicator.className = 'w-2 h-2 rounded-full bg-green-500';
    syncText.textContent = 'Conectado';
    if (manualSyncBtn) manualSyncBtn.style.display = 'inline-block';
    if (forceLoadBtn) forceLoadBtn.style.display = 'inline-block';
  }
}

// Inicializar cuando se carga el script
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando Firebase Sync...');
  initializeAuth();
  setupAutoSync();
  updateSyncStatus();
  
  // Actualizar estado de sincronización cada 10 segundos
  setInterval(updateSyncStatus, 10000);
  
  // Configurar botón de sincronización manual
  const manualSyncBtn = document.getElementById('manualSyncBtn');
  if (manualSyncBtn) {
    manualSyncBtn.onclick = () => {
      console.log('🔄 Sincronización manual iniciada...');
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