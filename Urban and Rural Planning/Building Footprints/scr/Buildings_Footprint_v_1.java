// Define la función con tu código de detección de edificios y exportación
function detectarEdificios() {
  var buildingPolygons = ee.FeatureCollection('GOOGLE/Research/open-buildings/v3/polygons');

  var confidence065_070 = buildingPolygons.filter('confidence >= 0.65 && confidence < 0.7');
  var confidence070_075 = buildingPolygons.filter('confidence >= 0.7 && confidence < 0.75');
  var confidenceGte_075 = buildingPolygons.filter('confidence >= 0.75');

  Map.addLayer(confidence065_070, { color: 'FF0000' }, 'Buildings confidence [0.65; 0.7)');
  Map.addLayer(confidence070_075, { color: 'FFFF00' }, 'Buildings confidence [0.7; 0.75)');
  Map.addLayer(confidenceGte_075, { color: '00FF00' }, 'Buildings confidence >= 0.75');

  Map.setCenter(-74.792346, 11.011809, 17);  // Barranquilla, Colombia
  Map.setOptions('SATELLITE');

  // Agregar leyenda con simbología y colores
  var leyenda = ui.Panel({
    style: {
      position: 'bottom-right',
      padding: '8px 15px',
      backgroundColor: 'white'
    }
  });

  var label1 = ui.Label('confidence >= 0.75', { color: 'black' });
  var label2 = ui.Label('0.7 <= confidence < 0.75', { color: 'black' });
  var label3 = ui.Label('0.65 <= confidence < 0.7', { color: 'black' });

  var rect1 = ui.Panel({
    style: { backgroundColor: '00FF00', margin: '0 8px 4px 0' }
  });

  var rect2 = ui.Panel({
    style: { backgroundColor: 'FFFF00', margin: '0 8px 4px 0' }
  });

  var rect3 = ui.Panel({
    style: { backgroundColor: 'FF0000', margin: '0 8px 4px 0' }
  });

  var icon1 = ui.Label({ value: '🏢', style: { margin: '0 5px' } });
  var icon2 = ui.Label({ value: '🏢', style: { margin: '0 5px' } });
  var icon3 = ui.Label({ value: '🏢', style: { margin: '0 5px' } });

  leyenda.add(rect1.add(icon1));
  leyenda.add(label1);
  leyenda.add(rect2.add(icon2));
  leyenda.add(label2);
  leyenda.add(rect3.add(icon3));
  leyenda.add(label3);

  Map.add(leyenda);

  // Exportar a GeoJSON
  var exportGeoJSON = function () {
    Export.table.toDrive({
      collection: ee.FeatureCollection([confidence065_070, confidence070_075, confidenceGte_075]).flatten(),
      description: 'BuildingPolygons_GeoJSON',
      fileFormat: 'GeoJSON'
    });
  };

  // Exportar a KML
  var exportKML = function () {
    Export.table.toDrive({
      collection: ee.FeatureCollection([confidence065_070, confidence070_075, confidenceGte_075]).flatten(),
      description: 'BuildingPolygons_KML',
      fileFormat: 'KML'
    });
  };

  // Botón de descarga GeoJSON
  var downloadGeoJSONButton = ui.Button({
    label: 'Descargar como GeoJSON',
    onClick: exportGeoJSON,
    style: { margin: '10px 5px' }
  });

  // Botón de descarga KML
  var downloadKMLButton = ui.Button({
    label: 'Descargar como KML',
    onClick: exportKML,
    style: { margin: '10px 5px' }
  });

  ui.root.add(downloadGeoJSONButton);
  ui.root.add(downloadKMLButton);
}

// Crea y muestra el enlace de la API con la leyenda y botones de descarga
var link = ui.Button('Ejecutar Detección de Edificios');
link.onClick(detectarEdificios);
ui.root.add(link);