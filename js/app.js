
// attributes for each marker
var myIcon = L.icon({
  iconUrl: 'images/marker.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  // distance of tooltip from anchor
  popupAnchor: [0, -15]
});

// creates map from .mbtiles file
// actually points to a file inside of that .mbtiles file
// enabled by tileserver.php, loading nessesary tiles as needed
var map = L.mapbox.map('map', 'server/dc-callbox-project.tilejson');

// adding marker layer to map tiles
var featureLayer = L.mapbox.featureLayer()
  .addTo(map);
    
// referencing above attributes for marker styles 
featureLayer.on('layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature;

    marker.setIcon(myIcon);
});

//hover functionality for marker tooltips
featureLayer.on('mouseover', function(e) {
    e.layer.openPopup();
});
featureLayer.on('mouseout', function(e) {
    e.layer.closePopup();
});

// makes the .geojson the reference for the marker layer
featureLayer.loadURL('server/callboxes.geojson')