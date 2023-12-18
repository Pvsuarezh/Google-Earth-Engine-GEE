//===========================================================================================
//                          INSTITUTO GEOGRÄFICO AGUSTIN CODAZZI - IGAC 
//                           DIRECCIÖN DE INVESTIGACIÖN Y PROSPECTIVA
//===========================================================================================
// ASIGNATURA:              Curso Intermedio Espectroradiometria
//===========================================================================================
// UNIDAD 3:        Procesamiento de datos en la nube para Espectroradiometría
//                              (Google Earth Engine - GEE) 
//===========================================================================================
// DOCENTE:                            ALEXANDER ARIZA
//===========================================================================================
// ALUMNO(S):                             
//===========================================================================================
// Este taller práctico en GEE está dirigido al uso general de la plataforma Google Earth 
// Engine, como herramienta de Integración de información para explicar relaciones causa y 
// efecto, derivadas del análisis, procesamiento y explotación de datos en la nube para el 
// análisis del Espectroradiometría. 
//===========================================================================================
// Script:                            CAHNGE DETECTION - SAM
//===========================================================================================
// El siguiente Script contiene una serie de procedimientos que permiten extraer de imágenes 
// Sentinel 2 o Landsat 9,  firmas espectrales o bibliotecas espectrales externas,  
// para el procesamiento digital de imágenes.
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//*******************************************************************************************
//*********************************CJANGE DETECTION SAM************************************//
// Define un polígono para delimitar un área de interés
var geometry = ee.Geometry.Polygon([
  [
    [75.70357667713435, 12.49723970868507],
    [75.70357667713435, 12.470171844429931],
    [75.7528434923199, 12.470171844429931],
    [75.7528434923199, 12.49723970868507]
  ]
]);

// Centra el mapa en el polígono definido
Map.centerObject(geometry);

// Carga la colección de imágenes Sentinel-2
var s2 = ee.ImageCollection("COPERNICUS/S2");

// Parámetros de visualización para RGB
var rgbVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'], 
};

// Función para enmascarar nubes en imágenes S2
function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask)
      .select("B.*")
      .copyProperties(image, ["system:time_start"]);
} 

// Filtrado y preparación de imágenes S2
var filtered = s2
  .filter(ee.Filter.bounds(geometry))
  .map(maskS2clouds)
  .select('B.*');
  
// Fecha del incidente
var dateOfIncident = ee.Date('2018-12-15');

// Imágenes antes y después del incidente
var before = filtered
  .filter(ee.Filter.date(dateOfIncident.advance(-2, 'year'), dateOfIncident))
  .filter(ee.Filter.calendarRange(12, 12, 'month'))
  .median();

var after = filtered.filter(ee.Filter.date(
  dateOfIncident, dateOfIncident.advance(1, 'month'))).median();

// Cálculo de distancia entre las imágenes
// Formula at https://www.varsitytutors.com/calculus_3-help/distance-between-vectors
var magnitude = function(image) {
  return image.pow(2).reduce(ee.Reducer.sum()).sqrt();
};

var distance = magnitude(after.subtract(before));

// Cálculo del ángulo entre las imágenes
// https://byjus.com/angle-between-two-vectors-formula/
var dot = before.multiply(after).reduce(ee.Reducer.sum());

var angle = dot.divide(magnitude(after))
              .divide(magnitude(before))
              .acos();

// Agregar capas al mapa
Map.addLayer(before, rgbVis, 'Antes del evento');
Map.addLayer(after, rgbVis, 'Después del evento');

// Visualización de la distancia y el ángulo
Map.addLayer(distance, {min: 0, max: 1500, palette: ['white', 'red']}, 'Distancia espectral');
Map.addLayer(angle, {min: 0, max: 1, palette: ['white', 'purple']}, 'Ángulo');
