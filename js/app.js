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






var newMarker = Object.create(markerPrototype);

// should do this using events
      
$( "#find-btn" ).onclick = function (e) {
    console.log('find button clicked')
    e.preventDefault();
    e.stopPropagation();
    map.locate();
    //  LATER: if it finds that you are outside DC than it needs to throw an error
};

map.on('locationfound', function(e) {
  map.fitBounds(e.bounds);
  $( "#find-btn" ).hide();
});




//   placeBtn.onclick= function () {
    
//     var coordsX = map.getSize().x/2;
//     var coordsY = map.getSize().y/2;
//     var centerPos = L.point(coordsX, coordsY);
//     var markerCoords = map.containerPointToLatLng(centerPos);
//     console.log(markerCoords.lat);
//     console.log(markerCoords.lng);
    
//     navLeft.removeChild(cancelBtn);
//     navCenter.removeChild(placeBtn);
//     if (findBtn.parentNode == navRight){
//       navRight.removeChild(findBtn);
//     }
//     main.removeChild(crosshairs);

//     navLeft.appendChild(backBtn);
//     navCenter.appendChild(saveBtn);
//     main.appendChild(formWell);

//     markerCoordsPoint = [markerCoords.lng,markerCoords.lat];

//     newMarker.geometry.coordinates = markerCoordsPoint;

//     return newMarker;


//   }

//   // escape hatch 2
//   backBtn.onclick= function () {

//     navLeft.removeChild(backBtn);
//     navCenter.removeChild(saveBtn);
//     main.removeChild(formWell);

//     navLeft.appendChild(cancelBtn);
//     navCenter.appendChild(placeBtn);
//     main.appendChild(crosshairs);

//   }
  
//   // 3. 
//   saveBtn.onclick= function () {
//     //Getting value of 'type' radio buttons
//     var radios = document.getElementsByName('type');

//     for (var i = 0, length = radios.length; i < length; i++) {
//       if (radios[i].checked) {
//           var markerType = radios[i].value;
//           console.log(markerType);
//           break;
//       }
//     }

//     //assigning icon type to radio values      
//     if (markerType == "Police") {
//       var newMarkerIcon = policeIcon;
//     } else if (markerType == "Fire") {
//       var newMarkerIcon = fireIcon;
//     }

//     //getting written intersection as title 
//     var input = document.getElementsByName('title');

//     var markerTitle = input.value;
    
//     //priming for newMarker Object
//     newMarker.properties.title = markerTitle;
//     newMarker.properties.description = markerType;
     
//     //plotting newMarker 
//     var newMarkerPlot = L.marker(new L.LatLng(newMarker.geometry.coordinates[1],newMarker.geometry.coordinates[0]), {
//         icon: newMarkerIcon
//     });

//     newMarkerPlot.addTo(map);
//     //this should use the object eventually or better the compiled GeoJSON

//     navLeft.removeChild(backBtn);
//     navCenter.removeChild(saveBtn);
//     main.removeChild(formWell);
  
//     setup();
//     return newMarker;


//   }

var app = {};

app.IndexView = Backbone.View.extend({
    template: _.template($("#index").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
        this.$el.html(this.template());
    }
});

app.LocationView = Backbone.View.extend({
    template: _.template($("#location").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
      this.$el.html(this.template());
    }
});
  
app.DetailsView = Backbone.View.extend({
    template: _.template($("#details").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
      this.$el.html(this.template());
    }
});
  
app.Router = Backbone.Router.extend({
    routes: {          
        '': 'indexRoute',
        'location': 'locationRoute',
        'details': 'detailsRoute',        
    },

    indexRoute: function () {
        var indexView = new app.IndexView();          
        $("#top-bar").html(indexView.el);
    },
    locationRoute: function () {
        var locationView = new app.LocationView();          
        $("#top-bar").html(locationView.el);
    },
    detailsRoute: function () {
        var detailsView = new app.DetailsView();          
        $("#top-bar").html(detailsView.el);
    }
});

var appRouter = new app.Router();
Backbone.history.start();



