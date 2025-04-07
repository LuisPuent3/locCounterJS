const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileReader = require('./fileReader');
const JSParser = require('./jsParser');
const LOCCounter = require('./locCounter');
const ResultPresenter = require('./resultPresenter');

const app = express();
const port = 3000;

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * Función principal que orquesta el proceso de conteo
 * @param {string} filePath - Ruta del archivo a analizar
 * @returns {Object} - Resultados del análisis
 */
async function countLOC(filePath) {
  // Inicializar componentes
  const fileReader = new FileReader();
  const jsParser = new JSParser();
  const locCounter = new LOCCounter();
  const resultPresenter = new ResultPresenter();
  
  try {
    // Leer el archivo
    const code = await fileReader.readFile(filePath);
    
    // Validar el archivo
    if (!fileReader.validateFile(code)) {
      throw new Error('El archivo no es un JavaScript válido');
    }
    
    // Analizar el código
    const codeStructure = jsParser.parseCode(code);
    
    // Contar líneas de código
    const totalLOC = locCounter.countTotalLOC(code);
    
    // Preparar resultados
    const results = {
      totalLOC,
      classes: []
    };
    
    // Procesar cada clase
    const classes = jsParser.identifyClasses(code);
    for (const classInfo of classes) {
      const className = classInfo.name;
      const classCode = classInfo.code;
      const classLOC = locCounter.countClassLOC(classCode);
      
      // Identificar métodos
      const methods = jsParser.identifyMethods(classCode);
      const methodsData = [];
      
      // Procesar cada método
      for (const methodInfo of methods) {
        const methodName = methodInfo.name;
        const methodCode = methodInfo.code;
        const methodLOC = locCounter.countMethodLOC(methodCode);
        
        methodsData.push({
          name: methodName,
          loc: methodLOC
        });
      }
      
      // Agregar información de la clase
      results.classes.push({
        name: className,
        loc: classLOC,
        methods: methodsData,
        totalMethods: methods.length
      });
    }
    
    // Mostrar resultados
    return resultPresenter.displayResults(results);
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Ruta para procesar la carga de archivos
app.post('/analyze', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }

  try {
    const results = await countLOC(req.file.path);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Eliminar el archivo después de procesarlo
    fs.unlinkSync(req.file.path);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

// Comentar o eliminar estas líneas para que no se ejecute automáticamente
// countLOC('./src/index.js')
//   .then(results => {
//     console.log('Análisis completado:', results);
//   })
//   .catch(error => {
//     console.error('Error al analizar el archivo:', error);
//   });

module.exports = { countLOC };