class ResultPresenter {
    /**
     * Muestra los resultados del conteo
     * @param {Object} results - Resultados del análisis y conteo
     * @returns {Object} - Resultados formateados para mostrar
     */
    displayResults(results) {
      // Simplemente devolvemos los resultados tal como están
      // La presentación visual se maneja en el cliente
      return results;
    }
  
    /**
     * Exporta los resultados a un formato específico
     * @param {Object} results - Resultados del análisis y conteo
     * @param {string} format - Formato de exportación (json, csv, etc)
     * @returns {string} - Resultados formateados para exportar
     */
    exportResults(results, format = 'json') {
      if (format === 'json') {
        return JSON.stringify(results, null, 2);
      } else if (format === 'csv') {
        // Implementación básica para CSV
        let csv = 'Clase,Método,Líneas de Código\n';
        
        results.classes.forEach(cls => {
          // Línea para la clase
          csv += `${cls.name},Total,${cls.loc}\n`;
          
          // Líneas para cada método
          cls.methods.forEach(method => {
            csv += `${cls.name},${method.name},${method.loc}\n`;
          });
        });
        
        return csv;
      }
      
      // Formato no soportado
      throw new Error(`Formato no soportado: ${format}`);
    }
  }
  
  module.exports = ResultPresenter;