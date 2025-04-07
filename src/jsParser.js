class JSParser {
    /**
     * Analiza el código JavaScript para identificar su estructura
     * @param {string} code - Código JavaScript a analizar
     * @returns {Object} - Estructura del código analizado
     */
    parseCode(code) {
      // Dividir el código en líneas para facilitar el análisis
      const lines = code.split('\n');
      return {
        lines: lines,
        totalLines: lines.length
      };
    }
  
    /**
     * Identifica las clases en el código
     * @param {string} code - Código JavaScript
     * @returns {Array} - Lista de clases identificadas
     */
    identifyClasses(code) {
      const classes = [];
      const lines = code.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Buscar declaraciones de clase
        if (line.startsWith('class ')) {
          // Obtener el nombre de la clase
          const classNameMatch = line.match(/class\s+(\w+)/);
          if (classNameMatch && classNameMatch[1]) {
            const className = classNameMatch[1];
            
            // Encontrar el cuerpo de la clase
            let classCode = lines[i];
            let braceCount = line.includes('{') ? 1 : 0;
            let j = i + 1;
            
            // Si la declaración de clase no tiene llave de apertura en la misma línea
            if (braceCount === 0) {
              while (j < lines.length && braceCount === 0) {
                if (lines[j].includes('{')) {
                  braceCount = 1;
                  classCode += '\n' + lines[j];
                }
                j++;
              }
            }
            
            // Encontrar el final de la clase
            while (j < lines.length && braceCount > 0) {
              const currentLine = lines[j];
              classCode += '\n' + currentLine;
              
              // Contar llaves para determinar la estructura
              for (const char of currentLine) {
                if (char === '{') braceCount++;
                if (char === '}') braceCount--;
              }
              
              if (braceCount === 0) break;
              j++;
            }
            
            classes.push({
              name: className,
              code: classCode,
              startLine: i,
              endLine: j
            });
          }
        }
      }
      
      return classes;
    }
  
    /**
     * Identifica los métodos en una clase
     * @param {string} classCode - Código de la clase
     * @returns {Array} - Lista de métodos identificados
     */
    identifyMethods(classCode) {
      const methods = [];
      const lines = classCode.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Patrones para detectar métodos
        const patterns = [
          /^\s*(\w+)\s*\(.*\)\s*{/, // método normal: nombreMetodo() {
          /^\s*async\s+(\w+)\s*\(.*\)\s*{/, // método asíncrono: async nombreMetodo() {
          /^\s*(\w+)\s*=\s*function\s*\(.*\)\s*{/, // método como función: nombreMetodo = function() {
          /^\s*(\w+)\s*=\s*\(.*\)\s*=>/ // método como arrow function: nombreMetodo = () =>
        ];
        
        // Verificar cada patrón
        let methodName = null;
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match && match[1] && match[1] !== 'constructor') {
            methodName = match[1];
            break;
          }
        }
        
        // Si encontramos un método
        if (methodName) {
          // Obtener el cuerpo del método
          let methodCode = lines[i];
          let braceCount = line.includes('{') ? 1 : 0;
          
          // Si es una arrow function que no usa llaves
          if (line.includes('=>') && !line.includes('{')) {
            methods.push({
              name: methodName,
              code: methodCode,
              startLine: i,
              endLine: i
            });
            continue;
          }
          
          // Si la declaración del método no tiene llave de apertura en la misma línea
          let j = i + 1;
          if (braceCount === 0) {
            while (j < lines.length && braceCount === 0) {
              if (lines[j].includes('{')) {
                braceCount = 1;
                methodCode += '\n' + lines[j];
              }
              j++;
            }
          }
          
          // Encontrar el final del método
          while (j < lines.length && braceCount > 0) {
            const currentLine = lines[j];
            methodCode += '\n' + currentLine;
            
            // Contar llaves para determinar la estructura
            for (const char of currentLine) {
              if (char === '{') braceCount++;
              if (char === '}') braceCount--;
            }
            
            if (braceCount === 0) break;
            j++;
          }
          
          methods.push({
            name: methodName,
            code: methodCode,
            startLine: i,
            endLine: j
          });
        }
      }
      
      return methods;
    }
  }
  
  module.exports = JSParser;