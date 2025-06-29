// Script para limpiar completamente la base de datos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Función para limpiar todos los datos de Firebase
async function cleanFirebaseDatabase() {
  try {
    console.log('🔐 Iniciando autenticación anónima...');
    await signInAnonymously(auth);
    
    console.log('🗑️ Limpiando base de datos de Firebase...');
    
    // Obtener todos los documentos de la colección 'users'
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    let deletedCount = 0;
    
    // Eliminar cada documento
    for (const userDoc of usersSnapshot.docs) {
      await deleteDoc(userDoc.ref);
      deletedCount++;
      console.log(`✅ Eliminado documento: ${userDoc.id}`);
    }
    
    console.log(`🎉 Limpieza completada. Se eliminaron ${deletedCount} documentos.`);
    
    // Limpiar también el localStorage local
    const keysToRemove = [
      'clases_institutions',
      'clases_attendance', 
      'clases_selectedMonths',
      'clases_currentYear',
      'clases_annualReportPeriod',
      'alumnos_particulares',
      'asistencia_alumnos',
      'pagos_alumnos',
      'weekly-schedule',
      'gestor_financiero_transactions',
      'lastFirebaseSync'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 localStorage local también limpiado.');
    console.log('✨ Base de datos completamente limpia. Puedes empezar desde cero.');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

// Función para mostrar el estado actual de la base de datos
async function showDatabaseStatus() {
  try {
    console.log('🔍 Verificando estado actual de la base de datos...');
    
    await signInAnonymously(auth);
    
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    console.log(`📊 Estado actual: ${usersSnapshot.size} documentos en la base de datos`);
    
    if (usersSnapshot.size > 0) {
      console.log('📋 Documentos encontrados:');
      usersSnapshot.docs.forEach((doc, index) => {
        console.log(`  ${index + 1}. ID: ${doc.id}`);
        console.log(`     Datos:`, doc.data());
      });
    } else {
      console.log('✅ La base de datos está vacía.');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar estado:', error);
  }
}

// Exportar funciones para uso global
window.FirebaseCleanup = {
  cleanFirebaseDatabase,
  showDatabaseStatus
};

// Ejecutar limpieza automáticamente si se llama desde la consola
if (typeof window !== 'undefined') {
  console.log('🧹 Script de limpieza de Firebase cargado.');
  console.log('Para limpiar la base de datos, ejecuta: FirebaseCleanup.cleanFirebaseDatabase()');
  console.log('Para ver el estado actual, ejecuta: FirebaseCleanup.showDatabaseStatus()');
} 