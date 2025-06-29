# Instrucciones para Probar la Aplicación

## ✅ Problemas Resueltos

### 1. **Error de `inst` no definido**
- ❌ **ANTES:** Error en consola: `Uncaught ReferenceError: inst is not defined`
- ✅ **AHORA:** Error eliminado completamente

### 2. **Recarga infinita**
- ❌ **ANTES:** La página se recargaba infinitamente
- ✅ **AHORA:** Sincronización automática deshabilitada, solo sincronización manual

### 3. **Datos diferentes entre navegadores**
- ❌ **ANTES:** Cada navegador mostraba datos diferentes
- ✅ **AHORA:** ID de usuario fijo basado en dominio, datos compartidos

## 🧪 Cómo Probar

### **Paso 1: Limpiar Caché**
1. **Chrome/Edge:** Ctrl + Shift + R
2. **Firefox:** Ctrl + F5
3. **Safari:** Cmd + Option + R

### **Paso 2: Abrir la Aplicación**
- **URL:** https://dracomancer10.github.io/ClasesApp/
- **Debería redirigir automáticamente a:** https://dracomancer10.github.io/ClasesApp/dashboard.html

### **Paso 3: Verificar que NO hay errores**
1. **Abrir consola:** F12 → Console
2. **Verificar que NO aparece:**
   - ❌ `Uncaught ReferenceError: inst is not defined`
   - ❌ Recargas infinitas
   - ❌ Errores de Firebase

### **Paso 4: Probar en Diferentes Navegadores**
1. **Abrir Chrome** → Ir a la URL
2. **Abrir Firefox** → Ir a la URL
3. **Abrir Edge** → Ir a la URL
4. **Verificar que todos muestran los mismos datos**

### **Paso 5: Probar en Móvil**
1. **Abrir en celular:** https://dracomancer10.github.io/ClasesApp/
2. **Verificar que:**
   - ✅ Se ve bien (responsivo)
   - ✅ No se recarga infinitamente
   - ✅ Los datos son los mismos que en PC

## 🔧 Sincronización Manual

Si necesitas sincronizar datos entre dispositivos:

1. **En PC:** Hacer cambios → Hacer clic en "🔄 Sincronizar"
2. **En móvil:** Recargar página → Los datos deberían aparecer

## 📱 Instalación como PWA

### **Chrome/Edge:**
1. Abrir la aplicación
2. Tocar ⋮ (menú)
3. Seleccionar "Instalar aplicación"

### **Safari:**
1. Abrir la aplicación
2. Tocar 📤 (compartir)
3. Seleccionar "Añadir a pantalla de inicio"

## 🚨 Si algo no funciona

### **Problema:** No veo los cambios
- **Solución:** Esperar 5-10 minutos para que GitHub Pages actualice

### **Problema:** Sigue recargándose
- **Solución:** Limpiar caché del navegador (Ctrl + Shift + R)

### **Problema:** Datos diferentes entre navegadores
- **Solución:** Verificar que estás usando la misma URL en ambos

### **Problema:** Error en consola
- **Solución:** Recargar la página y verificar que no hay errores

## 📞 Contacto

Si encuentras algún problema, revisa:
1. La consola del navegador (F12)
2. Que estés usando la URL correcta
3. Que hayas limpiado la caché

**URL de la aplicación:** https://dracomancer10.github.io/ClasesApp/ 