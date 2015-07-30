//app.js


L.mapbox.accessToken = 'pk.eyJ1IjoicnZvbmRvaGxlbiIsImEiOiJ0WHFyM1hRIn0.YNQ1RlsmSD6hAbSqmif7FA';

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
  iconUrl: 'images/fire-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  // distance of tooltip from anchor
  popupAnchor: [0,-25],
  className: 'fire-icon'
});

var policeIcon = L.icon({
   iconUrl: 'images/police-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0,-25],
  className: 'police-icon'
});

var fancyIcon = L.icon({
  iconUrl: 'images/fancy-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0,-25],
  className: 'fancy-icon'
});

var missingIcon = L.icon({
  iconUrl: 'images/missing-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0,-25],
  className: 'missing-icon'
});

// var fireIcon = L.icon({
//   iconUrl: 'images/fire-marker.svg',
//   iconSize: [24, 32],
//   iconAnchor: [12, 32],
//   // distance of tooltip from anchor
//   popupAnchor: [0,-25],
//   className: 'fire-icon'
// });

// var policeIcon = L.icon({
//   iconUrl: 'images/police-marker.svg',
//   iconSize: [24, 32],
//   iconAnchor: [12, 32],
//   popupAnchor: [0,-25],
//   className: 'police-icon'
// });

// var fancyIcon = L.icon({
//   iconUrl: 'images/fancy-marker.svg',
//   iconSize: [24, 32],
//   iconAnchor: [12, 32],
//   popupAnchor: [0,-25],
//   className: 'fancy-icon'
// });

// var missingIcon = L.icon({
//   iconUrl: 'images/missing-marker.svg',
//   iconSize: [24, 32],
//   iconAnchor: [12, 32],
//   popupAnchor: [0,-25],
//   className: 'missing-icon'
// });

// var fireDot = L.icon({
//   iconUrl: 'images/fire-dot.png',
//   iconSize: [12, 12],
//   iconAnchor: [6, 6],
//   popupAnchor: [0,-12]
// });

// var policeDot = L.icon({
//   iconUrl: 'images/police-dot.png',
//   iconSize: [12, 12],
//   iconAnchor: [6, 6],
//   popupAnchor: [0,-12]
// });

// var fancyDot = L.icon({
//   iconUrl: 'images/fancy-dot.png',
//   iconSize: [12, 12],
//   iconAnchor: [6, 6],
//   popupAnchor: [0,-12]
// });

// var missingDot = L.icon({
//   iconUrl: 'images/missing-dot.png',
//   iconSize: [12, 12],
//   iconAnchor: [6, 6],
//   popupAnchor: [0,-12]
// });

//gets mapbox map via api
var map = L.mapbox.map('map', 'rvondohlen.693pu8fr');

map.setView([38.9013,-77.036],14);

var data;

$.ajax({
dataType: "json",
async: false,
url: "http://megapixelsoftware.com/callboxes/get.php",
'success': function (json) {
     data = json;
     console.log('json data');
     return data;
    // Finishes loading before exiting
  }
});

console.log(data);

var featureLayer;

var rem = function(id) {
  console.log('delete ' + id);
  $.ajax({
  data: {'id':id},
  async: true,
  url: "http://megapixelsoftware.com/callboxes/protected/delete.php",
  'success': function (json) {
       console.log('respose', json);
       // notify on success or failure
       // return data;

    }
  });

}

// adding marker layer to map tiles
var drawLayer = function(){
  
  featureLayer = L.mapbox.featureLayer().addTo(map);

  featureLayer.on('layeradd', function(e) {
    var marker = e.layer,
     feature = marker.feature;

     var currentZoom = map.getZoom();

     
        if( feature.properties.description === 'Police'){
          marker.setIcon(policeIcon);
        }else if( feature.properties.description === 'Fancy'){
          marker.setIcon(fancyIcon);
        }else if( feature.properties.description === 'Missing'){
          marker.setIcon(missingIcon);
        }
        else{marker.setIcon(fireIcon);}
     

    
    
  });

  featureLayer.setGeoJSON(data);
  var i = 0;
  featureLayer.eachLayer(function(layer) {

      // here you call `bindPopup` with a string of HTML you create - the feature
      // properties declared above are available under `layer.feature.properties
      var id = data.ids[i++];
      var content = '<p style="color: #999; font-size: 8px; margin:0;" >ID# ' + id + '<\/p>' +
          '<b>' + layer.feature.properties.title + '</b>' +
          '<p>' + layer.feature.properties.description + '<\/p>';
          // '<div style="float:right" onclick="rem('+ id +')">remove</div>';
          //console.log(id);

      layer.bindPopup(content);
  });

  return featureLayer;
};

drawLayer();


  var newMarker = Object.create(markerPrototype);


// should do this using events
$( "#find-btn" ).onclick = function (e) {
    console.log('find button clicked')
    e.preventDefault();
    e.stopPropagation();
    map.locate();
};

