/**
 * Ejemplo de archivo JavaScript con múltiples clases y métodos
 * para probar el contador de LOC
 */

// Clase 1: Usuario
class Usuario {
    constructor(nombre, email, edad) {
      this.nombre = nombre;
      this.email = email;
      this.edad = edad;
      this.activo = true;
      this.fechaRegistro = new Date();
    }
  
    // Método 1
    obtenerInformacion() {
      return {
        nombre: this.nombre,
        email: this.email,
        edad: this.edad,
        activo: this.activo,
        fechaRegistro: this.fechaRegistro
      };
    }
  
    // Método 2
    desactivar() {
      this.activo = false;
      return this.activo;
    }
  
    // Método 3
    activar() {
      this.activo = true;
      return this.activo;
    }
  
    // Método 4
    actualizarEmail(nuevoEmail) {
      this.email = nuevoEmail;
      return this.email;
    }
  
    // Método 5
    esMayorDeEdad() {
      return this.edad >= 18;
    }
  }
  
  // Clase 2: Producto
  class Producto {
    constructor(id, nombre, precio, stock) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.stock = stock;
      this.disponible = stock > 0;
    }
  
    // Método 1
    obtenerPrecio() {
      return this.precio;
    }
  
    // Método 2
    actualizarStock(cantidad) {
      this.stock = cantidad;
      this.disponible = this.stock > 0;
      return this.stock;
    }
  
    // Método 3
    aplicarDescuento(porcentaje) {
      const descuento = this.precio * (porcentaje / 100);
      return this.precio - descuento;
    }
  }
  
  // Clase 3: Carrito
  class Carrito {
    constructor() {
      this.items = [];
      this.total = 0;
    }
  
    // Método 1
    agregarProducto(producto, cantidad) {
      if (producto.stock < cantidad) {
        throw new Error('No hay suficiente stock');
      }
      
      this.items.push({
        producto: producto,
        cantidad: cantidad,
        subtotal: producto.precio * cantidad
      });
      
      this.calcularTotal();
      return this.items;
    }
  
    // Método 2
    eliminarProducto(productoId) {
      this.items = this.items.filter(item => item.producto.id !== productoId);
      this.calcularTotal();
      return this.items;
    }
  
    // Método 3
    calcularTotal() {
      this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
      return this.total;
    }
  
    // Método 4
    vaciar() {
      this.items = [];
      this.total = 0;
      return true;
    }
  
    // Método 5
    obtenerResumen() {
      return {
        items: this.items.length,
        productos: this.items.map(item => ({
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          subtotal: item.subtotal
        })),
        total: this.total
      };
    }
  }
  
  // Exportar las clases
  module.exports = {
    Usuario,
    Producto,
    Carrito
  };