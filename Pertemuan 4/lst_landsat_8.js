// ==========================================
// SCRIPT LST LANDSAT 8 (C2 L2)
// ==========================================

// 1. Tentukan Area of Interest (AOI)
//var aoi = ee.Geometry.Point([112.45, -7.92]); // Malang
var aoi = ee.FeatureCollection('FAO/GAUL/2015/level2')
  .filter(ee.Filter.eq('ADM2_NAME','Malang'));
  
var style = {
  color: 'blue',
  fillColor: '00000000',
  width: 2
};


// 2. Panggil koleksi Landsat 8 Collection 2 Level-2
var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(aoi)
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20))
  .median();

// 3. Ambil band Surface Temperature (ST_B10)
// ST = DN * 0.00341802 + 149.0
var lst = dataset.select('ST_B10')
  .multiply(0.00341802)
  .add(149.0)
  .subtract(273.15) // Kelvin ke Celsius
  .rename('LST_Celsius');

// 4. Visualisasi parameter
var visParams = {
  min: 20,
  max: 40,
  palette: ['blue', 'cyan', 'green', 'yellow', 'red']
};

// 5. Tampilkan di peta
//Map.centerObject(aoi, 10);
Map.addLayer(lst.clip(aoi), visParams, 'LST (°C)'); // clip agar rapi sesuai batas Malang
Map.addLayer(aoi.style(style), {}, 'Batas Malang');
// 6. Print nilai rata-rata LST di AOI
var meanLST = lst.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi.geometry(), // gunakan .geometry() dari FeatureCollection
  scale: 100,               // dinaikkan ke 100 agar proses komputasi cepat dan tidak timeout
  maxPixels: 1e9
});

print('Mean LST (°C):', meanLST);

// ==========================================
// 7. LEGENDA SUHU (LST)
// ==========================================
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px',
    backgroundColor: 'white'
  }
});

// Judul legenda
var legendTitle = ui.Label({
  value: 'LST (°C)',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 6px 0',
    padding: '0'
  }
});
legend.add(legendTitle);

// Fungsi pembuat bar gradien warna yang reliabel
function makeColorBarParams(palette) {
  return {
    bbox: [0, 0, 1, 0.1],
    dimensions: '120x14',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette
  };
}

var colorBar = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: makeColorBarParams(visParams.palette),
  style: {
    stretch: 'horizontal',
    margin: '0px 8px',
    maxHeight: '14px'
  }
});
legend.add(colorBar);

// Label angka minimum dan maksimum
var legendLabels = ui.Panel({
  widgets: [
    ui.Label(visParams.min.toString(), {margin: '4px 0', fontSize: '12px'}),
    ui.Label(
      ((visParams.max + visParams.min) / 2).toString(),
      {margin: '4px 0', textAlign: 'center', stretch: 'horizontal', fontSize: '12px'}
    ),
    ui.Label(visParams.max.toString(), {margin: '4px 0', fontSize: '12px'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});
legend.add(legendLabels);

Map.add(legend);

// ==========================================
// 8. PANEL IDENTITAS
// ==========================================
var panel = ui.Panel({
  style: {
    width: '280px',
    position: 'bottom-left',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  }
});

panel.add(ui.Label('Nama : Ardiansah Nur Rohman', {fontWeight: 'bold', fontSize: '13px', margin: '2px 0'}));
panel.add(ui.Label('NIM   : 230322607922', {fontWeight: 'bold', fontSize: '13px', margin: '2px 0'}));

