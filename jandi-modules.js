/*
jandi-modules

REQUIRES:
jQuery
*/

if (typeof jandi == 'undefined') var jandi = {};

/*
$.fn.pusher = function(o) {
  
  var t = $(this);
  var cl = [];
  var transitions = [];
  var detect = function() {
    cl = t.attr("class").split(" ");
    for (var i = 0; i < cl.length; i++) {
      if (cl[i]) {
        transitions.push(cl[i]);
      }
    };
  };
  
  var pre = function() {
  };
  
  var post = function() {
  };
  
  var run = function() {
    pre();
    post();
  };
  
  var reset = function() {
  };
  
  var init = function() {
  };

  return {
    items: t,
    run: run,
    reset: reset
  };  
};
*/



//=============
// GEO LOCATION

/*
// MARKER
{ 
    title: "First Vehicle Services-Davie", 
    position: new google.maps.LatLng(26.065590, -80.238861),
    icon: "http://www.ase.com///CMSWebParts/ASE/Images/PushPins/Blue_markerA.png"
}
*/

jandi.locator = function(fn) {
  navigator.geolocation.getCurrentPosition(function(position) {
    fn(position.coords.latitude, position.coords.longitude);
  });  
};

jandi.locationPost = function(url, vars) {

  jandi.locationPostIntances++;
  
  var f = $('<form id="jandi-locationPost-' + jandi.locationPostIntances + '" method="post" action="' + url + '">');
  
  for (var x in vars) {
    f.append('<input type="hidden" name="' + x + '" value="' + vars[x] + '" />');
  }
  
  var b = $('body');
  b.append(f);
  if (!f.length) f = b.find("form#jandi-locationPost-" + jandi.locationPostIntances);
  
  f.submit();

}
jandi.locationPostIntances = 0;

$.fn.googleMap = function(locations, zoom) {
  if (typeof window.google == 'undefined') return false;
  var g = window.google;

  $.googleMapsDialog = $.googleMapsDialog || null;
  var createInfoWindow = function(map, marker, infoWindowProperties) {
      var info = new g.maps.InfoWindow(infoWindowProperties);
  
      g.maps.event.addListener(marker, 'click', function () {
          if ($.googleMapsDialog != null)
              $.googleMapsDialog.close();
  
          info.open(map, marker);
          $.googleMapsDialog = info;
      });
  }

  var t = $(this);
  
  if (t.width() == 0) t.width(500);
  if (t.height() == 0) t.height(300);

  /*
  // LOCATIONS
  {
    name, lat, lon, address, city, state, zip, icon, phone, website
  }
  */

  if (locations && locations.length > 0)
    var myLatLng = new g.maps.LatLng(locations[0].lat, locations[0].lon);
  else
    var myLatLng = new g.maps.LatLng(0, 0);
  
  var options = {
      zoom: zoom || 12,
      center: myLatLng,
      mapTypeControl: false,
      mapTypeId: g.maps.MapTypeId.ROADMAP
  };

  var map_canvas = t[0];
  var map = new g.maps.Map(map_canvas, options);

  if (locations && locations.length > 0) {
    var bounds = new g.maps.LatLngBounds();

    // LOOP LOCATIONS
    for (var i = 0; i < locations.length; i++) {
      var loc = locations[i];

      var marker = {
        title: loc.name,
        position: new g.maps.LatLng( loc.lat, loc.lon ),
        icon: loc.icon
      };

      var googleMarker = new g.maps.Marker(marker);
      googleMarker.setMap(map);

      bounds.extend(googleMarker.getPosition());

      // DIALOG CONTENT
      var dialogContent = '<div class="googleMaps-dialog"><div class="location-title">' + loc.name + '</div>';
      dialogContent += loc.address + '<br />' + loc.city + ', ' + loc.state + ' ' + loc.zip + '<br />';
      if (loc.phone) dialogContent += loc.phone + '<br />';
      if (loc.website) dialogContent += '<a href="' + loc.website + '" target="_blank">' + loc.website + '</a>';
      dialogContent += '</div>';

      var dialogContent = {
        content: dialogContent
      };

        //if (infoWindowContents && infoWindowContents.length > i)
        createInfoWindow(map, googleMarker, dialogContent);
    }

    if (Math.abs(bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) < 0.003) {
        bounds.extend(new g.maps.LatLng(bounds.getNorthEast().lat() + 0.003, bounds.getNorthEast().lng() - 0.003));
        bounds.extend(new g.maps.LatLng(bounds.getSouthWest().lat() - 0.003, bounds.getSouthWest().lng() + 0.003));
    }

    if (locations.length > 1) {
        map.fitBounds(bounds);
    }

    map.setCenter(bounds.getCenter());
  }
}
