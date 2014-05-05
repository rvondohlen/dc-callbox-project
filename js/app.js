
// attributes for each marker
var fireIcon = L.icon({
  iconUrl: 'images/marker-fire.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  // distance of tooltip from anchor
  popupAnchor: [0,-25]
});

var policeIcon = L.icon({
  iconUrl: 'images/marker-police.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  // distance of tooltip from anchor
  popupAnchor: [0,-25]
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

    if( feature.properties.description === 'Police'){
      marker.setIcon(policeIcon);
    }
    else{marker.setIcon(fireIcon);}
});

//hover functionality for marker tooltips
featureLayer.on('mouseover', function(e) {
    e.layer.openPopup();
});
featureLayer.on('mouseout', function(e) {
    e.layer.closePopup();
});

// makes the .geojson the reference for the marker layer
featureLayer.loadURL('callboxes.geojson')





// new marker creation

// adding a custom add button
var mapContainer = document.getElementById('map-container');

var addButton =  document.createElement('a')
addButton.id="add";
addButton.innerHTML = "+";
mapContainer.appendChild(addButton);




addButton.onclick= function(){

  var newMarker = L.marker(new L.LatLng(38.8921,-76.9582), {
                  icon: fireIcon,
                  draggable: true
              });

  newMarker.bindPopup('Intersection:<br /><input type="text" label="Intersection" id="intersection" /><br /><br />Type:<br /> <input type="radio" name="type" value="fire">Fire<input type="radio" name="type" value="police">Police<input type="radio" name="type" value="other">Other<br /><br /><button id="save">Save</button>');
  newMarker.addTo(map);
  newMarker.openPopup();
};


// lat/long capturing

// function doGeo( position ) {
//     console.log("lat: " + position.coords.latitude );
//     console.log("lon: " + position.coords.longitude );
//     console.log("acc: " + position.coords.accuracy );
// }

// function lost(){};

// navigator.geolocation.watchPosition( doGeo, lost, {maximumAge:0,enableHighAccuracy:true} );



