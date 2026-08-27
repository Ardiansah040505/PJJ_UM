var surabaya = ee.FeatureCollection('FAO/GAUL/2015/level2')
  //.filter(ee.Filter.eq('ADM0_NMAE','Indonesia'))
  .filter(ee.Filter.eq('ADM2_NAME','Kota Surabaya'));
  
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


Map.centerObject(surabaya,9);
