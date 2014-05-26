//Crockford's Object.create

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

var markerPrototype = {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-77,39]
    },
    "properties": {
        "description": "Fire",
        "title": " "
    }
};


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
      cancelBtn.innerHTML = '<a href="#">&#8592; Cancel</a>';

  var placeBtn = document.createElement('div');
      placeBtn.id="place-btn";
      placeBtn.innerHTML = '<a href="#" class="btn">Place</a>';

  var findBtn = document.createElement('div');
      findBtn.id= "findBtn";
      findBtn.innerHTML = '<a href="#">Find Me &#8620;</a>'

  var crosshairs = document.createElement('div');
      crosshairs.id= "crosshairs";

  var backBtn = document.createElement('div');
      backBtn.id="back-btn";
      backBtn.innerHTML = '<a href="#">&#8592; Back</a>';

  var saveBtn = document.createElement('div');
      saveBtn.id="place-btn";
      saveBtn.innerHTML = '<a href="#" class="btn">Save</a>';

  var formWell = document.createElement('div');
      formWell.id="form-well";
      formWell.innerHTML = '<form action=""><label>Intersection</label><hr><input type="text" name="title" placeholder="e.g. 10th St. NW & G St. NW"><br /><label>Callbox Type</label><hr><input type="radio" name="type" checked="checked" value="Fire">Fire<input type="radio" name="type" value="Police">Police<br /><input type="radio" name="type" value="Fancy">Fancy<input type="radio" name="type" value="Broken">Broken :(</form>';

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
    navRight.appendChild(findBtn);
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

  var newMarker = Object.create(markerPrototype);
  
  findBtn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    map.locate();

    // if it finds that you are outside DC than it should throw an error

  };

  map.on('locationfound', function(e) {
    map.fitBounds(e.bounds);
    navRight.removeChild(findBtn);

  });

  placeBtn.onclick= function () {
    
    var coordsX = map.getSize().x/2;
    var coordsY = map.getSize().y/2;
    var centerPos = L.point(coordsX, coordsY);
    var markerCoords = map.containerPointToLatLng(centerPos);
    console.log(markerCoords.lat);
    console.log(markerCoords.lng);
    
    navLeft.removeChild(cancelBtn);
    navCenter.removeChild(placeBtn);
    navRight.removeChild(findBtn);
    main.removeChild(crosshairs);

    navLeft.appendChild(backBtn);
    navCenter.appendChild(saveBtn);
    main.appendChild(formWell);

    markerCoordsPoint = [markerCoords.lng,markerCoords.lat];

    newMarker.geometry.coordinates = markerCoordsPoint;

    return newMarker;

  }





  backBtn.onclick= function () {

    navLeft.removeChild(backBtn);
    navCenter.removeChild(saveBtn);
    main.removeChild(formWell);

    navLeft.appendChild(cancelBtn);
    navCenter.appendChild(placeBtn);
    main.appendChild(crosshairs);

  }
  
  // 3. 

  saveBtn.onclick= function () {

    navLeft.removeChild(backBtn);
    navCenter.removeChild(saveBtn);
    main.removeChild(formWell);

    var input = document.getElementsByName('title');

    var markerTitle = input.value;
    newMarker.properties.title = markerTitle;

    var radios = document.getElementsByName('type');

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
          // do whatever you want with the checked radio
          var markerType = radios[i].value;

          // only one radio can be logically checked, don't check the rest
          break;
      }
    }
    newMarker.properties.description = markerType;
    newMarker.addTo(map);
    return newMarker;
  }
  
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

// still need to enable slide and zoom to user position.

  // function doGeo( position ) {
  //   console.log("userLat: " + position.coords.latitude );
  //   console.log("userLon: " + position.coords.longitude );
  //   console.log("positionAcc: " + position.coords.accuracy );
  //   return position;
    
  // }

  // function lost(){}
  
  // navigator.geolocation.watchPosition( doGeo, lost, {maximumAge:0,enableHighAccuracy:true} );







