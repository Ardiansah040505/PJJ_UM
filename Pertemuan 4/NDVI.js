// ==========================================
// 1. Tentukan Area of Interest (AOI)
// ==========================================
var aoi = ee.FeatureCollection('FAO/GAUL/2015/level2')
  .filter(ee.Filter.eq('ADM1_NAME','Jawa Timur'));// contoh: Malang

var style = {
  color: 'blue',
  fillColor: '00000000',
  width: 2
};


// ==========================================
// 2. Masking Awan Sentinel-2 (QA60)
// ==========================================
function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}

// ==========================================
// 3. Panggil Koleksi Sentinel-2 & Hitung NDVI
// ==========================================
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds)
  .median();

// B8 = NIR, B4 = Red
var ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI');

// ==========================================
// 4. Klasifikasi NDVI (4 Kelas)
// Kelas 0: Air / Non Vegetasi (NDVI < 0)
// Kelas 1: Lahan Terbuka      (0 - 0.2)
// Kelas 2: Vegetasi Rendah    (0.2 - 0.5)
// Kelas 3: Vegetasi Rapat     (> 0.5)
// ==========================================
var ndviClass = ee.Image(0)
  .where(ndvi.gte(0).and(ndvi.lte(0.2)), 1)
  .where(ndvi.gt(0.2).and(ndvi.lte(0.5)), 2)
  .where(ndvi.gt(0.5), 3)
  .clip(aoi); // buffer 10 km dari titik aoi

var classVis = {
  min: 0,
  max: 3,
  palette: ['blue', 'white', 'yellow', 'green']
};

// ==========================================
// 5. Tampilkan di Peta
// ==========================================
//Map.centerObject(aoi, 11);
Map.addLayer(ndviClass, classVis, 'Klasifikasi NDVI Sentinel-2');

//Batas
Map.addLayer(aoi.style(style), {}, 'Batas Jawa Timur ()')


// ==========================================
// 6. Legend Kategori NDVI
// ==========================================
var legendKategori = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});

legendKategori.add(ui.Label({
  value: 'Klasifikasi NDVI',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

var addRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legendKategori.add(addRow('blue', 'Air / Non Vegetasi (NDVI < 0)'));
legendKategori.add(addRow('white', 'Lahan Terbuka (0 - 0.2)'));
legendKategori.add(addRow('yellow', 'Vegetasi Rendah (0.2 - 0.5)'));
legendKategori.add(addRow('green', 'Vegetasi Rapat (> 0.5)'));

Map.add(legendKategori);

//Panel Nama
var panel = ui.Panel({
  style: {
    width: '350px',
    position: 'bottom-left'
  }
});

panel.add(ui.Label('Nama : Ardiansah Nur Rohman', {fontWeight: 'bold', fontSize: '16px'}));
panel.add(ui.Label('NIM  : 230322607922', {fontWeight: 'bold', fontSize: '16px'}));

