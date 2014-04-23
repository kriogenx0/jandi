/*
// CREATE BOOKMARK WITH THIS LINK:
// javascript:var%20s%20=%20document.createElement('script');s.type='text/javascript';document.body.appendChild(s);s.src='http://kriogenx.net/cases/uicomponents/libraries/raptor/raptor-quick.js';void(0);
*/
var raptorall = {};
	
raptorall.h = document.getElementsByTagName("head")[0];

raptorall.cs = function(sr) { // CREATE SCRIPT
	var l = document.createElement('scr' + 'ipt');
	l.type='text/javascript';
	raptorall.h.appendChild(l);
	l.src=sr;
	// document.write("<sc" + "ript type=\"" + l.type + "\" src=\"" + sr + "/global/js/jquery-1.4.2.js\"></" + "sc" + "ript>");
	return l;
};

raptorall.cl = function(sr) { // CREATE LINK
	var l = document.createElement('link');
	l.rel = "stylesheet";
	l.type='text/css';
	raptorall.h.appendChild(l);
	l.href=sr;
	// document.write("<li" + "nk rel=\"" + l.rel + "\" type=\"" + l.type + "\" href=\"" + sr + "/global/js/jquery-1.4.2.js\" />");
	return l;
};

//ACTION
raptorall.cs("http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js");
raptorall.cs("http://kriogenx.net/cases/uicomponents/libraries/raptor/docs/jquery.js");
raptorall.cl("http://kriogenx.net/cases/uicomponents/libraries/raptor/raptor.css");
raptorall.cs("http://kriogenx.net/cases/uicomponents/libraries/raptor/raptor.js");
raptorall.cl("http://kriogenx.net/cases/uicomponents/libraries/raptor/uis/raptorui/ui.css");
raptorall.cs("http://kriogenx.net/cases/uicomponents/libraries/raptor/uis/raptorui/ui.js");
raptorall.cs("http://kriogenx.net/cases/uicomponents/libraries/raptor/uis/raptorui/quick.js");

if (console && console.log) console.log("RAPTOR LOADED");