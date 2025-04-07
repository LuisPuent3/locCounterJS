
// Archivo adicional: Script para ejecutar las pruebas
// Guárdalo como run-tests.js
/**
 * Este script ejecuta todas las pruebas y genera un reporte.
 * Para usarlo, ejecuta: node run-tests.js
 */
const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Ejecutando pruebas...');
  const output = execSync('npx jest --coverage', { encoding: 'utf-8' });
  
  console.log('Generando reporte de pruebas...');
  fs.writeFileSync('test-report.txt', output);
  
  console.log('Pruebas completadas. Reporte generado en test-report.txt');
  
  // Extraer resumen de cobertura
  const coverageMatch = output.match(/All files[^\n]+/);
  if (coverageMatch) {
    console.log('\nResumen de cobertura:');
    console.log(coverageMatch[0]);
  }
} catch (error) {
  console.error('Error al ejecutar las pruebas:', error.message);
  process.exit(1);
}