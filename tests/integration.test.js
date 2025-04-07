// tests/integration.test.js
const FileReader = require('../src/fileReader');
const JSParser = require('../src/jsParser');
const LOCCounter = require('../src/locCounter');
const ResultPresenterAPI = require('../src/resultPresenter');
const fs = require('fs').promises;

// Mock de la función readFile de fs
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

describe('Integración', () => {
  let fileReader, jsParser, locCounter, resultPresenter;
  
  beforeEach(() => {
    fileReader = new FileReader();
    jsParser = new JSParser();
    locCounter = new LOCCounter();
    resultPresenter = new ResultPresenterAPI();
    
    // Resetear mocks
    jest.clearAllMocks();
  });
  
  test('Flujo completo de análisis debe funcionar correctamente', async () => {
    // Código de prueba
    const testCode = `
      class Test1 {
        constructor() {
          this.value = 0;
        }
        
        method1() {
          return this.value;
        }
        
        method2() {
          this.value++;
          return this.value;
        }
      }
      
      class Test2 {
        method3() {
          console.log('test');
        }
      }
    `;
    
    // Mock para la lectura del archivo
    fs.readFile.mockResolvedValue(testCode);
    
    // Ejecutar el flujo
    const code = await fileReader.readFile('test.js');
    expect(fileReader.validateFile(code)).toBe(true);
    
    const classes = jsParser.identifyClasses(code);
    expect(classes.length).toBe(2);
    
    const totalLOC = locCounter.countTotalLOC(code);
    
    // Construir resultados manualmente para probar
    const results = {
      totalLOC,
      classes: []
    };
    
    for (const classInfo of classes) {
      const className = classInfo.name;
      const classCode = classInfo.code;
      const classLOC = locCounter.countClassLOC(classCode);
      
      const methods = jsParser.identifyMethods(classCode);
      const methodsData = [];
      
      for (const methodInfo of methods) {
        const methodName = methodInfo.name;
        const methodCode = methodInfo.code;
        const methodLOC = locCounter.countMethodLOC(methodCode);
        
        methodsData.push({
          name: methodName,
          loc: methodLOC
        });
      }
      
      results.classes.push({
        name: className,
        loc: classLOC,
        methods: methodsData,
        totalMethods: methods.length
      });
    }
    
    // Verificar resultados
    expect(results.totalLOC).toBeGreaterThan(0);
    expect(results.classes.length).toBe(2);
    expect(results.classes[0].name).toBe('Test1');
    expect(results.classes[0].totalMethods).toBe(2);
    expect(results.classes[1].name).toBe('Test2');
    expect(results.classes[1].totalMethods).toBe(1);
    
    // Verificar que el presentador funciona correctamente
    const displayedResults = resultPresenter.displayResults(results);
    expect(displayedResults).toEqual(results);
  });
  
  test('El flujo debe manejar errores de lectura de archivo', async () => {
    // Simular error de lectura
    fs.readFile.mockRejectedValue(new Error('Error de lectura'));
    
    // Ejecutar y verificar que se captura el error
    await expect(fileReader.readFile('test.js')).rejects.toThrow('No se pudo leer el archivo: Error de lectura');
  });
  
  test('El flujo debe manejar archivos JavaScript inválidos', async () => {
    // Código no válido (vacío)
    fs.readFile.mockResolvedValue('');
    
    const code = await fileReader.readFile('test.js');
    expect(fileReader.validateFile(code)).toBe(false);
  });
});