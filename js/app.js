// app.js

// mapbox setup
L.mapbox.accessToken = 'pk.eyJ1IjoicnZvbmRvaGxlbiIsImEiOiJ0WHFyM1hRIn0.YNQ1RlsmSD6hAbSqmif7FA';
var map = L.mapbox.map('map', 'rvondohlen.693pu8fr', {
  zoomControl: false,
  tileLayer: { detectRetina: true } 
}).setView([38.9013,-77.036], 13);

// attributes for each marker icon style
var fireIcon = L.icon({
  iconUrl: 'images/fire-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  // distance of tooltip from anchor
  popupAnchor: [0,-30],
  className: 'fire-icon'
});

var policeIcon = L.icon({
   iconUrl: 'images/police-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0,-30],
  className: 'police-icon'
});

var fancyIcon = L.icon({
  iconUrl: 'images/fancy-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0,-30],
  className: 'fancy-icon'
});

var missingIcon = L.icon({
  iconUrl: 'images/missing-marker.svg',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0,-30],
  className: 'missing-icon'
});


var data;
var datas = [];
var featureLayer;


// Firebase data 
var base = new Firebase( 'https://sweltering-fire-2275.firebaseio.com/' );

  // pull in static version if firebase call fails
base.on('child_added', function(snapshot) {
  
  featureLayer = L.mapbox.featureLayer().addTo(map);
  data = snapshot.val();
  datas.push(data);
  featureLayer.on('click', function(e) {
    map.panTo(e.layer.getLatLng());
  });
  //add in navigation between markers
  featureLayer.on('layeradd', function(e) {
    var marker = e.layer,
    feature = marker.feature;
    
    if( feature.properties.kind === 'Police'){
      marker.setIcon(policeIcon);
    }else if( feature.properties.kind === 'Fancy'){
      marker.setIcon(fancyIcon);
    }else if( feature.properties.kind === 'Missing'){
      marker.setIcon(missingIcon);
    }
    else{marker.setIcon(fireIcon);}

    var content = '<img class="marker-photo" src="' + feature.properties.image + '" style="width:188px" />' +
    '<p>' + feature.properties.kind + ' Style Marker</p>' +
    '<h2>' + feature.properties.intersection + '</h2>'  ;

    marker.bindPopup(content,{
      closeButton: false,
      minWidth: 320
    });

  });



  featureLayer.setGeoJSON(data);

}, function (errorObject) {
  console.log("Firebase read failed: " + errorObject.code);
  console.log("Use Static Data");
});




// 'find me' functionality
// could likely be folded into backbone
$("#find-btn").click( function(e){
      console.log('find button clicked');
      e.preventDefault();
      e.stopPropagation();
      $(this).velocity({translateY: "0" },"easeInOutCubic");
      map.locate();
});

map.on('locationfound', function(e) {
  if( e.latitude > 38.999 || e.latitude < 38.798 ){
    alert("Hm, doesn't look like you're located within the District.");
  } else if( e.longitude < -77.120 || e.longitude > -76.907 ) {
    alert("Hm, doesn't look like you're located within the District.");
  } else {
    map.fitBounds(e.bounds);
  }
  $("#find-btn").hide();
});

//switching out icons based on zoom level
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

// holding object
var app = {};

//var newMarker = Object.create(markerPrototype);
var newMarker = {};

app.editingSwitch = function() {
  var element = document.getElementById('edit-map');
  if (window.location.href.indexOf("#") === -1) {
    element.style.display = "none";
  } else if(window.location.href.indexOf("#") > -1) {
    element.style.display = "block";
  }
} 

app.IndexView = Backbone.View.extend({
  template: _.template($("#index").html()),
  initialize: function () {
    this.render();
    $("#top-bar").velocity({translateX:"0"},{ duration:250, easing: "easeInOutCubic"});
    $("#crosshairs").hide();
    $(".note").velocity({translateY: "0" });
    $(".find-btn").velocity({translateY: "0" },"spring");
  },

  render: function () {
    this.$el.html(this.template());
  }
});

