// 1. Batas wilayah Kabupaten Malang
var admin = ee.FeatureCollection("FAO/GAUL/2015/level2");

var malang = admin.filter(
  ee.Filter.and(
    //ee.Filter.eq('ADMO_NAME', 'Indonesia'),
    ee.Filter.eq('ADM2_NAME', 'Malang')
  )
);

var surabaya = admin.filter(
  ee.Filter.and(
    //ee.Filter.eq('ADMO_NAME', 'Indonesia'),
    ee.Filter.eq('ADM2_NAME', 'Kota Surabaya')
  )
);

var tuban = admin.filter(
  ee.Filter.and(
    //ee.Filter.eq('ADMO_NAME', 'Indonesia'),
    ee.Filter.eq('ADM2_NAME', 'Tuban')
  )
);

// 2. MODIS (belum di-clip)
var modisMalang = ee.ImageCollection('MODIS/061/MOD09GA')
  .filterBounds(malang)
  .filterDate('2024-01-01', '2024-12-31')
  .map(function(img){
    // Scale factor reflektansi permukaan MODIS
    var optical = img.select([
      'sur_refl_b01', // Red
      'sur_refl_b04', // Green
      'sur_refl_b03'  // Blue
    ])
    .multiply(0.0001);
    return img.addBands(optical, null, true);
  })
  .median()
  .clip(malang);

var modisSurabaya = ee.ImageCollection('MODIS/061/MOD09GA')
  .filterBounds(surabaya)
  .filterDate('2024-01-01', '2024-12-31')
  .map(function(img){
    // Scale factor reflektansi permukaan MODIS
    var optical = img.select([
      'sur_refl_b01', // Red
      'sur_refl_b04', // Green
      'sur_refl_b03'  // Blue
    ])
    .multiply(0.0001);
    return img.addBands(optical, null, true);
  })
  .median()
  .clip(surabaya);

var modisTuban = ee.ImageCollection('MODIS/061/MOD09GA')
  .filterBounds(tuban)
  .filterDate('2024-01-01', '2024-12-31')
  .map(function(img){
    // Scale factor reflektansi permukaan MODIS
    var optical = img.select([
      'sur_refl_b01', // Red
      'sur_refl_b04', // Green
      'sur_refl_b03'  // Blue
    ])
    .multiply(0.0001);
    return img.addBands(optical, null, true);
  })
  .median()
  .clip(tuban);

// 3. Clip citra ke batas wilayah
//var modis_clip_malang = modis.clip(malang);
//var modis_clip_surabaya = modis.clip(surabaya);
//var modis_clip_tuban = modis.clip(tuban);

// 4. Visualisasi
var visRGB = {
  bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
  min: 0,
  max: 0.3
};

//Map.centerObject(malang, 9);

// Citra sebelum clip
Map.addLayer(modisMalang, visRGB, 'MODIS Malang (sebelum clip)');
Map.addLayer(modisSurabaya, visRGB, 'MODIS Surabaya (sebelum clip)');
Map.addLayer(modisTuban, visRGB, 'MODIS Tuban (sebelum clip)');

// Citra sesudah clip
//Map.addLayer(modis_clip_malang, visRGB, 'MODIS Malang (sesudah clip)');
//Map.addLayer(modis_clip_surabaya, visRGB, 'MODIS Surabaya (sesudah clip)');
//Map.addLayer(modis_clip_tuban, visRGB, 'MODIS Tuban (sesudah clip)');

// Batas wilayah
Map.addLayer(malang.style({
  color: 'red',
  fillColor: '00000000',
  width: 2
}), {}, 'Batas Kab. Malang');

Map.addLayer(surabaya.style({
  color: 'blue',
  fillColor: '00000000',
  width: 2
}), {}, 'Batas Kota Surabaya');

Map.addLayer(tuban.style({
  color: 'yellow',
  fillColor: '00000000',
  width: 2
}), {}, 'Batas Kab. Tuban');

var panel = ui.Panel({
  style: {
    width: '350px',
    position: 'bottom-left'
  }
});

panel.add(ui.Label('Nama : Ardiansah Nur Rohman', {fontWeight: 'bold', fontSize: '16px'}));
panel.add(ui.Label('NIM  : 230322607922', {fontWeight: 'bold', fontSize: '16px'}));

Map.add(panel);


