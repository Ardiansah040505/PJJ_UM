// ======================================================
// 1. AREA STUDI
// ======================================================

// geometry berasal dari Geometry Imports


// ======================================================
// 2. DATA SENTINEL-2
// ======================================================

var dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .filterDate('2021-12-05', '2022-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

print('Jumlah citra Sentinel-2:', dataset.size());


// ======================================================
// 3. MEDIAN COMPOSITE
// ======================================================

var image = dataset.median();


// ======================================================
// 4. HITUNG NDVI
// ======================================================

var NDVI = image
  .normalizedDifference(['B8', 'B4'])
  .rename('NDVI');


// ======================================================
// 5. CLIP DENGAN AREA STUDI
// ======================================================

var NDVI_clip = NDVI.clip(geometry);


// ======================================================
// 6. KLASIFIKASI NDVI
// ======================================================

var NDVI_class = ee.Image(0)
  .where(NDVI_clip.lt(0), 1)
  .where(
    NDVI_clip.gte(0)
      .and(NDVI_clip.lt(0.2)),
    2
  )
  .where(
    NDVI_clip.gte(0.2)
      .and(NDVI_clip.lt(0.5)),
    3
  )
  .where(
    NDVI_clip.gte(0.5),
    4
  )
  .clip(geometry);


// ======================================================
// 7. VISUALISASI NDVI
// ======================================================

var ndviVis = {
  min: -1,
  max: 1,
  palette: [
    'blue',
    'white',
    'green'
  ]
};


// ======================================================
// 8. VISUALISASI KLASIFIKASI
// ======================================================

var classVis = {
  min: 1,
  max: 4,
  palette: [
    'blue',
    'lightgreen',
    'yellow',
    'green'
  ]
};


// ======================================================
// 9. TAMPILKAN PETA
// ======================================================

//Map.centerObject(geometry, 10);


// NDVI asli
Map.addLayer(
  NDVI_clip,
  ndviVis,
  'NDVI'
);


// Klasifikasi NDVI
Map.addLayer(
  NDVI_class,
  classVis,
  'Klasifikasi NDVI'
);


// ======================================================
// 10. LEGEND
// ======================================================

var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});


// Judul legend
legend.add(ui.Label({
  value: 'Klasifikasi NDVI',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 8px 0'
  }
}));


// Fungsi membuat baris legend
var addLegendRow = function(color, name) {

  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  var label = ui.Label({
    value: name,
    style: {
      margin: '0 0 4px 6px'
    }
  });

  return ui.Panel({
    widgets: [
      colorBox,
      label
    ],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};


// ======================================================
// 11. ISI LEGEND
// ======================================================

legend.add(
  addLegendRow(
    'blue',
    'NDVI < 0  |  Air / Non Vegetasi'
  )
);

legend.add(
  addLegendRow(
    'lightgreen',
    '0 ≤ NDVI < 0.2  |  Lahan Terbuka'
  )
);

legend.add(
  addLegendRow(
    'yellow',
    '0.2 ≤ NDVI < 0.5  |  Vegetasi Sedang'
  )
);

legend.add(
  addLegendRow(
    'green',
    'NDVI ≥ 0.5  |  Vegetasi Rapat'
  )
);


// Tampilkan legend
