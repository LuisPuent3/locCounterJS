const fs = require('fs').promises;

class FileReader {
    /**
     * Lee un archivo JavaScript
     * @param {string} filePath - Ruta del archivo a leer
     * @returns {Promise<string>} - Contenido del archivo
     */
    async readFile(filePath) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        return content;
      } catch (error) {
        console.error('Error al leer el archivo:', error);
        throw new Error(`No se pudo leer el archivo: ${error.message}`);
      }
    }
  
    /**
     * Valida que el archivo sea JavaScript válido
     * @param {string} content - Contenido del archivo
     * @returns {boolean} - True si es válido, false en caso contrario
     */
    validateFile(content) {
      // Esta es una validación básica que verifica si el contenido no está vacío
      // Puedes mejorar esta validación según tus necesidades
      if (!content || content.trim() === '') {
        return false;
      }

      // Verificar si el contenido parece ser código JavaScript
      // Esta es una validación muy básica y podría mejorarse
      const jsKeywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class'];
      const hasJsKeywords = jsKeywords.some(keyword => content.includes(keyword));
      
      return hasJsKeywords;
    }
  }
  
  module.exports = FileReader;