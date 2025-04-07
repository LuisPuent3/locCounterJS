// tests/fileReader.test.js
const FileReader = require('../src/fileReader');
const fs = require('fs').promises;
const path = require('path');

describe('FileReader', () => {
  let fileReader;
  
  beforeEach(() => {
    fileReader = new FileReader();
    // Mock para fs.readFile
    fs.readFile = jest.fn();
  });
  
  test('readFile debe leer correctamente un archivo', async () => {
    const mockContent = 'class Test { method() {} }';
    fs.readFile.mockResolvedValue(mockContent);
    
    const result = await fileReader.readFile('test.js');
    
    expect(fs.readFile).toHaveBeenCalledWith('test.js', 'utf8');
    expect(result).toBe(mockContent);
  });
  
  test('readFile debe manejar errores', async () => {
    fs.readFile.mockRejectedValue(new Error('Error de prueba'));
    
    await expect(fileReader.readFile('test.js')).rejects.toThrow('No se pudo leer el archivo: Error de prueba');
  });
  
  test('validateFile debe rechazar archivos vacíos', () => {
    expect(fileReader.validateFile('')).toBe(false);
    expect(fileReader.validateFile('   ')).toBe(false);
  });
  
  test('validateFile debe aceptar código JavaScript válido', () => {
    expect(fileReader.validateFile('function test() {}')).toBe(true);
    expect(fileReader.validateFile('const a = 5;')).toBe(true);
    expect(fileReader.validateFile('class Test { constructor() {} }')).toBe(true);
  });
});

