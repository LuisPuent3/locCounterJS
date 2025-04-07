// tests/setup.js
// Este archivo contiene configuraciones globales para Jest

// Aumentar el tiempo de espera para pruebas asíncronas
jest.setTimeout(30000);

// Suprimir mensajes de consola durante las pruebas
// Comenta estas líneas si necesitas ver los mensajes para depuración
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});