// Sistema de sincronización de datos para ClasesApp
class DataSync {
    constructor() {
        this.storageKeys = [
            'alumnos_particulares',
            'asistencia_alumnos', 
            'pagos_alumnos',
            'weekly-schedule',
            'clases_institutions',
            'clases_attendance',
            'clases_selectedMonths',
            'clases_currentYear',
            'clases_annualReportPeriod',
            'gestor_financiero_transactions'
        ];
    }

    // Exportar todos los datos
    exportAllData() {
        const data = {};
        
        this.storageKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    data[key] = JSON.parse(value);
                } catch (e) {
                    data[key] = value; // Guardar como string si no es JSON
                }
            }
        });

        // Agregar metadata
        data._metadata = {
            exportDate: new Date().toISOString(),
            version: '1.0.0',
            totalKeys: Object.keys(data).length - 1 // -1 por metadata
        };

        return data;
    }

    // Importar datos
    importData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Datos inválidos');
        }

        let importedCount = 0;
        const errors = [];

        Object.keys(data).forEach(key => {
            if (key === '_metadata') return; // Saltar metadata

            try {
                const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
                localStorage.setItem(key, value);
                importedCount++;
            } catch (e) {
                errors.push(`Error importando ${key}: ${e.message}`);
            }
        });

        return {
            success: errors.length === 0,
            importedCount,
            errors
        };
    }

    // Generar archivo de backup
    generateBackupFile() {
        const data = this.exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clasesapp_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Restaurar desde archivo
    async restoreFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const result = this.importData(data);
                    resolve(result);
                } catch (e) {
                    reject(new Error('Archivo inválido: ' + e.message));
                }
            };
            
            reader.onerror = () => reject(new Error('Error leyendo archivo'));
            reader.readAsText(file);
        });
    }

    // Sincronizar con otro dispositivo (simulado)
    async syncWithCloud() {
        // Simular sincronización con la nube
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.exportAllData();
                // En una implementación real, aquí se subiría a un servidor
                console.log('Datos sincronizados con la nube:', data);
                resolve({
                    success: true,
                    message: 'Datos sincronizados exitosamente',
                    timestamp: new Date().toISOString()
                });
            }, 2000);
        });
    }

    // Verificar integridad de datos
    verifyDataIntegrity() {
        const issues = [];
        
        this.storageKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    JSON.parse(value);
                } catch (e) {
                    issues.push(`Datos corruptos en ${key}: ${e.message}`);
                }
            }
        });

        return {
            hasIssues: issues.length > 0,
            issues,
            totalKeys: this.storageKeys.length,
            validKeys: this.storageKeys.length - issues.length
        };
    }

    // Limpiar datos antiguos
    cleanupOldData() {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - 6); // 6 meses atrás
        
        let cleanedCount = 0;
        
        this.storageKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    const data = JSON.parse(value);
                    // Aquí se implementaría la lógica de limpieza específica
                    // Por ahora solo contamos
                    cleanedCount++;
                } catch (e) {
                    // Datos corruptos, eliminarlos
                    localStorage.removeItem(key);
                    cleanedCount++;
                }
            }
        });

        return {
            cleanedCount,
            message: 'Limpieza completada'
        };
    }

    // Obtener estadísticas de datos
    getDataStats() {
        const stats = {
            totalKeys: this.storageKeys.length,
            usedKeys: 0,
            totalSize: 0,
            lastModified: null
        };

        this.storageKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                stats.usedKeys++;
                stats.totalSize += value.length;
                
                // Intentar obtener fecha de modificación
                try {
                    const data = JSON.parse(value);
                    if (data.lastModified) {
                        const date = new Date(data.lastModified);
                        if (!stats.lastModified || date > stats.lastModified) {
                            stats.lastModified = date;
                        }
                    }
                } catch (e) {
                    // Ignorar errores de parsing
                }
            }
        });

        return stats;
    }
}

// Función global para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `sync-notification ${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '16px';
    notification.style.borderRadius = '12px';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.5s ease';
    
    // Colores según tipo
    const colors = {
        success: 'linear-gradient(45deg, #4CAF50, #45a049)',
        error: 'linear-gradient(45deg, #f44336, #d32f2f)',
        warning: 'linear-gradient(45deg, #ff9800, #f57c00)',
        info: 'linear-gradient(45deg, #2196F3, #1976D2)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <span style="font-size: 24px;">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <div>
                <div style="font-weight: bold;">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Exportar para uso global
window.DataSync = DataSync;
window.showNotification = showNotification; 