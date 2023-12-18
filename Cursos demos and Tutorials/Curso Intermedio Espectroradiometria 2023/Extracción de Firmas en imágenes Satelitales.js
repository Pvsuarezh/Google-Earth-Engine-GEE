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
// Script:                    VISUALIZACIÓN DE FIRMAS ESPECTRALES
//===========================================================================================
// El siguiente Script contiene una serie de procedimientos que permiten extraer de imágenes 
// Sentinel 2 o Landsat 9,  firmas espectrales o bibliotecas espectrales externas,  
// para el procesamiento digital de imágenes.
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//*******************************************************************************************
//************************Obtención de firmas espectrales en Sentinel_2******************************//

// Número y nombre de las bandas (crear lista de banda de entrada)
var bandsIn = ee.List(['B1','B2','B3','B4','B5','B6','B7','B8','B8A','B9','B11','B12']);
// Número y nombre de las bandas (crear lista de banda de salida)
var bandsOut = ee.List(['cb','blue','green','red','re1','re2','re3','nir1','nir2','waterVapor','swir1','swir2']);
// Número y nombre de las diferentes longitudes de onda
var wavelengths = ([443.9, 496.6, 560, 664.5, 703.9, 740.2, 782.5, 835.1, 864.8, 945, 1613.7, 2202.4]);
//////////////////////////////////////////////////////
// Defina los puntos de muestreo
var Puntos = ee.FeatureCollection("users/aariza/punto_3221_02");
///////////////////////////////////////////////////
var image = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2018-01-01', '2022-01-30')
                  // Filtrar por zona de interes
                  .filterBounds(Puntos)
                  // Pre-filtrar por menos contenido de nubes
                  .sort('CLOUDY_PIXEL_PERCENTAGE')
                  // Obtener la primera imagen con menor contenido de nubes
                  .first();               

var dataset = image.select(bandsIn,bandsOut).divide(10000);  

  var visualization = {
  min: 0.0,
  max: 0.4,
  bands: ['red', 'green', 'blue'],
};

Map.addLayer(dataset, visualization, 'S2 image'); 
Map.centerObject(Puntos);
print(image, 'S2 image')

Map.addLayer(Puntos, {color: 'red'}, 'Samples', true); 

// Opciones de representación
var options = {
  title: 'Firmas espectrales - Sentinel-2-CLC 3221',
  hAxis: {title: 'Longitud de Onda (nm)'},
  vAxis: {title: 'Reflectancia (x1)'},
  lineWidth: 1,
  pointSize: 4,
  curveType: 'function',
  series: {
    0: {color: '#1225d6'},
    1: {color: '#eb0dff'},
    2: {color: '#16802b'},
    3: {color: '#1225d6'},
    4: {color: '#eb0dff'},
    5: {color: '#16802b'},
    6: {color: '#e2ff23'},
    7: {color: '#16802b'},
    8: {color: '#e2ff23'}
  }
};

// definir imágen
// definir imágen
var img = dataset

// Crear el grafico y configurar las opciones de visualización
var spectraChart = ui.Chart.image.regions(
  img, Puntos, ee.Reducer.mean(), 30, 'Muestra', wavelengths)
  .setChartType('LineChart')
  .setOptions(options);
 
// imprimir el gráfico
print(spectraChart)


// extraer información:
var training = img.sampleRegions({
  collection: Puntos,
  properties: ['Muestra',],
  scale: 10
});

// exportar tabla con información
Export.table.toDrive({
    'collection': training,
    'description': 'libreria_espectral_3221',
    'fileNamePrefix': 'muestras',
    'fileFormat': 'CSV'}
);