app.LocationView = Backbone.View.extend({
  template: _.template($("#location").html()),
  events: {
    'click #place-btn': 'place'
  },

  initialize: function () {
    $(".marker-types").fadeOut();
    $(".cover").fadeOut();
    this.render();
    $("#top-bar").velocity({translateX:"-33.34%"},{ duration:250, easing: "easeInOutCubic"});
    $("#crosshairs").fadeIn();
    $(".find-btn").velocity({translateY: "-72px" },"easeInOutCubic");
    $(".note").html("Place the marker using the crosshairs.");
    $(".note").velocity({translateY: "110px" },"spring");
  },

  render: function () {
    this.$el.html(this.template());
  },

  place: function() {
    var coordsX = map.getSize().x/2;
    var coordsY = map.getSize().y/2;
    var centerPos = L.point(coordsX, coordsY);
    var markerCoords = map.containerPointToLatLng(centerPos);
    
    // var markerPrototype = L.marker([-77,39]);
    newMarker = L.marker([markerCoords.lat,markerCoords.lng]);


    //newMarker.geometry.coordinates = markerCoordsPoint;

    console.log(newMarker);
    return newMarker;
  }
  //return newMarker;
});

app.DetailsView = Backbone.View.extend({
  template: _.template($("#details").html()),
  events: {
    'click .type': 'showSave',
    'click #save-btn': 'create'
  },

  initialize: function () {
    $("#crosshairs").hide();
    $(".note").velocity({translateY: "0" });
    $(".find-btn").velocity({translateY: "0" },"spring");
    $(".note").html("Choose the marker style.");
    this.render();
    $(".cover").fadeIn();
    $(".marker-types").fadeIn();
    $("#top-bar").velocity({translateX:"-66.67%"},{ duration:250, easing: "easeInOutCubic" });
    $(".note").velocity({translateY: "110px" },"spring");
  },

  render: function () {
    this.$el.html(this.template());
  },

  showSave: function(){
    $("#save-btn").velocity({translateY: "-10px" },"spring");
  },

  create: function() {
    var markerType = $(".type.active").data("type");
    var markerData = newMarker.toGeoJSON();

    $(".marker-types").fadeOut();
    $(".cover").fadeOut();
    $( ".type" ).each(function() {
      $(this).removeClass("active");
      $(this).removeClass("inactive");
    });

    //assigning markertype based on active icon
    markerData.properties.kind = markerType;

    markerData.properties.image = "";

    //getting written intersection as title
    var m = newMarker.getLatLng();
    var geonamesAPI = "http://api.geonames.org/findNearestIntersectionJSON?lat=" +  m.lat + "&lng=" + m.lng + "&username=vr24u554";

    $.getJSON( geonamesAPI, {
      format: "json"
    })
    .done(function( data ) {
      markerData.properties.intersection = data.intersection.street1 + " & " + data.intersection.street2;
    })
    .fail(function() {
      console.log( "Geonames API call failed." );
      markerData.properties.intersection = ""
    })
    .always(function() {
      datas.push(markerData);

      var onComplete = function(error) {
        if (error) {
          console.log('Synchronization failed');
        } else {
          console.log('Synchronization succeeded');
        }
      };
      base.set(datas, onComplete);
    });

  
  }

});

app.Router = Backbone.Router.extend({
  routes: {
    '': 'indexRoute',
    'location': 'locationRoute',
    'details': 'detailsRoute'
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

//fading out loading screen
window.addEventListener("load",function() {
  app.editingSwitch();
  setTimeout(function() {
    $(".loader").fadeOut(700, "linear");
  }, 500);
});

// toggling info screen
var toggleInfo = function() {
  if( $("#info").hasClass('hidden') ){
    $("#info").velocity({translateY:"0"},{ duration:100});
    $('body').css('overflow', 'scroll'); 
    $("#more-info").text("X");
    $("#info").toggleClass('hidden');
  } else {
    $("#info").velocity({translateY:"-100%"},{ duration:100});
    $('body').css('overflow', 'hidden');
    $("#more-info").text("?");
    $("#info").toggleClass('hidden');
  }
};

// type selector ui logic
// could likely be folded into backbone
$(".type").click(function(){
  $("#save-btn").fadeIn();
  $( ".type" ).each(function() {
    $(this).removeClass("active");
    $(this).addClass("inactive");
  });
  var clickedDiv = $(this);
  clickedDiv.removeClass("inactive");
  clickedDiv.addClass("active");
});
