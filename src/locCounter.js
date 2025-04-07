class LOCCounter {
    /**
     * Cuenta el total de líneas de código
     * @param {string} code - Código JavaScript
     * @returns {number} - Total de líneas de código
     */
    countTotalLOC(code) {
      // Dividir el código en líneas
      const lines = code.split('\n');
      
      // Filtrar líneas vacías y comentarios
      const codeLines = lines.filter(line => {
        const trimmedLine = line.trim();
        return trimmedLine !== '' && 
               !trimmedLine.startsWith('//') && 
               !trimmedLine.startsWith('/*') && 
               !trimmedLine.startsWith('*');
      });
      
      return codeLines.length;
    }
  
    /**
     * Cuenta las líneas de código por clase
     * @param {string} classCode - Código de la clase
     * @returns {number} - Líneas de código de la clase
     */
    countClassLOC(classCode) {
      return this.countTotalLOC(classCode);
    }
  
    /**
     * Cuenta las líneas de código por método
     * @param {string} methodCode - Código del método
     * @returns {number} - Líneas de código del método
     */
    countMethodLOC(methodCode) {
      return this.countTotalLOC(methodCode);
    }
  }
  
  module.exports = LOCCounter;