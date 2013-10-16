jandi
=====

Version 1.7.1
2013-10-15

javascript and i - an essential set of tools
jandi.kriogenx.net
Alex Vaos - simplex0@gmail.com
Started 2011-08-30
jandi.kriogenx.net/source/license.txt

# Packages
* jandi - an essential set of tools for validation, formatting, cookies,
  css
* jandi-reset - a good clean reset, that only resets what browsers may
  not have in common, rather than everything
* jandi-ui - a bootstrapping set of CSS and images to get your project
  off the ground
* jandi-form - form validation to get your forms out the door quickly
* jandi-agent - a User Agent parser to determine some unsniffable
  functionality
* jandi-modernifier - get older browsers up to date so all functionality
  exists and works the same
* jandi-app - organize your app properly, and have a way of knowing your
  environment
* jandi-data - some commonly used sample data
* jandi-sorter - Sort collections in different ways for big data.

## Jandi
### $.validate and $.format
$.validate - validate to see if a string matches a type
$.format - format a string to many different type

Field Types:
* Person Name - Alphanumerics, spaces, dashes and periods
* Email
* Password or Password Strict
* Number or Number with Commas
* Money
* Mileage
* Phone with or without paranthesis
* VIN
* Credit Card - VISA, MasterCard, AMEX, Discover, DinersClub

### $.cookie
$.cookie - easily set, get, destroy cookies and store JSON in cookies to
the correct domain painlessly

Lets assume we have some JSON we want to store
var some_json = {
  test: 'I want to start something in a cookie'
};

#### Set Cookie
$.cookie("some_json_cookie", some_json);

or optionally

$.cookie.set("some_json_cookie", some_json);

This will serialize the JSON object and store it in the cookie.

#### Get Cookie
$.cookie("some_json_cookie");

or optionally

$.cookie.get("some_json_cookie");

This will retrieve are JSON object exactly the way we had it before we
stored it in a cookie.

### $.timer

Convert any time to any time

### jQuery Tools

### Modules ###
* ScreenKeep
* ImageLoad - Detect if an image is done downloading
* Jax - a better way to accepting JSON
* Responsive Triggers - Trigger events when switching to Screen widths
  for mobile
* SlideIn
* Geolocate - Easy Google Maps integrations

## jandi-reset ##
Simple, straight forward way of normalizing all browsers, without having
a long list of inheritances.

