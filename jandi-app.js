/*
// jandi-app
// 2013-10-11
//
// Start your app right, with proper application bootstrapping.
// Supports environment detection, debugging, and app routing.
//
// REQUIRES:
// jQuery
*/

if (typeof app != 'object')
  var app = {};

app.detectEnvironment = function() {
	var l = location.hostname || location.name;
	if (l.indexOf(".local") > -1 || l.indexOf("local.") > -1) a.local = true;
	if (l.indexOf(".dev") > -1 || l.indexOf("dev.") > -1 || a.local) a.dev = true;
};

app.debug = function() {
	// arguments;
};

app.route = function( r, url ) {
  if (!r) r = this.routes;
  if (!url) url = location.pathname.toLowerCase().replace(/^\/+/g,'');
  // $.debug( ['routes', r, url]);

  for( i in r ) {
    //$.debug( ['r', r[i].pattern, r[i].view, url.match( r[i].pattern ) ] );
    $.debug( ['LOADING ROUTE', r[i] ] );

    // CHECK IF ROUTE IS STRING
    if (typeof r[i] == 'string') {
      if (typeof app.view[r[i]] == 'function')
        $(app.view[r[i]]);
      else if (app.view[r[i]].init)
        $(app.view[r[i]].init);
    }
    else if
      (
        r[i].pattern && r[i].view &&
        ( url.match( r[i].pattern ) || ( r[i].pattern.test && r[i].pattern.test( url ) ) )
      )
    {
      /*
      if (r[i].view.init) {
        $(r[i].view.init);
      } else if ($.type(r[i].view) == 'function') {
        $(r[i].view);
      }
     */
      if (typeof r[i].view == 'function')
        $(r[i].view);
      else if (app.view[r[i]].init)
        $(app.view[r[i]].init);
      break;
    }
  }
};

app.init = function() {
	$.app.detectEnvironment();
	if ($.app.routes)
		$.app.route( $.app.routes || app.routes);
};

