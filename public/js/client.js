document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('jsFile');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const resultsContent = document.getElementById('resultsContent');
  const loadingResults = document.getElementById('loadingResults');
  const errorResults = document.getElementById('errorResults');
  const emptyResults = document.getElementById('emptyResults');
  const sidebarSummary = document.getElementById('sidebarSummary');
  const sidebarStats = document.getElementById('sidebarStats');
  const mainPanel = document.getElementById('main-panel');
  const resultsContainer = document.getElementById('results-container');
  
  let currentResults = null;
  
  // Manejar el clic en el botón de analizar
  analyzeBtn.addEventListener('click', async () => {
    if (!fileInput.files.length) {
      showError('Por favor, selecciona un archivo JavaScript');
      return;
    }
    
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Mostrar indicador de carga
      showLoading();
      
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar el archivo');
      }
      
      currentResults = await response.json();
      displayResults(currentResults);
      updateSidebar(currentResults);
      
      // Mostrar el sidebar y hacer scroll a los resultados
      document.body.classList.remove('sidebar-hidden');
      
      // Scroll automático a los resultados con animación suave
      setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      
    } catch (error) {
      showError(error.message);
    } finally {
      // Ocultar indicador de carga
      hideLoading();
    }
  });
  
  // Manejar el clic en el botón de exportar JSON
  exportJsonBtn.addEventListener('click', () => {
    if (!currentResults) {
      showError('No hay resultados para exportar');
      return;
    }
    
    exportResults('json');
  });
  
  // Manejar el clic en el botón de exportar CSV
  exportCsvBtn.addEventListener('click', () => {
    if (!currentResults) {
      showError('No hay resultados para exportar');
      return;
    }
    
    exportResults('csv');
  });
  
  // Función para exportar resultados
  function exportResults(format) {
    let dataStr, mimeType, extension;
    
    if (format === 'json') {
      dataStr = JSON.stringify(currentResults, null, 2);
      mimeType = 'application/json;charset=utf-8';
      extension = 'json';
    } else if (format === 'csv') {
      dataStr = convertToCSV(currentResults);
      mimeType = 'text/csv;charset=utf-8';
      extension = 'csv';
    } else {
      showError('Formato no soportado');
      return;
    }
    
    const dataUri = 'data:' + mimeType + ',' + encodeURIComponent(dataStr);
    const exportFileName = 'loc-analysis-' + new Date().toISOString().slice(0, 10) + '.' + extension;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    // Mostrar notificación de éxito
    showNotification(`Archivo exportado como ${extension.toUpperCase()} correctamente`);
  }
  
  // Función para mostrar notificación
  function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Función para convertir los resultados a CSV
  function convertToCSV(results) {
    // Encabezados
    let csv = 'Clase,Método,Líneas de Código\n';
    
    // Línea para el total
    csv += `Total,General,${results.totalLOC}\n`;
    
    // Datos para cada clase y método
    if (results.classes && results.classes.length > 0) {
      results.classes.forEach(cls => {
        // Línea para la clase
        csv += `${cls.name},Total,${cls.loc}\n`;
        
        // Líneas para cada método
        if (cls.methods && cls.methods.length > 0) {
          cls.methods.forEach(method => {
            csv += `${cls.name},${method.name},${method.loc}\n`;
          });
        }
      });
    }
    
    return csv;
  }
  
  // Función para mostrar los resultados en el panel principal
  function displayResults(results) {
    // Ocultar mensaje de vacío
    emptyResults.style.display = 'none';
    
    // Mostrar contenido
    resultsContent.style.display = 'block';
    
    // Crear contenido HTML para los resultados
    let html = '<div class="fade-in">';
    
    html += `<h2 id="results-heading">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
      Resultados del Análisis
    </h2>`;
    
    // Detalles de clases
    if (results.classes && results.classes.length > 0) {
      results.classes.forEach((cls, index) => {
        html += `
          <div class="class-card fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="class-header" onclick="toggleClassMethods(${index})">
              <div class="class-name">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                ${cls.name}
              </div>
              <div class="class-info">
                <div class="class-info-item">
                  <span class="info-label">LOC:</span>
                  <span class="info-value">${cls.loc}</span>
                </div>
                <div class="class-info-item">
                  <span class="info-label">Métodos:</span>
                  <span class="info-value">${cls.totalMethods}</span>
                </div>
                <div class="class-info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            <div class="class-methods" id="class-methods-${index}" style="display: none;">
        `;
        
        if (cls.methods && cls.methods.length > 0) {
          cls.methods.forEach(method => {
            html += `
              <div class="method-item">
                <div class="method-name">${method.name}()</div>
                <div class="method-loc">${method.loc} LOC</div>
              </div>
            `;
          });
        } else {
          html += '<p>No se encontraron métodos en esta clase.</p>';
        }
        
        html += `
            </div>
          </div>
        `;
      });
    } else {
      html += '<p>No se encontraron clases en el archivo.</p>';
    }
    
    html += '</div>';
    
    resultsContent.innerHTML = html;
    
    // Agregar función global para mostrar/ocultar métodos
    window.toggleClassMethods = function(index) {
      const methodsElement = document.getElementById(`class-methods-${index}`);
      if (methodsElement) {
        const isHidden = methodsElement.style.display === 'none';
        methodsElement.style.display = isHidden ? 'block' : 'none';
        
        // Cambiar el ícono de flecha
        const classCard = methodsElement.parentElement;
        const arrowIcon = classCard.querySelector('.class-info-item svg');
        
        if (isHidden) {
          arrowIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
        } else {
          arrowIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
        }
      }
    };
  }
  
  // Función para actualizar la información del sidebar
  function updateSidebar(results) {
    // Actualizar resumen
    let summaryHtml = '';
    summaryHtml += `<div class="stat-item">
      <span class="stat-label">Archivo:</span>
      <span class="stat-value">${fileInput.files[0].name}</span>
    </div>`;
    summaryHtml += `<div class="stat-item">
      <span class="stat-label">Tamaño:</span>
      <span class="stat-value">${(fileInput.files[0].size / 1024).toFixed(2)} KB</span>
    </div>`;
    summaryHtml += `<div class="stat-item">
      <span class="stat-label">Fecha análisis:</span>
      <span class="stat-value">${new Date().toLocaleString()}</span>
    </div>`;
    sidebarSummary.innerHTML = summaryHtml;
    
    // Actualizar estadísticas
    let statsHtml = '';
    statsHtml += `<div class="stat-item">
      <span class="stat-label">Total LOC:</span>
      <span class="stat-value highlight-value">${results.totalLOC}</span>
    </div>`;
    
    if (results.classes && results.classes.length > 0) {
      statsHtml += `<div class="stat-item">
        <span class="stat-label">Total clases:</span>
        <span class="stat-value">${results.classes.length}</span>
      </div>`;
      
      // Contar el total de métodos
      const totalMethods = results.classes.reduce((sum, cls) => sum + cls.totalMethods, 0);
      statsHtml += `<div class="stat-item">
        <span class="stat-label">Total métodos:</span>
        <span class="stat-value">${totalMethods}</span>
      </div>`;
      
      // Promedio de LOC por clase
      const avgLocPerClass = (results.totalLOC / results.classes.length).toFixed(2);
      statsHtml += `<div class="stat-item">
        <span class="stat-label">Promedio LOC por clase:</span>
        <span class="stat-value">${avgLocPerClass}</span>
      </div>`;
      
      // Promedio de métodos por clase
      const avgMethodsPerClass = (totalMethods / results.classes.length).toFixed(2);
      statsHtml += `<div class="stat-item">
        <span class="stat-label">Promedio métodos por clase:</span>
        <span class="stat-value">${avgMethodsPerClass}</span>
      </div>`;
      
      // Clase más grande
      const largestClass = results.classes.reduce((max, cls) => cls.loc > max.loc ? cls : max, results.classes[0]);
      statsHtml += `<div class="stat-item">
        <span class="stat-label">Clase más grande:</span>
        <span class="stat-value">${largestClass.name} (${largestClass.loc} LOC)</span>
      </div>`;
    }
    
    sidebarStats.innerHTML = statsHtml;
  }
  
  // Función para mostrar el error
  function showError(message) {
    errorResults.textContent = message;
    errorResults.style.display = 'block';
    resultsContent.style.display = 'none';
    emptyResults.style.display = 'none';
  }
  
  // Función para mostrar el indicador de carga
  function showLoading() {
    loadingResults.style.display = 'block';
    resultsContent.style.display = 'none';
    errorResults.style.display = 'none';
    emptyResults.style.display = 'none';
    analyzeBtn.disabled = true;
    analyzeBtn.classList.remove('pulse-animation');
  }
  
  // Función para ocultar el indicador de carga
  function hideLoading() {
    loadingResults.style.display = 'none';
    analyzeBtn.disabled = false;
  }
  
  // Añadir estilos de notificación dinámicamente
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background-color: var(--success-color);
      color: white;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      box-shadow: var(--shadow-md);
      z-index: 1000;
    }
    
    .notification svg {
      margin-right: 10px;
    }
    
    .fade-out {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s, transform 0.3s;
    }
  `;
  document.head.appendChild(style);
});