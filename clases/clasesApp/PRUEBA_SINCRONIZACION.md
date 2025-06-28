# 🧪 Guía para Probar la Sincronización de Firebase

## Prueba 1: Sincronización básica

### Paso 1: Preparar dos dispositivos
1. **Dispositivo A**: Tu computadora
2. **Dispositivo B**: Tu celular o tablet

### Paso 2: Abrir la aplicación
1. En ambos dispositivos, abre la aplicación en el navegador
2. Ve a `https://tu-usuario.github.io/tu-repositorio/`
3. Espera a que aparezca el indicador de sincronización (debe ser verde)

### Paso 3: Agregar datos en Dispositivo A
1. Ve a "Gestión de alumnos"
2. Agrega un nuevo alumno con:
   - Nombre: "Alumno Prueba"
   - Teléfono: "123456789"
   - Valor de clase: "50"
3. Guarda el alumno
4. Observa el indicador de sincronización (debe mostrar "Sincronizado")

### Paso 4: Verificar en Dispositivo B
1. En el Dispositivo B, ve a "Gestión de alumnos"
2. Deberías ver el "Alumno Prueba" en la lista
3. Si no aparece, haz clic en "🔄 Sincronizar"
4. Recarga la página si es necesario

## Prueba 2: Sincronización offline

### Paso 1: Desconectar internet
1. En el Dispositivo A, desconecta internet (WiFi o datos móviles)
2. Observa el indicador de sincronización (debe ser rojo)

### Paso 2: Agregar datos offline
1. Agrega otro alumno: "Alumno Offline"
2. Los datos se guardan localmente
3. El indicador muestra "Sin conexión"

### Paso 3: Restaurar conexión
1. Conecta internet nuevamente
2. Observa el indicador (debe cambiar a verde)
3. Los datos se sincronizan automáticamente

### Paso 4: Verificar sincronización
1. En el Dispositivo B, verifica que aparezca "Alumno Offline"
2. Haz clic en "🔄 Sincronizar" si es necesario

## Prueba 3: Sincronización de instituciones

### Paso 1: Agregar institución
1. En Dispositivo A, ve al Dashboard
2. Haz clic en "Institución" → "Registrar institución"
3. Completa los datos:
   - Nombre: "Instituto Prueba"
   - Valor: "100"
   - Pasaje: "20"
   - Días: Lunes, Miércoles, Viernes
4. Guarda la institución

### Paso 2: Verificar en otro dispositivo
1. En Dispositivo B, ve al Dashboard
2. Haz clic en "Institución" → "Panel de instituciones"
3. Deberías ver "Instituto Prueba" en la lista

## Prueba 4: Sincronización de horarios

### Paso 1: Configurar horario
1. En Dispositivo A, ve a "Organizador de Horarios"
2. Agrega algunas actividades en diferentes días
3. Guarda el horario

### Paso 2: Verificar sincronización
1. En Dispositivo B, ve a "Organizador de Horarios"
2. Deberías ver las mismas actividades
3. Modifica una actividad y verifica que se sincronice

## Prueba 5: Sincronización de gestor financiero

### Paso 1: Agregar transacción
1. En Dispositivo A, ve a "Gestor Financiero"
2. Agrega una transacción:
   - Tipo: Ingreso
   - Descripción: "Pago de clases"
   - Monto: "500"
   - Moneda: "USD"
3. Guarda la transacción

### Paso 2: Verificar en otro dispositivo
1. En Dispositivo B, ve a "Gestor Financiero"
2. Deberías ver la transacción "Pago de clases"
3. Verifica que los totales se calculen correctamente

## Indicadores de estado

### 🟢 Verde - "Sincronizado"
- ✅ Conexión a internet activa
- ✅ Firebase conectado
- ✅ Datos sincronizados
- ✅ Botón de sincronización manual disponible

### 🟡 Amarillo - "Conectando..."
- ⏳ Conectando a Firebase
- ⏳ Esperando autenticación
- ⏳ Normal al cargar la página

### 🔴 Rojo - "Sin conexión"
- ❌ Sin conexión a internet
- ❌ Datos guardados localmente
- ❌ Se sincronizarán cuando haya conexión

## Solución de problemas

### Los datos no aparecen:
1. **Verifica la conexión**: Asegúrate de tener internet
2. **Espera la sincronización**: Puede tomar unos segundos
3. **Sincronización manual**: Haz clic en "🔄 Sincronizar"
4. **Recarga la página**: Presiona F5 o Ctrl+R
5. **Limpia el cache**: Ctrl+Shift+R para recarga completa

### Error de Firebase:
1. **Revisa la consola**: Presiona F12 y ve a "Console"
2. **Verifica las credenciales**: Asegúrate de que `firebase-config.js` tenga las credenciales correctas
3. **Revisa las reglas**: Verifica que Firestore permita lectura/escritura

### Indicador no aparece:
1. **Verifica el archivo**: Asegúrate de que `firebase-config.js` esté en la carpeta correcta
2. **Revisa las importaciones**: Verifica que los scripts estén incluidos en el HTML
3. **Limpia el cache**: Recarga la página con Ctrl+Shift+R

## Comandos útiles para debugging

### En la consola del navegador (F12):
```javascript
// Verificar estado de sincronización
window.FirebaseSync.getSyncStatus()

// Forzar sincronización
window.FirebaseSync.syncDataToFirebase()

// Cargar datos desde Firebase
window.FirebaseSync.loadDataFromFirebase()

// Ver datos locales
console.log('Instituciones:', JSON.parse(localStorage.getItem('clases_institutions')))
console.log('Alumnos:', JSON.parse(localStorage.getItem('alumnos_particulares')))
```

## Resultados esperados

✅ **Prueba exitosa si**:
- Los datos aparecen en ambos dispositivos
- El indicador de sincronización es verde
- Los cambios se reflejan automáticamente
- La aplicación funciona offline

❌ **Problema si**:
- Los datos no aparecen en el otro dispositivo
- El indicador permanece rojo o amarillo
- Aparecen errores en la consola
- La sincronización manual no funciona

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) y comparte cualquier error que veas. 