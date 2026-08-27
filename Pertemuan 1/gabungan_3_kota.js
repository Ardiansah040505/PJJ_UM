var kotasurabaya = ee.FeatureCollection('FAO/GAUL/2015/level2')
  //.filter(ee.Filter.eq('ADM0_NMAE','Indonesia'))
  .filter(ee.Filter.eq('ADM2_NAME','Kota Surabaya'));

var malang = ee.FeatureCollection('FAO/GAUL/2015/level2')
  //.filter(ee.Filter.eq('ADM0_NMAE','Indonesia'))
  .filter(ee.Filter.eq('ADM2_NAME','Malang'));
  
var tuban = ee.FeatureCollection('FAO/GAUL/2015/level2')
  //.filter(ee.Filter.eq('ADM0_NMAE','Indonesia'))
  .filter(ee.Filter.eq('ADM2_NAME','Tuban'));

var stylemalang = {
  color: 'blue',
  fillColor: '00000000',
  width: 2
};

var stylesurabaya = {
  color: 'red',
  fillColor: '00000000',
  width: 2
};

var styletuban = {
  color: 'yellow',
  fillColor: '00000000',
  width: 2
};



var panel = ui.Panel({
  style: {
    width: '350px',
    position: 'bottom-left'
  }
});

panel.add(ui.Label('Nama : Ardiansah Nur Rohman', {fontWeight: 'bold', fontSize: '16px'}));
panel.add(ui.Label('NIM  : 230322607922', {fontWeight: 'bold', fontSize: '16px'}));

Map.add(panel);



//Map.centerObject(kotasurabaya,9);
Map.addLayer(kotasurabaya,{color:'blue'},'Batas Setiap Kota');
Map.addLayer(kotasurabaya.style(stylesurabaya), {}, 'Batas Setiap Kota ()');

Map.addLayer(malang,{color:'red'},'Batas Setiap Kota');
Map.addLayer(malang.style(stylemalang), {}, 'Batas Setiap Kota ()');

Map.addLayer(tuban,{color:'green'},'Batas Setiap Kota');
