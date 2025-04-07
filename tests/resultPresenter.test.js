// tests/resultPresenter.test.js
const ResultPresenter = require('../src/resultPresenter');

describe('ResultPresenter', () => {
  let resultPresenter;
  
  beforeEach(() => {
    resultPresenter = new ResultPresenter();
  });
  
  test('displayResults debe devolver los resultados sin modificar', () => {
    const results = {
      totalLOC: 100,
      classes: [
        { name: 'Test', loc: 50, methods: [], totalMethods: 0 }
      ]
    };
    
    const displayedResults = resultPresenter.displayResults(results);
    expect(displayedResults).toEqual(results);
  });
  
  test('exportResults debe formatear correctamente a JSON', () => {
    const results = {
      totalLOC: 100,
      classes: [
        { name: 'Test', loc: 50, methods: [], totalMethods: 0 }
      ]
    };
    
    const json = resultPresenter.exportResults(results, 'json');
    expect(JSON.parse(json)).toEqual(results);
  });
  
  test('exportResults debe formatear correctamente a CSV', () => {
    const results = {
      totalLOC: 100,
      classes: [
        { 
          name: 'Test', 
          loc: 50, 
          methods: [
            { name: 'method1', loc: 20 },
            { name: 'method2', loc: 30 }
          ],
          totalMethods: 2 
        }
      ]
    };
    
    const csv = resultPresenter.exportResults(results, 'csv');
    const lines = csv.split('\n');
    
    expect(lines[0]).toBe('Clase,Método,Líneas de Código');
    expect(lines[1]).toBe('Test,Total,50');  
    expect(lines[2]).toBe('Test,method1,20');
    expect(lines[3]).toBe('Test,method2,30');
  });
  
  test('exportResults debe lanzar error para formatos no soportados', () => {
    const results = { totalLOC: 100, classes: [] };
    
    expect(() => {
      resultPresenter.exportResults(results, 'xml');
    }).toThrow('Formato no soportado: xml');
  });
});