map.on('locationfound', function(e) {
  if( e.latitude > 38.999 || e.latitude < 38.798 ){
    alert("Hm, doesn't look like you're located within the District.");
  } else if( e.longitude < -77.120 || e.longitude > -76.907 ) {
    alert("Hm, doesn't look like you're located within the District.");
  } else {
    map.fitBounds(e.bounds);
  }

  $( "#find-btn" ).hide();
});

map.on('zoomend', function(event) {
    var zoomLevel = map.getZoom();
    if (zoomLevel < 14){
          $(".fire-icon").attr("src","images/fire-dot.png");
          $(".fancy-icon").attr("src","images/fancy-dot.png");
          $(".police-icon").attr("src","images/police-dot.png");
          $(".missing-icon").attr("src","images/missing-dot.png");
      
      if ( zoomLevel === 13 ) {
        $( ".leaflet-marker-icon" ).each(function() {
          $(this).height(10);
          $(this).width(10);
          $(this).css({ 'margin-top': '-5px' });
          $(this).css({ 'margin-left': '-5px' });
        });
      } else if ( zoomLevel === 12 ) {
        $( ".leaflet-marker-icon" ).each(function() {
          $(this).height(8);
          $(this).width(8);
          $(this).css({ 'margin-top': '-4px' });
          $(this).css({ 'margin-left': '-4px' });
        });
      }
    } else {
      $(".fire-icon").attr("src","images/fire-marker.svg");
      $(".fancy-icon").attr("src","images/fancy-marker.svg");
      $(".police-icon").attr("src","images/police-marker.svg");
      $(".missing-icon").attr("src","images/missing-marker.svg");  
      $( ".leaflet-marker-icon" ).each(function() {
          $(this).height(32);
          $(this).width(24);
          $(this).css({ 'margin-top': '-32px' });
          $(this).css({ 'margin-left': '-12px' });
      });
    }
});

/////////////////
// Backbone UI //
/////////////////


// adding an 'enter' keypress plugin

$('input').keypress(function(e){
  if(e.keyCode === 13){
    $(this).trigger('enter');
  }
});

var app = {};



app.editingSwitch = function() {
  var element = document.getElementById('edit-map');
  if (window.location.href.indexOf("#") === -1) {
    element.style.display = "none";
  } else if(window.location.href.indexOf("#") > -1) {
    element.style.display = "block";
  }
} 



// app.Model = Backbone.Model.extend({
//   defaults: {
//     "type": "Feature",
//     "geometry": {
//         "type": "Point",
//         "coordinates": [-77,39]
//     },
//     "properties": {
//         "description": "Fire",
//         "title": "undedefined"
//     }
//   }
// });

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
    events: {
      'click #find-btn': 'find',
      'click #place-btn': 'place',

    },
    initialize: function () {
        this.render();
    },
    render: function () {
      this.$el.html(this.template());
    },
    find: function (e) {
      console.log('find button clicked')
      e.preventDefault();
      e.stopPropagation();
      map.locate();
    },
    place: function() {
      var coordsX = map.getSize().x/2;
      var coordsY = map.getSize().y/2;
      var centerPos = L.point(coordsX, coordsY);
      var markerCoords = map.containerPointToLatLng(centerPos);
      console.log(markerCoords.lat);
      console.log(markerCoords.lng);

      markerCoordsPoint = [markerCoords.lng,markerCoords.lat];

      newMarker.geometry.coordinates = markerCoordsPoint;

      return newMarker;
    }

});

app.DetailsView = Backbone.View.extend({
    template: _.template($("#details").html()),
    events: {
        'click #save-btn': 'create',
        'enter #callbox-title': 'create'
    },
    initialize: function () {
        this.render();
    },
    render: function () {
      this.$el.html(this.template());
    },
    create: function() {
      console.log('add new one');
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
      } else if (markerType == "Fancy") {
        var newMarkerIcon = fancyIcon;
      } else if (markerType == "Missing") {
        var newMarkerIcon = missingIcon;
      }

      //getting written intersection as title
      var input = document.getElementsByName('title');

      var markerTitle = input.value;

      //priming for newMarker Object
      newMarker.properties.title = markerTitle;
      newMarker.properties.description = markerType;

      // add newMarker to our external data set using ajax for approval
      var markerData = JSON.stringify(newMarker);

      console.log("New Marker", newMarker);
      console.log(markerData);
      $.ajax({
      data: newMarker,
      async: true,
      url: "http://megapixelsoftware.com/callboxes/add.php",
      'success': function (json) {
           console.log('respose', json);
           // notify on success or failure
           // return data;

        }
      });

      var numberOfFeatures = data.features.length;

      data.features[numberOfFeatures] = newMarker;

      featureLayer.clearLayers();
      drawLayer();

      return data;
      return newMarker;
      app.navigate("#", {trigger: true});
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


var openInfo = function() {
  $(".info").velocity({translateY:"0"},200);
  $('body').css('overflow', 'scroll');
  
};
var closeInfo = function() {
  $(".info").velocity({translateY:"100%"},200);
  $('body').css('overflow', 'hidden');
};



