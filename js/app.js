
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


// Custom method to get center of view

L.Map.prototype.findViewCenter = function (latlng, offset, options) {
    var x = this.latLngToContainerPoint(latlng).x - offset[0]
    var y = this.latLngToContainerPoint(latlng).y - offset[1]
    var point = this.containerPointToLatLng([x, y])
    return point;
}



// creates map from .mbtiles file
// actually points to a file inside of that .mbtiles file
// enabled by tileserver.php, loading nessesary tiles as needed
var map = L.mapbox.map('map', 'server/dc-callbox-project-v2.tilejson');






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
featureLayer.loadURL('callboxes.geojson');





// new marker creation

// adding a custom add button


  // var addButton =  document.createElement('a')
  // addButton.id="add";
  // addButton.innerHTML = "+";


  //mapContainer.appendChild(addButton);


//getting center of map

function getCenter() {
  var coordsX = map.getSize().x/2;
  var coordsY = map.getSize().y/2;
   var centerPos = L.point(coordsX, coordsY);
  var markerCoords = map.containerPointToLatLng(centerPos);
  return markerCoords;
}

//call getCenter().lat
//     getCenter().lng


// addButton.onclick= function(){

//   var newMarker = L.marker(new L.LatLng(38.9100,-77.0000), {
//                   icon: fireIcon,
//                   draggable: true
//               });

//   newMarker.bindPopup('Intersection:<br /><i>e.g. 10 St. NW & G St. NW</i><br /><input type="text" label="Intersection" id="intersection" /><br /><br />Type:<br /> <input type="radio" name="type" value="fire">Fire<input type="radio" name="type" value="police">Police<input type="radio" name="type" value="other">Other<br /><br /><button id="save">Save</button><a style="text-align:right; float:right;" href="#">Cancel</a>');
//   newMarker.addTo(map);
//   newMarker.openPopup();

//   // every time the marker is dragged, update the form
//   newMarker.on('dragend', ondragend);

//   // set the initial values in the form
//   ondragend();

//   function ondragend() {
//       var ll = newMarker.getLatLng();
//       console.log(ll.lat);
//       console.log(ll.lng);
//   }
     

// };


// user lat/long capturing

function doGeo( position ) {
    console.log("userLat: " + position.coords.latitude );
    console.log("userLon: " + position.coords.longitude );
    console.log("positionAcc: " + position.coords.accuracy );
}

function lost(){}

navigator.geolocation.watchPosition( doGeo, lost, {maximumAge:0,enableHighAccuracy:true} );




