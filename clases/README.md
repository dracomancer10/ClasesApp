# 🎓 ClasesApp - Sistema de Gestión de Clases

Una aplicación web completa para la gestión de alumnos, horarios y finanzas para profesores.

## ✨ Características

### 📱 **Progressive Web App (PWA)**
- ✅ Instalable como aplicación nativa
- ✅ Funcionamiento offline
- ✅ Notificaciones push
- ✅ Sincronización automática

### 🎯 **Funcionalidades Principales**
- **Dashboard**: Vista general de ingresos y estadísticas
- **Gestión de Alumnos**: Registro y seguimiento de estudiantes
- **Organizador de Horarios**: Planificación semanal de clases
- **Gestor Financiero**: Control de ingresos y gastos
- **Reportes**: Análisis mensuales y anuales

### 📊 **Módulos Incluidos**
1. **Panel de Gestión**: Dashboard principal con métricas
2. **Gestión de Instituciones**: Configuración de centros educativos
3. **Control de Alumnos**: Registro y seguimiento individual
4. **Organizador de Horarios**: Planificación semanal visual
5. **Sistema de Reportes**: Análisis financieros detallados

## 🚀 **Instalación y Uso**

### **Opción 1: Uso Local**
1. Descarga todos los archivos
2. Abre `dashboard.html` en tu navegador
3. ¡Listo para usar!

### **Opción 2: GitHub Pages (Recomendado)**
1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Activa GitHub Pages en Settings > Pages
4. Tu app estará disponible en `tuusuario.github.io/tuproyecto`

### **Opción 3: Netlify**
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto
3. Obtén una URL automáticamente

## 📱 **Instalación como PWA**

### **En Android (Chrome)**
1. Abre la aplicación en Chrome
2. Toca el menú (⋮)
3. Selecciona "Instalar aplicación"
4. Confirma la instalación

### **En iOS (Safari)**
1. Abre la aplicación en Safari
2. Toca el botón compartir (□↑)
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma la instalación

### **En Desktop**
1. Abre la aplicación en Chrome/Edge
2. Busca el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar"

## 🛠️ **Estructura del Proyecto**

```
clases/
├── dashboard.html              # Página principal
├── alumnos.html               # Gestión de alumnos
├── gestor-financiero.html     # Control financiero
├── manifest.json              # Configuración PWA
├── sw.js                      # Service Worker
├── generate-icons.html        # Generador de íconos
├── README.md                  # Este archivo
├── Organizador de Horarios Personal/
│   ├── Organizador de Horarios Personal.html
│   ├── app.js
│   └── styles.css
├── icons/                     # Íconos de la PWA
└── backup_completo_2025-06-26_19-52/
```

## 📋 **Guía de Uso**

### **1. Configuración Inicial**
1. Abre el dashboard
2. Ve a "Institución" > "Registrar institución"
3. Completa los datos de tu centro educativo
4. Configura los días de trabajo y valores

### **2. Gestión de Alumnos**
1. Navega a "Gestión de alumnos"
2. Agrega nuevos estudiantes
3. Registra asistencia y pagos
4. Genera reportes individuales

### **3. Organización de Horarios**
1. Ve a "Organizador de Horarios"
2. Crea actividades y clases
3. Organiza tu semana visualmente
4. Exporta horarios en PDF

### **4. Control Financiero**
1. Accede al "Gestor Financiero"
2. Registra ingresos y gastos
3. Revisa reportes mensuales
4. Analiza tendencias

## 🔧 **Configuración Avanzada**

### **Personalización de Colores**
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #f5f5f5;
    --text-color: #333;
}
```

### **Configuración PWA**
Modifica `manifest.json` para personalizar:
- Nombre de la aplicación
- Colores del tema
- Íconos
- Comportamiento offline

### **Backup y Restauración**
- **Exportar**: Usa "Guardar Todo" para respaldo completo
- **Importar**: Usa "Cargar Todo" para restaurar datos
- **Formato**: Los datos se guardan en JSON

## 📊 **Funcionalidades Offline**

La aplicación funciona completamente offline:
- ✅ Datos guardados localmente
- ✅ Interfaz disponible sin internet
- ✅ Sincronización automática al reconectar
- ✅ Notificaciones de actualizaciones

## 🔔 **Notificaciones**

La PWA puede enviar notificaciones para:
- Recordatorios de clases
- Actualizaciones de la aplicación
- Alertas importantes

## 📈 **Reportes Disponibles**

### **Mensuales**
- Ingresos por institución
- Gastos de pasajes
- Descuentos aplicados
- Ganancia neta

### **Anuales**
- Tendencias de crecimiento
- Comparativas entre meses
- Proyecciones futuras

## 🛡️ **Seguridad y Privacidad**

- ✅ Datos almacenados localmente
- ✅ No se envían datos a servidores externos
- ✅ Respaldos en tu dispositivo
- ✅ Control total de tu información

## 🔄 **Actualizaciones**

### **Automáticas**
- La PWA se actualiza automáticamente
- Notificaciones de nuevas versiones
- Instalación con un clic

### **Manuales**
- Descarga la nueva versión
- Reemplaza los archivos
- Los datos se mantienen

## 📞 **Soporte**

### **Problemas Comunes**

**La app no se instala:**
- Verifica que uses HTTPS o localhost
- Asegúrate de que el manifest.json esté correcto

**No funciona offline:**
- Revisa que el service worker esté registrado
- Verifica la consola del navegador

**Datos no se guardan:**
- Comprueba el almacenamiento local
- Verifica permisos del navegador

## 🎯 **Próximas Funcionalidades**

- [ ] Sincronización con Google Calendar
- [ ] Notificaciones push avanzadas
- [ ] Modo oscuro
- [ ] Exportación a Excel
- [ ] Múltiples monedas
- [ ] Sistema de facturación

## 📄 **Licencia**

Este proyecto es de uso libre para fines educativos y comerciales.

---

**¡Disfruta usando ClasesApp! 🎓✨** 