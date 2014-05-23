
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
var map = L.mapbox.map('map', 'server/dc-callbox-project-v2.tilejson');

map.setView([38.9013,-77.036],13);

// adding marker layer to map tiles
var featureLayer = L.mapbox.featureLayer();
  featureLayer.addTo(map);
    
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

// featureLayer.on('mouseover', function(e) {
//     e.layer.openPopup();
// });
// featureLayer.on('mouseout', function(e) {
//     e.layer.closePopup();
// });

// makes the .geojson the reference for the marker layer
featureLayer.loadURL('callboxes.geojson');



// new marker creation

// 1. hits edit button
//    --------------------------------
//    shows cancel, 'place' buttons, and x mark in center of view

// 2. hits 'place'
//    ----------------------------------------------
//    gets center of view under X, saves
//    shows box type picker, back and 'save' buttons

// 3. hits 'save'
//    ----------------------------------------------------------------------
//    saves data as attributes of object, pushes to tempGeoJSON and displays
 

// adding a custom add button

  var main = document.getElementById('main');

  var navLeft = document.getElementById('nav-left');  
  var navCenter = document.getElementById('nav-center');
  var navRight = document.getElementById('nav-right');




  //elements

  var editMapBtn =  document.createElement('div');
      editMapBtn.id="edit-map";
      editMapBtn.innerHTML = '<a href="#"><div class="icon edit-icon"></div></a>';

  var moreInfoBtn =  document.createElement('div');
      moreInfoBtn.id="more-info";
      moreInfoBtn.innerHTML = '<a href="#"><div class="icon info-icon"></div></a>';

  var cancelBtn = document.createElement('div');
      cancelBtn.id="cancel-btn";
      cancelBtn.innerHTML = '<a href="#">Cancel</a>';

  var placeBtn = document.createElement('div');
      placeBtn.id="place-btn";
      placeBtn.innerHTML = '<a href="#" class="btn">Place</a>';


  var crosshairs = document.createElement('div');
      crosshairs.id= "crosshairs";

  var backBtn = document.createElement('div');
      backBtn.id="back-btn";
      backBtn.innerHTML = '<a href="#">Back</a>';




  // setup
  var setup= function () {
    navLeft.appendChild(editMapBtn);
    navRight.appendChild(moreInfoBtn);
  }
  setup();
  // 1. 
  

  editMapBtn.onclick= function (){
    console.log('entering edit mode..')

    navLeft.removeChild(editMapBtn);
    navRight.removeChild(moreInfoBtn);

    navLeft.appendChild(cancelBtn);
    navCenter.appendChild(placeBtn);
    main.appendChild(crosshairs);

  }
  
  cancelBtn.onclick= function () {
    navLeft.removeChild(cancelBtn);
    navCenter.removeChild(placeBtn);
    main.removeChild(crosshairs);

    setup();

  }

  


  // 2.
  //getting center of map

  placeBtn.onclick= function () {
    var coordsX = map.getSize().x/2;
    var coordsY = map.getSize().y/2;
    var centerPos = L.point(coordsX, coordsY);
    var markerCoords = map.layerPointToLatLng(centerPos);
    //var markerCoords = containerPointToLatLng(centerPos);
    console.log(markerCoords.lat);
    console.log(markerCoords.lng);
  }
  //call 
  //     
  
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




