# 🎓 ClasesApp - Sistema de Gestión de Clases

Sistema completo de gestión de alumnos, horarios y finanzas para profesores, desarrollado como Progressive Web App (PWA).

## ✨ Características

- 📊 **Dashboard completo** con estadísticas y gráficos
- 👥 **Gestión de alumnos** con asistencia y pagos
- 📅 **Organizador de horarios** semanal
- 💰 **Gestor financiero** con reportes
- 📱 **PWA instalable** en móviles y desktop
- 🔄 **Sincronización de datos** entre dispositivos
- 💾 **Sistema de backup/restore**
- 📈 **Reportes PDF** automáticos
- 🌐 **Funciona offline**

## 🚀 Instalación

### Opción 1: Acceso Web
1. Ve a la URL de la aplicación
2. La aplicación se carga automáticamente
3. Para instalarla como app, sigue las instrucciones en pantalla

### Opción 2: Instalación PWA

#### En Chrome/Edge (Android/Desktop):
1. Abre la aplicación en el navegador
2. Toca el menú (⋮) en la esquina superior derecha
3. Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"
4. Confirma la instalación

#### En Safari (iOS):
1. Abre la aplicación en Safari
2. Toca el botón de compartir (📤)
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma la instalación

#### En Firefox:
1. Abre la aplicación en Firefox
2. Toca el menú (⋮)
3. Selecciona "Instalar aplicación"
4. Confirma la instalación

## 📱 Uso en Móvil

### Navegación
- **Botón hamburguesa**: Toca el botón ☰ en la esquina superior izquierda
- **Cerrar menú**: Toca fuera del menú o presiona Escape
- **Navegación táctil**: Todos los botones están optimizados para touch

### Sincronización de Datos
1. **Sincronización automática**: Los datos se guardan localmente
2. **Backup manual**: Usa el botón "💾 Crear Backup" para exportar datos
3. **Restaurar datos**: Usa "📂 Restaurar Backup" para importar desde otro dispositivo

## 🔄 Sincronización Entre Dispositivos

### Método 1: Backup/Restore
1. En el dispositivo origen: Toca "💾 Crear Backup"
2. Se descargará un archivo JSON
3. Transfiere el archivo al nuevo dispositivo
4. En el nuevo dispositivo: Toca "📂 Restaurar Backup"
5. Selecciona el archivo JSON descargado

### Método 2: Sincronización Manual
1. Toca "🔄 Sincronizar Datos" en ambos dispositivos
2. Los datos se sincronizarán automáticamente

## 🛠️ Solución de Problemas

### La aplicación no se instala
- **Verifica el navegador**: Asegúrate de usar Chrome, Edge, Safari o Firefox
- **Conexión HTTPS**: La PWA requiere conexión segura
- **Limpiar caché**: Borra el caché del navegador e intenta de nuevo
- **Actualizar navegador**: Asegúrate de tener la versión más reciente

### Los datos no aparecen
- **Verificar localStorage**: Asegúrate de que el navegador soporte localStorage
- **Restaurar backup**: Usa la función de restore si tienes un backup
- **Limpiar datos**: En casos extremos, limpia los datos del navegador

### Vista móvil desajustada
- **Rotar pantalla**: Intenta cambiar la orientación
- **Actualizar página**: Recarga la aplicación
- **Verificar zoom**: Asegúrate de que el zoom esté al 100%

### Problemas de sincronización
- **Verificar archivo**: Asegúrate de que el archivo de backup sea válido
- **Reintentar**: Vuelve a intentar la sincronización
- **Backup manual**: Usa la función de backup/restore como alternativa

## 📁 Estructura de Archivos

```
clases/
├── index.html              # Página de bienvenida
├── dashboard.html          # Dashboard principal
├── alumnos.html           # Gestión de alumnos
├── gestor-financiero.html # Gestor financiero
├── manifest.json          # Configuración PWA
├── sw.js                  # Service Worker
├── sync.js               # Sistema de sincronización
├── icons/                # Íconos PWA
└── Organizador de Horarios Personal/
    └── Organizador de Horarios Personal.html
```

## 🔧 Configuración Técnica

### Requisitos del Navegador
- **Chrome**: Versión 67+
- **Firefox**: Versión 60+
- **Safari**: Versión 11.1+
- **Edge**: Versión 79+

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos con Tailwind CSS
- **JavaScript**: Lógica de aplicación
- **PWA**: Service Worker y Manifest
- **Chart.js**: Gráficos interactivos
- **jsPDF**: Generación de reportes PDF

## 📊 Datos Almacenados

La aplicación guarda los siguientes datos localmente:
- Lista de alumnos
- Asistencia y pagos
- Horarios semanales
- Transacciones financieras
- Configuraciones del sistema

## 🔒 Privacidad y Seguridad

- **Datos locales**: Toda la información se guarda en tu dispositivo
- **Sin servidor**: No se envían datos a servidores externos
- **Backup seguro**: Los archivos de backup son locales
- **Cifrado**: Los datos se almacenan de forma segura

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa esta documentación**
2. **Verifica la configuración del navegador**
3. **Intenta en otro navegador**
4. **Crea un backup antes de hacer cambios**

## 📝 Changelog

### Versión 1.0.0 (Enero 2025)
- ✅ Dashboard completo con estadísticas
- ✅ Gestión de alumnos
- ✅ Organizador de horarios
- ✅ Gestor financiero
- ✅ Sistema PWA
- ✅ Sincronización de datos
- ✅ Backup y restore
- ✅ Reportes PDF
- ✅ Diseño responsive

---

**Desarrollado con ❤️ para profesores** 