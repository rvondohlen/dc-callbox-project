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


// attributes for each marker icon style
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
  popupAnchor: [0,-25]
});

// creates map from .mbtiles file
// actually points to a file inside of that .mbtiles file
// enabled by tileserver.php, loading nessesary tiles as needed
var map = L.mapbox.map('map', 'rvondohlen.693pu8fr');

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
 

// adding a custom add button and info button

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
      formWell.innerHTML = '<form action=""><label>Callbox Type</label><hr><input type="radio" name="type" checked="checked" value="Fire"><img src="images/marker-fire.svg" alt="" />Fire<input type="radio" name="type" value="Police"><img src="images/marker-police.svg" alt="" />Police<br /><label>Intersection (optional)</label><hr><input type="text" name="title" placeholder="e.g. 10th St. NW & G St. NW"></form>';
      // for later : <input type="radio" name="type" value="Fancy">Fancy<input type="radio" name="type" value="Broken">Broken

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
  // escape hatch
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
    if (findBtn.parentNode == navRight){
      navRight.removeChild(findBtn);
    }
    main.removeChild(crosshairs);

    navLeft.appendChild(backBtn);
    navCenter.appendChild(saveBtn);
    main.appendChild(formWell);

    markerCoordsPoint = [markerCoords.lng,markerCoords.lat];

    newMarker.geometry.coordinates = markerCoordsPoint;

    return newMarker;


  }

  // escape hatch 2
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
    //Getting value of 'type' radio buttons
    var radios = document.getElementsByName('type');

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
          var markerType = radios[i].value;
          console.log(markerType);
          break;
      }
    }

    //assigning icon type to radio values      
    if (markerType == "Police") {
      var newMarkerIcon = policeIcon;
    } else if (markerType == "Fire") {
      var newMarkerIcon = fireIcon;
    }

    //getting written intersection as title 
    var input = document.getElementsByName('title');

    var markerTitle = input.value;
    
    //priming for newMarker Object
    newMarker.properties.title = markerTitle;
    newMarker.properties.description = markerType;
     
    //plotting newMarker 
    var newMarkerPlot = L.marker(new L.LatLng(newMarker.geometry.coordinates[1],newMarker.geometry.coordinates[0]), {
        icon: newMarkerIcon
    });

    newMarkerPlot.addTo(map);
    //this should use the object eventually or better the compiled GeoJSON

    navLeft.removeChild(backBtn);
    navCenter.removeChild(saveBtn);
    main.removeChild(formWell);
  
    setup();
    return newMarker;


  }

