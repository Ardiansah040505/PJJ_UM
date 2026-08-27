var malang = ee.FeatureCollection('FAO/GAUL/2015/level2')
  .filter(ee.Filter.eq('ADM2_NAME','Malang'));
  
var style = {
  color: 'blue',
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

Map.centerObject(malang, 9);
Map.addLayer(malang.style(style), {}, 'Batas Malang ()')
