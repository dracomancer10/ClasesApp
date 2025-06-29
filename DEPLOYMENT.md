# 🚀 Guía de Deployment - GitHub Pages + PWA

## 📋 **Paso a Paso para Subir tu App a Internet**

### **Paso 1: Preparar los Íconos**

1. **Abre el generador de íconos:**
   - Abre `generate-icons.html` en tu navegador
   - Haz clic en "Descargar Todos"
   - Mueve todos los archivos descargados a la carpeta `icons/`

2. **Verifica que tengas estos archivos:**
   ```
   icons/
   ├── icon-72x72.png
   ├── icon-96x96.png
   ├── icon-128x128.png
   ├── icon-144x144.png
   ├── icon-152x152.png
   ├── icon-192x192.png
   ├── icon-384x384.png
   └── icon-512x512.png
   ```

### **Paso 2: Crear Repositorio en GitHub**

1. **Ve a GitHub.com** y crea una cuenta si no tienes
2. **Crea un nuevo repositorio:**
   - Haz clic en "New repository"
   - Nombre: `clases-app` (o el que prefieras)
   - Descripción: "Sistema de gestión de clases y horarios"
   - Marca como **Public**
   - **NO** inicialices con README (ya tienes uno)

### **Paso 3: Subir Archivos a GitHub**

#### **Opción A: Usando GitHub Desktop (Recomendado)**
1. Descarga [GitHub Desktop](https://desktop.github.com/)
2. Instala y conecta con tu cuenta
3. Haz clic en "Clone a repository"
4. Selecciona tu repositorio
5. Arrastra todos los archivos de la carpeta `clases/` al repositorio
6. Escribe un mensaje de commit: "Initial commit - ClasesApp PWA"
7. Haz clic en "Commit to main"
8. Haz clic en "Push origin"

#### **Opción B: Usando Git desde Terminal**
```bash
# En la carpeta de tu proyecto
git init
git add .
git commit -m "Initial commit - ClasesApp PWA"
git branch -M main
git remote add origin https://github.com/TUUSUARIO/TUREPO.git
git push -u origin main
```

### **Paso 4: Activar GitHub Pages**

1. **Ve a tu repositorio en GitHub**
2. **Haz clic en "Settings"** (pestaña)
3. **Busca "Pages"** en el menú lateral
4. **En "Source" selecciona:**
   - Branch: `main` o `master`
   - Folder: `/ (root)`
5. **Haz clic en "Save"**
6. **Espera unos minutos** para que se active

### **Paso 5: Verificar la Aplicación**

1. **Tu app estará disponible en:**
   ```
   https://TUUSUARIO.github.io/TUREPO/
   ```

2. **Prueba las funcionalidades:**
   - ✅ Abre en diferentes navegadores
   - ✅ Prueba en móvil
   - ✅ Verifica que se pueda instalar como PWA
   - ✅ Prueba el funcionamiento offline

## 📱 **Instalación como PWA**

### **En Android:**
1. Abre la URL en Chrome
2. Toca el menú (⋮)
3. Selecciona "Instalar aplicación"
4. Confirma la instalación

### **En iOS:**
1. Abre la URL en Safari
2. Toca el botón compartir (□↑)
3. Selecciona "Añadir a pantalla de inicio"

### **En Desktop:**
1. Abre en Chrome/Edge
2. Busca el ícono de instalación en la barra
3. Haz clic en "Instalar"

## 🔧 **Solución de Problemas**

### **La app no se instala como PWA:**
- ✅ Verifica que uses HTTPS (GitHub Pages lo proporciona)
- ✅ Asegúrate de que `manifest.json` esté en la raíz
- ✅ Verifica que `sw.js` esté en la raíz
- ✅ Comprueba que los íconos existan

### **No funciona offline:**
- ✅ Abre las herramientas de desarrollador (F12)
- ✅ Ve a la pestaña "Application"
- ✅ Verifica que el Service Worker esté registrado
- ✅ Revisa la consola para errores

### **Los íconos no aparecen:**
- ✅ Verifica que la carpeta `icons/` esté subida
- ✅ Comprueba que las rutas en `manifest.json` sean correctas
- ✅ Asegúrate de que los archivos tengan los nombres exactos

## 🔄 **Actualizaciones Futuras**

### **Para actualizar la app:**
1. Modifica los archivos localmente
2. Sube los cambios a GitHub:
   ```bash
   git add .
   git commit -m "Actualización: nueva funcionalidad"
   git push
   ```
3. GitHub Pages se actualiza automáticamente

### **Para los usuarios:**
- La PWA se actualiza automáticamente
- Aparecerá una notificación de actualización
- Los datos se mantienen

## 🌐 **Dominio Personalizado (Opcional)**

### **Si quieres tu propio dominio:**
1. Compra un dominio (ej: `tusclases.com`)
2. En GitHub Pages Settings:
   - Agrega tu dominio en "Custom domain"
   - Marca "Enforce HTTPS"
3. Configura DNS con tu proveedor de dominio

## 📊 **Analytics (Opcional)**

### **Para agregar Google Analytics:**
1. Crea una cuenta en [Google Analytics](https://analytics.google.com/)
2. Obtén tu ID de seguimiento
3. Agrega este código en el `<head>` de todos los HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

## ✅ **Checklist Final**

- [ ] Íconos generados y en carpeta `icons/`
- [ ] Repositorio creado en GitHub
- [ ] Archivos subidos al repositorio
- [ ] GitHub Pages activado
- [ ] App funciona en la URL
- [ ] PWA se instala correctamente
- [ ] Funciona offline
- [ ] Notificaciones funcionan
- [ ] Datos se guardan localmente

## 🎉 **¡Listo!**

Tu aplicación ahora está:
- ✅ **En internet** y accesible desde cualquier dispositivo
- ✅ **Instalable como PWA** en móviles y desktop
- ✅ **Funcionando offline** con sincronización automática
- ✅ **Actualizable** fácilmente desde GitHub

**¡Disfruta de tu ClasesApp en la nube! 🚀✨** 