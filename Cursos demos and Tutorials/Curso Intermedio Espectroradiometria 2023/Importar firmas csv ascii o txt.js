
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
// El siguiente Script contiene una serie de procedimientos que permite ver las colecciones 
// de firmas espectrales o bibliotecas espectrales externas, en formatos TXT, ASCII o CSV 
// para el procesamiento digital de imágenes.
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//*******************************************************************************************
// Importar la colección de datos
var collection = ee.FeatureCollection('projects/ee-aariza/assets/test_arroz');

// Obtener listas para Wavelength y refs
var Wavelength = collection.aggregate_array('﻿Wavelength');
var refs = collection.aggregate_array('/imported/SENA/envi_plot_veg_stxthoja_sana_f71');

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

///////////////////////////////////////////////////////////////

// Importar la colección de datos
var col = ee.FeatureCollection('projects/ee-aariza/assets/hoja_sana');

// Obtener la media de las bandas espectrales
var meanReflectance = col.reduceColumns(ee.Reducer.mean(), ['/computed/FEDEARROZ_2000_HOJA_SANAtxtnnn']);

// Imprimir el resultado
print('Media de reflectancia:', meanReflectance);