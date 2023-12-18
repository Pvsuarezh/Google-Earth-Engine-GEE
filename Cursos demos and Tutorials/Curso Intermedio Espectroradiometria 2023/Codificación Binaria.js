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
// Script:                            CODIFICACIÖN BINARIA
//===========================================================================================
// El siguiente Script contiene una serie de procedimientos que permiten extraer de imágenes 
// Sentinel 2 o Landsat 9,  firmas espectrales o bibliotecas espectrales externas,  
// para el procesamiento digital de imágenes.
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//*******************************************************************************************
//*********************************CODIFICACION BINARIA************************************//

// Número y nombre de las bandas (crear lista de banda de entrada)
var bandsIn = ee.List(['B1','B2','B3','B4','B5','B6','B7','B8','B8A','B9','B11','B12']);
// Número y nombre de las bandas (crear lista de banda de salida)
var bandsOut = ee.List(['cb','blue','green','red','re1','re2','re3','nir1','nir2','waterVapor','swir1','swir2']);
// Número y nombre de las diferentes longitudes de onda
var wavelengths = ([443.9, 496.6, 560, 664.5, 703.9, 740.2, 782.5, 835.1, 864.8, 945, 1613.7, 2202.4]);
///////////////////////////////////////////////////
//Definicion de puntos de muestreo:
var Puntos = /* color: #98ff00 */ee.Geometry.Point([-81.71733142499268, 12.503470769333436]);

///////////////////////////////////////////////////
var image = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2023-07-01', '2023-12-12')
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
///////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////

// Importar la colección de datos
var col = ee.FeatureCollection('projects/ee-aariza/assets/hoja_sana');

// Obtener listas para Wavelength y refs
var Wavelength = col.aggregate_array('﻿Wavele');
var refs = col.aggregate_array('/computed/FEDEARROZ_2000_HOJA_SANAtxtnnn');

// Imprimir los valores tabulados de las propiedades
print('Valores de Wavelength:', Wavelength);
print('Valores de refs:', refs);

// Crear el gráfico de la firma espectral
var chart = ui.Chart.array.values(refs, 0, Wavelength)
  .setOptions({
    title: 'Firma espectral arroz',
    hAxis: {title: 'Wavelength'},
    vAxis: {title: 'Reflectance'},
    lineWidth: 2,  // Ancho de línea
    pointSize: 3,  // Tamaño de punto
    series: {
      0: {color: 'green'},  // Color de la línea
    },
  });

// Mostrar el gráfico en la consola
print(chart);

///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////

// Importar la colección de datos
var col = ee.FeatureCollection('projects/ee-aariza/assets/hoja_sana');

// Obtener la media de las bandas espectrales
var meanReflectance = col.reduceColumns(ee.Reducer.mean(), ['/computed/FEDEARROZ_2000_HOJA_SANAtxtnnn']);

// Imprimir el resultado
print('Media de reflectancia:', meanReflectance);

// Guardar el valor como variable (a= reflectancia objetivo)
var a = ee.Number(meanReflectance);
print('Valor guardado:', a);

//////////////////////////////////////////////////


///////////////////////////////////////////////

var codeB1 = img.select('blue').gt(a)
var codeB2 = img.select('green').gt(a)
var codeB3 = img.select('red').gt(a)
var codeB4 = img.select('red').gt(a)
var codeB5 = img.select('re1').gt(a)
var codeB6 = img.select('re2').gt(a)
var codeB7 = img.select('re3').gt(a)
var codeB8 = img.select('nir1').gt(a)
var codeB9 = img.select('nir2').gt(a)
var codeB10 = img.select('swir1').gt(a)
var codeB11 = img.select('swir2').gt(a)

// usa esta paleta para EVI
var palette = [
  'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
  '74A901', '66A000', '529400', '3E8601', '207401', '056201',
  '004C00', '023B01', '012E01', '011D01', '011301'];

//Map.addLayer(codeB7, {palette: ['black', 'green']}, 'Arroz')      
////////////////////////////

//var mean = uris.reduce(ee.Reducer.mean());

// Create a binary layer using logical operations.
var code1 = img.expression( "(b('blue') > 0.194) ? 1" +  ": 0" );
var code2 = img.expression( "(b('green') > 0.194) ? 1" +  ": 0" );
var code3 = img.expression( "(b('red') > 0.194) ? 1" +  ": 0" );
var code4 = img.expression( "(b('re1') > 0.194) ? 1" +  ": 0" );
var code5 = img.expression( "(b('re2') > 0.194) ? 1" +  ": 0" );
var code6 = img.expression( "(b('re3') > 0.194) ? 1" +  ": 0" );
var code7 = img.expression( "(b('nir1') > 0.194) ? 1" +  ": 0" );
var code8 = img.expression( "(b('nir2') > 0.194) ? 1" +  ": 0" );
var code9 = img.expression( "(b('swir1') > 0.194) ? 1" +  ": 0" );
var code10 = img.expression( "(b('swir1') > 0.194) ? 1" +  ": 0" );

// List of URIs, one for each band.
var uris = ee.ImageCollection([
  code1 ,
  code2 ,
  code3 ,
  code4 ,
  code5 ,
  code6 ,
  code7 ,
  code8 ,
  code9 ,
  code10 ,
]);

var IAE = uris.reduce(ee.Reducer.median());

//print('IAE: ', IAE)

Map.addLayer(IAE, {palette: palette}, 'IAE Palma Comun: Pseudophoenix sargentii')  
