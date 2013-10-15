/*
// jandi
// Version 1.7.0
// 2013-10-15
//
// javascript and i
// jandi.kriogenx.net
// Alex Vaos
// simplex0@gmail.com
// Started 2011-08-30
// jandi.kriogenx.net/source/license.txt
//
// REQUIRES:
// jQuery
*/

(function($){
  
  //=======
  // FORMAT
  
  $.format = function(value, type) {
      var s = $.format;
      if (typeof(value) == 'undefined')
        return value;
      else if (typeof( s[type] ) == 'function')
        return s[type](value);
      else if (typeof(type) == 'function')
        return type(value);
      else
        return value;
  };
  
  $.format.number = function(v) {
      v = parseFloat((v + '').replace(/[^\d\.\-]/g, ''));
    return (!v || isNaN(v)) ? 0 : v;
  };
  
  $.format.numbercommas = function(v) {
    v = $.format.number(v) + '';
    x = v.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  };
  
  $.format.money = function(v) {
    v = parseFloat((v + '').replace(/[^\d\.\-]/g, '')).toFixed(2);
    x = v.split('.');
    x1 = x[0];
    var d = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return '$' + x1 + d;
  };
  
  $.format.mileage = function(v) {
    return $.format.number((v + '').replace(/[^\d\.\-]/g, '').substr(0, 6));
  }
  
  $.format.phoneParenthesis = function(v) {
    v = v.replace(/\D/g, "");
    return "(" + v.substr(0,3) + ") " + v.substr(3,3) + "-" + v.substr(6);
  };
  
  $.format.phone = function(v) {
    v = v.replace(/\D/g, "").substr(0, 10);
    var s = v.substr(0,3);
    if (v.length > 2) s += "-" + v.substr(3,3);
    if (v.length > 5) s += "-" + v.substr(6);
    return s.replace(/[\s-]*$/, "");
  };
  
  $.format.vin = function(v) {
    var a = v.replace(/[oq]/ig, 0).replace(/i/ig, 1).replace(/\W/g, "").toUpperCase().substring(0, 17);
    return a == 0 ? '' : a;
  };
  
  $.format.creditcard = $.format.cc = function(v) {
    var s = v.replace(/\D/g, "");
    s = s.substring(0, 16);
    
    var rgx = /(\d{4})(\d+)/;
    while (rgx.test(s)) {
      s = s.replace(rgx, '$1' + ' ' + '$2');
    }
    return s.replace(/\s*$/, "");
  };
  
  $.format.amex = function(v) {
    var s = v.replace(/\D/g, "");
    s = s.substring(0, 15);
    var rgx = /^(\d{4})(\d{0,6})(\d{0,5})/;
    s = s.replace(rgx, '$1' + ' ' + '$2' + " " + '$3');
    return s.replace(/\s*$/, "");
  };
  
  //=========
  // VALIDATE
  
  // ADD SUPPORT FOR MULTIPLE VALUES AND MULTIPLE TYPES
  // TYPES: required, empty, alphanumeric, email, phone, password, passwordStrict, creditCard, dinersClub, amex, visa, discover, jcb
  
  $.validate = function(value, type) {
    var t = $.validate;

    if (typeof value == 'number')
      value += '';
    
    if (typeof type == 'string')
      type = type.toLowerCase();
    
    if (typeof t[type] == 'function')
      return t[type](value);
    // REGEX
    else if (typeof(type) == "object" && typeof(type.test) != "undefined")
      return type.test(value);
    else if (typeof type == 'string' && type.length > 0)
      console.log('$.validate - VALIDATION TYPE NOT FOUND: ' + type);
    else
      return value.length > 0;
  };
  
  $.validate.methodExists = function(type) {
    return typeof this[type] != 'undefined';
  };
  
  $.validate.required = function(v) {
    return v.length > 0;
  };
  
  $.validate.empty = function(v) {
    return typeof v == 'undefined' || (v + '').length == 0;
  };
  
  $.validate.personname = function(v) {
    return /^[a-z'\s\.,-]+$/i.test(v) && v.length > 1 && v.length < 50;
  };
  
  $.validate.alphanumeric = function(v) {
    return /^[a-z0-9]+$/i.test(v);
  };
  
  $.validate.email = function(v) {
    //    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z][a-z.]{0,4}[a-z]?$/i.test(v);
  };

  $.validate.phone = function(v) {
    v = (v + '').replace(/\D/g, '');
    return v.length > 6 && v.length < 11;
  };

  $.validate.password = function(v) {
    return v.length > 5 && v.length < 32;
  };

  $.validate.passwordstrict = function(v) {
    // CAPITAL LETTER & NUMBER
    return (
      /[A-Z]/.test(v) &&
    //  /[!"#$%&'\(\)\*\+,\-\.\/:;<=>\?@\[\\\]^_`\{\|\}~]/.test(v) &&
      /\d/.test(v) &&
      !/\s/.test(v) &&
      v.length > 5 &&
      v.length < 20
    );
  };

  $.validate.creditcard = function(v) {
    return /^\d{4}[ \-]?\d{4}[ \-\d]{4,9}\d$/.test(v);
  };

  $.validate.dinersclub = function(v) {
    return /^3(0[0-5])|([68]\d)\d[ \-]?\d{6}[ \-]?\d{5}$/.test(v);
  };

  $.validate.amex = function(v) {
    return /^3[47]\d{2}[ \-]?\d{6}[ \-]?\d{5}$/.test(v);
  };

  $.validate.visa = function(v) {
    return /^4\d{3}[ \-]?\d{4}[ \-]?\d{4}[ \-]?\d{4}$/.test(v);
  };

  $.validate.mastercard = function(v) {
    return /^5\d{3}[ \-]?\d{4}[ \-]?\d{4}[ \-]?\d{4}$/.test(v);
  };

  $.validate.discover = function(v) {
    return /^6011[ \-]?\d{4}[ \-]?\d{4}[ \-]?\d{4}$/.test(v);
  };

  $.validate.jcb = function(v) {
    return /^(?:2131|1800|35\d{3})\d{11}$/.test(v);
  };
  
  $.validate.cvv = $.validate.ccv = $.validate.cardsecurity = function(v) {
    return /^\d{3,4}$/.test(v);
  };

  //==========
  // UTILITIES

  $.debug = function() {
    if (!window.console || !window.console.log) return;

    if (arguments.length == 1)
      console.log(arguments[0]);
    else
      console.log(arguments);
  };
  
  $.run = function(code) {
    try {
      return new Function("return " + code)();
    } catch (e) {
      $.debug("RUN ERROR:");
      $.debug(code);
    }
  };
  
  //=============
  // STATIC UTILS
  
  $.nonCharacterKeys = [9,16,17,18,27,37,38,39,40,91,117,224];
  
  // USE $.param FOR OBJECT TO QUERYSTRING
  // USE $.querystring FOR QUERYSTRING TO OBJECT

  $.queryString = function(key, url) {
    url = url || location.search;
    // REMOVE QUESTION MARK
    if (url.substring(0, 1) == "?") url = url.substring(1);
    
    var arr = url.replace(/;/g, '&').split('&'),
      t,
      o = {},
      name, val
    ;
    
    for (i = 0; i < arr.length; i++)
    {
      t = arr[i].split('=', 2);
      name = unescape(t[0]);
      val = unescape(t[1]);
        
      o[name] = val;
    }
    
    if (key && url) {
      return o[key];
    } else if (url) {
      return o;
    }
  };
  
  //===============
  // DATA UTILITIES
  
  $.removeObjectFromArray = function(arr, prop, val) {
    if ($.type(arr) != "array") return arr;
    
    for (var i = arr.length - 1; i > -1; i--) {
      
      if (arr[i][prop] == val) {
        arr.splice(i, 1);  
      }
      
    }
    return arr;
    
  }
  
  $.valueInObjectArray = function(arr, prop, val) {
    if ($.type(arr) != "array") return arr;
    
    for (var i = arr.length - 1; i > -1; i--) {
      if (arr[i][prop] == val) {
        return i;
      }
    }
    return false;
  }
  
  $.serialize = function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
      // simple data type
      if (t == "string") obj = '"'+obj+'"';
      return String(obj);
    }
    else {
      // recurse array or object
      var n, v, json = [], arr = (obj && obj.constructor == Array);
      for (n in obj) {
        v = obj[n]; t = typeof(v);
        if (t == "string") v = '"'+v+'"';
        else if (t == "object" && v !== null) v = $.serialize(v);
        json.push((arr ? "" : '"' + n + '":') + String(v));
      }
      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
  };
  
  
  $.dump = function (arr, level) {
    var dumped_text = "";
    if(!level) level = 0;
    
    //The padding given at the beginning of the line.
    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";
    
    if(typeof(arr) == 'object') { //Array/Hashes/Objects 
      for(var item in arr) {
        var value = arr[item];
        
        if(typeof(value) == 'object') { //If it is an array,
          dumped_text += level_padding + "'" + item + "' ...\n";
          dumped_text += dump(value,level+1);
        } else {
          dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
      }
    } else { //Stings/Chars/Numbers etc.
      dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    return dumped_text;
  };
  
  /*
  arrayToObject
  used to loop through array values
  
  26 in $.arrayToObject(['25', '30']) // returns true
  */
  $.arrayToObject = function(a)
  {
    var o = {};
    for (var i=0;i<a.length;i++) {
      o[a[i]] = true;
    }
    return o;
  }
  $.objectToArray = function(o)
  {
    var a = [];
    for (p in o) {
      a[p] = o[p];
    }
    return a;
  }
  $.objectToNewArray = function(o)
  {
    var a = [];
    for (p in o) {
      a.push(o[p]);
    }
    return a;
  }
  
  if (typeof(jandi) == "undefined") var jandi = {};
  /*
  jandi.inArray = function(val, array)
  {
    
    var r = false, l = array.length;
    for (var i = 0; i < l; i++) {
      if (val == array[i]) r = true;
    }
    return r;
    //return val in $.arrayToObject(array);
  }
  */
  
  $.pushDistinct = function(val, arr)
  {
    /*
    // CHECK ITEM
    if (val) {
      // CHECK FOR ARRAY
      if (val.push) {
        for (i in it) {
          // RECURSIVE
          arr = cleanItems(it[i], arr);
        }
        return arr;
      } else {
        // PUSH TO ARRAY
        //return $.pushDistinct(it, arr);
        if (($.inArray(val, arr)) == -1) arr.push(val);
      }      
    }
    return false;
    */
    
    if (arr && arr.push) {
      if (($.inArray(val, arr)) == -1) arr.push(val);
    }
    return arr;
  }
  
  $.stripCss = function(val) {
    val = parseInt(val.replace("px","").replace("%","").replace("em",""));
    return isNaN(val) ? 0 : val;
  };
  

  //=============
  // UI UTILITIES

  $.fn.noSelect = function() {
    var t = $(this);
  
    if ($.browser.mozilla) {
      return t.each(function() {
        t.css({
          'MozUserSelect': 'none'
        });
      });
    } else if ($.browser.msie) {
      t.onselectstart = function() { return false; }
      t.bind('selectstart', function() { return false; });
      /*
      return t.each(function() {
      t.bind('mousedown.disableTextSelect', function() {
      return false;
      });
      });*/
  
      /*
      if (typeof t.onselectstart != "undefined") //IE route
      t.onselectstart = function() { return false }
      else if (typeof t.style.MozUserSelect != "undefined") //Firefox route
      t.style.MozUserSelect = "none"
      */
  
    } else {
      t.each(function() {
        t.bind('selectstart.disableTextSelect', function() {
          return false;
        });
      });
  
      t.mousedown(function() { return false; });
    }
  }
  
  $.fn.voidLink = function() {
    return $(this).attr('href', 'javascript: void(0)');
  }
  
  // EVENT BINDER, TRIGGERER
  $.ev = function(e, fn) {
      var f = this.fnArray[e];
      if ($.type(f) != "array") f = [];
      // ADD EVENT
      if (fn) {
          f.push(fn);
      }
      // DELETE EVENTS
      else if (fn === 0) {
          this.fnArray[e] = [];
      }
      // RUN EVENTS
      else if ($.type(f) == "array") {
          for (x in f) {
              f[x]();
          }
      }
  };
  $.ev.fnArray = [];  
  
  
  // FLASH SUPPORT
  $.flashSupport = function() {
    try {
      if ( new ActiveXObject('ShockwaveFlash.ShockwaveFlash') ) return true;
    } catch (e) {}
    if (navigator.mimeTypes && navigator.mimeTypes ["application/x-shockwave-flash"] != undefined) return true;
    return false;
  };
  
  // BROWSER FEATURE SUPPORT
  $.sniff = {
    flash: $.flashSupport,
    placeholder: function() {
      return ("placeholder" in document.createElement("input"));
    }
  };
  
  ////////////////
  // COOKIES
  
  $.cookieHost = function() {
    return "." + location.host.match(/([^.]+(\.[^.]{2,5}))(:\d{1,5})?$/)[1];
  };
  
  $.jsonCookie = function(name, value, days, options) {
    if (typeof value == "undefined")
      return $.parseJSON($.cookie(name));
    else
      return $.cookie(name, $.serialize(value), days, options);
  };

  if (typeof $.cookie == 'undefined') {

    $.cookie = function(name, value, days, options) {  
      // DELETE
      if (value === null) {
        $.cookie.remove(name);
      }
      // SET
      else if (typeof(value) != 'undefined') {
        $.cookie.set(name, value, days, options);
      }
      // GET
      else if (name) { // only name given, get cookie
        return $.cookie.get(name);
      }
      // SHOW ALL
      else {
        return $.cookie.showAll();  
      }
    };
    $.cookie.get = function(name) {
      if (!document.cookie) return;

      var cookies = document.cookie.toString().split('; ');
      var cookieArr;
      for (var i = cookies.length; i > 0 ; i--) {
        if (typeof cookies[i] != 'string') {
          //console.log('skipped: ' + cookies[i] + ' ' + i);
          continue;
        }
        cookieArr = cookies[i].toString().split('=');
        if (cookieArr[0] == name) {
          return decodeURIComponent(cookieArr[1]);
        }
      }

    };
    $.cookie.set = function(name, value, days, options)
    {
      //value = value || "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        days = date.toGMTString();
      }
      var expires = days ? '; expires=' + days : '';

      /*
      if (hours) {
        var exdate = new Date();
        exdate.setTime(exdate.getTime() + (hours * 60 * 60 * 1000));
        str += "; expires=" + exdate.toUTCString();
      }
      */

      // OPTIONS
      var o = {};
      if ($.type(options) == "string") o.domain = options;
      else {
        o = options || {};
        if (!o.path) o.path = "/";
        if (!o.domain) o.domain = $.cookieHost();
      }    

      // BUILD
      var path = o.path ? '; path=' + (o.path) : '';
      var domain = o.domain ? '; domain=' + (o.domain) : '';
      var secure = o.secure ? '; secure' : '';

      var str = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
      //$.debug("COOKIE SET: " + str);
      document.cookie = str;
    };

    $.cookie.deleteAll = function() {
      var a = document.cookie.toString().split("; ");
      for (var i = a.length; i > 0; i--) {
        $.cookie.remove(a[i].split('=')[0]);
      }
    };

    $.cookie.remove = function(name) {
      $.cookie.set(name, null, -1000);
      //$.debug("DELETED COOKIE: " + name);
    };
    $.cookie.showAll = function() {
      var arr = document.cookie.toString().split("; ");
      for (var i = a.length; i > 0; i--) {
        $.debug(a[i]);
      }
    };

  }

  //==========
  // CSS TOOLS

  $.fn.rotate = function (val)
  {
    var style = $(this).css('transform') || 'none';
    
    var rotateUnits = "deg";
    
    // GET
    if (typeof val == 'undefined')
    {
      if (style)
      {
        var m = style.match(/rotate\(([^)]+)\)/);
        if (m && m[1])
        {
          return m[1];
        }
      }
      
      return 0;
    }
    
    // SET
    var m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
    if (m)
    {
      if (m[3])
      {
        rotateUnits = m[3];
      }
      
      var z = style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')';
    
      // SET
      $(this).css({
        '-moz-transform': z,
        '-ms-transform': z,
        '-o-transform': z,
        '-webkit-transform': z,
        'transform': z
      });
    }
    
    return this;
  };
  
  // Note that scale is unitless.
  $.fn.scale = function (val, duration, options)
  {
    var style = $(this).css('transform');
    
    // GET
    if (typeof val == 'undefined')
    {
      if (style)
      {
        var m = style.match(/scale\(([^)]+)\)/);
        if (m && m[1])
        {
          return m[1];
        }
      }
      
      return 1;
    }
    
    var z = style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')';
    
    // SET
    $(this).css({
      '-moz-transform': z,
      '-ms-transform': z,
      '-o-transform': z,
      '-webkit-transform': z,
      'transform': z
    });
    
    return this;
  };
  
  //=================
  // DOM MANIPULATION
  
  // Create DOM element based off of CSS Selector
  $.create = function(sel) {
    if (typeof sel != "string") return sel;
    var t = "div", c, p;
    p = sel.indexOf(".");
    if (p != -1) {
      t = sel.substring(0, p);
      c = sel.substring(p + 1);
    } else {
      c = sel;
    }
    // ADD RECURSION, ADD ID's
    
    return $("<" + t + ">").addClass(c);
  };
  
  $.findOrCreate = function(el, ctn) {
    var r;
    if (ctn) {
      r = ctn.find(el);
    } else {
      r = $(el);
    }
    // CHECK
    if (!(r.length > 0)) {
      $.debug("jandi - NOT FOUND, WILL CREATE: " + el);  
      r = $.create(el);
      if (ctn)
        ctn.append(r);
    }
    return r;
  };  
  
  ////////////////////
  // UI TOOLS
  $.fn.checked = function() {
    return $(this).is(':checked');
  };
  $.fn.check = function() {
    this.attr("checked", "checked");
  };
  $.fn.uncheck = function() {
    this.removeAttr("checked");
  }
  
  $.messages = function(opts) {
    var
    _d = {
      container: "body",
      delay: 5000,
      transitionSpeed: 500,
      cls: "ui-message"
    },
    _o = $.extend({}, _d, opts),
    container = null,
    interval = null,
    show = function(txt) {
      if (this.container.text().length == 0)
        this.container.css("display", "none");
      this.container.text(txt);
      this.container.slideDown();
      this.set();  
    },
    set = function() {
      this.clear();
      this.interval = setInterval(function(){
        container.slideUp(_o.transitionSpeed);
      }, _o.delay);
    },
    clear = function() {
      clearInterval(this.interval);  
    },
    init = function() {
      container = $(_o.container);
    }
    return {
      show: show,
      container: container,
      set: set,
      clear: clear,
      init: init  
    }
  };
  
  $.fn.emptyTextHandler = function(text) {
    var c = this;
    if (!text && c.attr("title")) text = c.attr("title");
    if (!text && c.attr("placeholder")) text = c.attr("placeholder");
    else if (!text) text = c.val();
    
    c.focus(function() {
      var v = c.val();
      if (v == "" || v == text) {
        c.val("");
        c.removeClass("ui-text-blurred");
      }
      //$.debug( text );
    });
    c.blur(function() {
      var v = c.val();
      if (v == "" || v == text) {
        c.addClass("ui-text-blurred");
        c.val(text);
      }
    });
    $(function() { c.blur(); });
  };
  
  $.fn.picker = function(options) {
  
    // DEFAULTS
    var d = {
      type: "single", // SINGLE, MULTIPLE
      callback: function(){}
    };
    
    if (typeof(options) == "string") options = { "type": options };
  
    // OPTIONS
    var o = $.extend({}, d, options);
    
    var items = this;
  
    items.each(function(i, t) {
  
      var t = $(this);
      if (o.type == "single") {
        t.click(function() {
          items.removeClass("active");
          t.addClass("active");
          o.callback(t);
        });
      } else {
        t.click(function() {
          t.toggleClass("active");
          o.callback(t);
        });
      }
    });
  };
  
  // AUTO TABBING
  $.fn.tabber = function() {
  
    return $(this).each(function() {
    
      // CONTROLS
      var ctn = $(this);
      var inputs = ctn.find("input[type='text'], input[type='password'], input[type='search'], textarea");
      var inputLength = inputs.length;
      
      var ignoreKeys = [8,9,16,17,18,27,37,38,39,40,91];
      
      inputs.each(function(index) {
      
        var i = $(this);
        
        var m = i.attr("maxlength");
        
        if (index != inputLength) {
          i.keyup(function(e) {
            // IGNORE KEYS
            for (k in ignoreKeys) {
              if (ignoreKeys[k] == e.which) return;
            }
            // TEST VALUE LENGTH
            if (i.val().length >= m) {
              inputs.eq(index + 1).focus();
            }
          });
        }
      });
    });
  };
  
  $.fn.isText = function() {
    var t = $(this);
    var y = t.attr('type');
    return t.is('textarea') || (t.is('input') && (y == 'text' || y == 'password' || y == 'email' || y == 'search' || y == 'url' || y == 'tel' || y == 'number'));
  }
  
  $.fn.ifExists = function(fn) {
    if (this.length) {
      $(fn(this));
    }
  };
  
  $.full = function(v) {
    try {
      var r = typeof(v);
      return !(r == "undefined" || r == "null")
    } catch (e) {
      return false;
    }
  }
  
  $.findEach = function(objects, container) {
    var o = objects;
    if (!$.loopable(o)) return false;
    var f = $;
    if (container) {
      var c = $(container);
      for (x in o) {
        o[x] = c.find(o[x]);
      }
    } else {
      for (x in o) {
        o[x] = $(o[x]);
      }
    }
    return o;  
  }
  
  $.loopable = function(o) {
    if ($.type(o) == "array" || $.type(o) == "object") return true;
    return false;
  };
  
  $.fn.pusher = function(o) {
    
    var t = $(this);
    var cl = [];
    var transitions = [];
    var detect = function() {
      cl = t.attr("class").split(" ");
      for (i = 0; i < cl.length; i++) {
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
  
  $.fn.hoverClass = function(cls) {
    this.hover(
      function() {
        $(this).addClass(cls);
      },
      function() {
        $(this).removeClass(cls);
      }
    );
  };
  
  $.fn.downClass = function(cls) {
    this.mousedown(function() {
      $(this).addClass(cls);
    });
    this.mouseup(function() {
      $(this).removeClass(cls);
    });
    this.mouseleave(function() {
      $(this).removeClass(cls);
    });
  };
  
  $.fn.screenKeep = function(ctn, opts) {
    opts = opts || {};
    if ($.type(ctn) != "object") ctn = $(ctn);
    if (!ctn.length) {
      $.debug("screenKeep - ctn not found");
      $.debug(ctn);
      return;
    }
    
    var d = {
      honorPadding: true,
      setHeight: false,
      // NOT WORKING
      lockWidth: false,
      topOffset: 0,
      fixed: 1
    };
    if ($.type(opts) != "object") opts = { fixed: 1 };
    var o = $.extend({}, d, opts);
    
    if (typeof ctn == "string")  ctn = $(ctn);
    var t = $(this);
    
    // START
    if (o.lockWidth) t.width( t.width() );
    
    if (ctn.css("position") == "static") ctn.css("position", "relative");
    
    var w = $(window);
    
    var resizeEvent = function() {
      
      var pt = 0, pb = 0;
      if (o.honorPadding) {
        pt = parseFloat(ctn.css("padding-top"));
        pb = parseFloat(ctn.css("padding-bottom"));
      }
      
      var top = ctn.offset().top + pt;
      
      var maxheight = ctn.height() + top - t.height() - 1 - pt;
      //$.debug(maxheight);
      
      var scrollTop = w.scrollTop();
      
      // WHEN SCROLLED TO TOP
      if (scrollTop < top) {
        t.css({
          position: "absolute",
          top: 0 + pt,
          bottom: "auto"
        });
        ctn.height("auto");
      }
      // WHEN SCROLLING TO BOTTOM
      else if (scrollTop - pt > maxheight) {
        t.css({
          position: "absolute",
          top: "auto",
          bottom: 0 + pb
        });
        if (o.setHeight) {
          // IE 7 OR 6
          if ($.browser.msie && $.browser.version < 8) {
            ctn.height(maxheight + 50);
          } else {
            ctn.height(maxheight);
          }
        }
      }
      // WHEN SCROLLING CENTER
      else {
        if (o.fixed) {
          t.css({
            position: "fixed",
            top: 0,
            bottom: "auto"
          });
        } else {
          t.css({
            position: "absolute",
            top: scrollTop - top + pt,
            bottom: "auto"
          });
        }
        ctn.height("auto");
      }
    
      //$.debug("SCROLL: " + scrollTop + " - TOP:" + top + " - MAXHEIGHT: " + maxheight);
    };
    
    $(resizeEvent);
    w.scroll(resizeEvent);
    w.resize(resizeEvent);
          
  };
    
  // TAKES EITHER AN ARRAY OR OBJECT
  // valueAsKeyOrObjectKey can be TRUE for using array key
    
  $.populateSelect = function(sel, data, valueAsKeyOrObjectKey, objectValue) {
  
    if (typeof(data) == 'undefined' || !data) {
      $.debug( 'populateSelect - no data' );
      return;
    }
    
    sel.html();
    
    for (var i = 0; i < data.length; i++) {
      
      var opt = $("<option>");
      
      var v, t; // OPTION TEXT, VALUE
      
      // USE ARRAY'S KEY FOR <OPTION VALUE>
      if (valueAsKeyOrObjectKey === true) {
        v = i;
        t = data[i];
      }
      // OBJECT KEY
      else if (objectValue) {
        v = data[i][valueAsKeyOrObjectKey];
        t = data[i][objectValue];
      }
      // USE ARRAY VALUE
      else {
        v = t = data[i];
      }
      
      opt.val(v);
      opt.text(t);
      
      sel.append(opt);
      
    }  
    
  }
  
  $.ucWords = function  (str, strict) {
    if (strict) str = str.toLowerCase();
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
      return $1.toUpperCase();
    });
  };
  
  $.fn.slideLeft = function(o) {
    var t = $(this);
    t.wrapInner("<div>");

    var d = t.children().first();
    d.width(parseFloat(t.width()) + 1);
      
    t.css("overflow", "hidden");
    t.animate({width: 0}, o);
  };
    
  // ENABLE / DISABLE FORM ELEMENTS
  $.fn.enable = function(keepValue) {
    var t = $(this);
    t.removeAttr("disabled");
    if (keepValue) {
      if (t.attr("type") == "checkbox" && t.checked() ) {
        t.parent().find("input[type='hidden'][name='" + t.attr("name") + "']").attr("disabled", 1);
      }
    }
  };

  $.fn.disable = function(keepValue) {
    var t = $(this);
    t.attr("disabled", 1);
    if (keepValue) {
      if (t.attr("type") == "checkbox" && t.checked()) {
        var hidden = t.parent().find("input[type='hidden'][name='" + t.attr("name") + "']");
        if (hidden.length)
          hidden.removeAttr("disabled");
        else
          t.parent().append('<input type="hidden" name="' + t.attr("name") + '" value="' + t.val() + '" />');
      }
    }
  };
  
  $.fn.selectedOption = function() {
    var t = $(this);
    return t.find("option:selected").first();  
  };
  
  $.fn.findOptionByText = function(optText) {
    var t = this;
    if (!t.is("select")) return;
    
    var r;
    t.children().each(function() {
      var o = $(this);
      // $.debug( ['looking option', o] );
      if (o.text() == optText) {
        // $.debug( ['found option', o] );
        r = o;
        return false; // BREAK
      }
    });
    return r;
  };
  
  $.fn.selectOption = function(optVal) {
    var t = $(this);
    if (!t.length) return false;
    if (t.is('option')) {
      t.siblings().removeAttr('selected');
      t.attr('selected', 'selected');
    }
    if (!t.is("select")) return t;
    
    t.val(optVal);
  };
  
  $.fn.selectOptionText = function(optText) {
    var t = $(this);
    if (!t.is("select")) return;
    
    var r = t.findOptionByText(optText);
    if (r) r.selectOption();
    
    return r;
  };
  
  
  $.fn.view = function() {
    var t = $(this);
    
    var template, rendering;
    
    var clear = function() {
      rendering = "";
    };
    
    var addEachObjectInArray = function(ao) {
      if ($.type(ao) == "array") {
        for (x in ao) {
          var l = template;
          if ($.loopable(ao[x])) {
            for (k in ao[x]) {
              //console.log(l);
              l = rep(l, k, ao[x][k]);
            }
          }
          rendering += l;
        }  
      }
    };
    
    var rep = function(loop, key, value) {
      if (loop) {
        //if (value && value.replace) value = value.replace(/\"/g, "\\\\\\\"");
        return loop.replace(new RegExp("(\\\$\\\[" + key + "\\\])", "g"), value);
      }
    }
    
    var add = function(k, v) {
      return rendering += rep(k, v);
    };
    
    var render = function(destination, arrayOfObjects) {
      if (arrayOfObjects) {
        clear();
        addEachObjectInArray(arrayOfObjects);
        destination.html(rendering);
      } else if (rendering) {
        destination.html(rendering);
      }
      destination.children().removeClass("ui-template");
    };
    
    // INIT
    template = $.trim(t.html());
    clear();
    
    return {
      clear: clear,
      add: add,
      addEach: addEachObjectInArray,
      addEachObjectInArray: addEachObjectInArray,
      render: render,
      populate: render
    };
  };
  
  // TEST DATE
  // var val = "+1y -2mo 5.3d -w h -5m 10s";
  
  var mdy = function(d) {
    //calls the function mdy why to get our date
    return ((d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear());
  }
  
  $.timer = function(val, format, dateObj) {
    dob = dateObj || new Date();
    if (!dob.getDate) dob = new Date();
    
    if (!val) return dob;
    
    var commands = val.split(" ");
    
    for (x in commands) {
    
      var t = commands[x];
      
      var res = /(\-?)([\d\.]*)(\w+)/ig.exec(commands[x]);
      // 1 is plus/minus, 2 is amount, 3 is unit
      var amt = parseFloat(res[2] ? res[2] : 1);
      if (res[1] == "-") amt *= -1;
      
      var u = res[3].toLowerCase();
      if (u == "y" || u == "year" || u == "years") {
        dob.setYear(dob.getFullYear() + amt);
      }
      else if (u == "mo" || u == "month" || u == "months") {
        dob.setMonth(dob.getMonth() + amt);
      }
      else if (u == "w" || u == "week" || u == "weeks") {
        dob.setDate(dob.getDate() + (amt * 7));
      }
      else if (u == "d" || u == "day" || u == "days") {
        dob.setDate(dob.getDate() + amt);
      }
      else if (u == "h" || u == "hour" || u == "hours") {
        dob.setHours(dob.getHours() + amt);
      }
      else if (u == "m" || u == "min" || u == "minute" || u == "minutes") {
        dob.setMinutes(dob.getMinutes() + amt);
      }
      else if (u == "s" || u == "sec" || u == "second" || u == "seconds") {
        dob.setSeconds(dob.getMinutes() + amt);
      }
      else if (u == "ms" || u == "millisec" || u == "millisecond" || u == "milliseconds") {
        dob.getMilliseconds(dob.setMilliseconds() + amt);
      }
    }
    return dob;
  };  
  
  // USED FOR ACTUALLY CHANGE THE TEXT IN TEXTBOX, INCLUDES PASTING TEXT
  $.fn.propertyChange = function(fn) {
    if ($.browser.msie) {
      this.keydown(function() {
        setTimeout(fn, 10);
      });
    }
    else {    
      // DOESNT WORK IN IE.  WILL TRIGGER CHANGE AND MAKE INFINITE LOOP
      this.bind('input propertychange', fn);
    }
  }
  
  $.fn.characterKey = function(fn, ig) {
    if (!fn) return this.keyup();
    ig = ig || $.nonCharacterKeys;
    this.keyup(function(e) {
      // IGNORE KEYS
      for (k in ig) {
        if (ig[k] == e.which && ig[k] != 224) return;
      }
      // 224 is for paste
      //$.debug(e);
      fn();
    });
  };
  
  $.fn.enterKey = function(fn, ig) {
    if (!fn) return this.keyup();
    this.keydown(function(e) {
      if (e.keyCode == 13) {
        if (e.preventDefault) e.preventDefault();
        fn();
      }
    });
  };
  
  $.formValues = function(form) {
    if (!(typeof(form) == 'object')) form = $(form);
    var els = form.find(':input'),
      vals = [],
      n;
    els.each(function(){
      if (n = t.attr('name'))
        vals[n] = t.val();
    });
    return vals;
  };
  
  $.initalizeModules = function(m) {
    //$.each(m, function(i, o) { if (o.init) o.init(); });
    for (x in m) {
      if (m[x] && m[x].init)
        m[x].init();
      else if (typeof(m[x]) == 'function')
        m[x]();
    }
  };
  
  //
  $.fn.screenFit = function(container, method) {
    var i = $(this);
    var c = $(container);
    
    var im = {
      w: parseFloat( i.width() ),
      h: parseFloat( i.height() )
    };
  
    var resize = function() {
      
      var s = {
        cw: c.width(),
        ch: c.height(),
        iw: im.w || ( im.w = i.width() ),
        ih: im.h || ( im.h = i.height() )
      };
      var r = s.cw / s.ch;
      var rr = s.iw / s.ih;
      
      // $.debug( ['sizes', r, rr, s ] );
      
      if ((method == 'crop' && r > rr) || r < rr) { // CONTAINER IS WIDER
        i.width( '100%' );
        i.height( 'auto' );
        // $.debug( 'container wider' );
      }
      else {
        i.width( 'auto' );
        i.height( s.ch );
        // $.debug( 'container taller' );
      }
        /*
      }
      // FIT
      else {
        if (r > rr) { // CONTAINER IS WIDER
          i.width( 'auto' );
          i.height( c.height() );
          $.debug( 'container wider' );
        }
        else {
          i.width( '100%' );
          i.height( 'auto' );
          $.debug( 'container taller' );
        }
      }
      */
    }
    
    resize();
    $(window).resize(resize);
  };
  
  $.fn.scrollWindow = function(options) {
    var defaults = {
      duration: 500,
      padding: 10
    };
    var o = $.extend({}, defaults, options);

    var t = $(this);
    if (!t.length) return;
    $('html,body').stop().animate(
      {
        scrollTop: t.offset().top - o.padding
      },
      {
        duration: o.duration,
        complete: function() {
          t.focus();
        }
      }
    );
  }
  
  $.slideMessage = function(msg, type, time) {
      time = time || 6;
        var ctn = $(".ui-message-global");
      if (!ctn.length) {
          $("body").prepend('<div class="ui-message-global" style="display: none; position: fixed; top: 0; left: 0; right: 0; padding: 15px; background: #fff; border: 1px solid #ccc; font-size: 14px; z-index: 9000"></div>');
          var ctn = $(".ui-message-global").first();
      }
      if (type == "error") ctn.css({'background': '#fcc', 'color': '#900', 'border-color': '#900'});
      else if (type == "success") ctn.css({'background': '#cfc', 'color': '#090', 'border-color': '#090'});
      if (!msg) {
          ctn.slideUp();
          ctn.height("auto");
      }
      ctn.text(msg);
      ctn.slideDown();
      clearTimeout($.slideMessageTimer);
      $.slideMessageTimer = setTimeout(function() {
          ctn.height("auto");
          ctn.slideUp();
      }, time * 1000)
  };
  $.slideMessageTimer;
  
  // NOT WORKING YET
  // AJAX CALL WITH FEATURES
  // TIMEOUT, ATTEMPTS, QUEUE
  // AJAX CALL WITH CACHING, SUCCESS, ABORT, ATTEMPTS
  
  $.jajax = function(options) {
    var a = {};
    
    a.defaults = {
      // JQUERY OPTIONS
      method:      'get',
      success:    null,
      //
      nextCall:    'multiple',
              // multiple    multiple new calls at once, cache all
              // cancel    cancel new call when pending call exists
              // abort    abort next call regardless
              // queue    put call in line regardless if its the same
      attempts:    3,
      timeout:    5,      // seconds before trying again
      caching:    true
    };
    
    // OPTIONS    
    var o = $.extend({}, d, options);
  
    a.init = function() {
      a.timesAttempted = 0;
      a.calls = [];
      
      var x = {
        data: a.data,
        method: a.method,
        success: function(d) {
          
        }
      };
      
      if ($.type(a.success) == 'function') x.success = a.success;
    
      a.request = $.ajax(x);
      
      a.timesAttempted++;
    };
    
    a.retry = function() {
      
    };
    
    a.call = function(data) {
    
      if (o.caching) {
        o.findCall();
      }
      else {
        var c = {
          timesAttempted: 0,
          timeout: null
        };
        
        o.calls.push(c);
      }
    
    };
    
    a.init();
    return a;
  };
  
  $.regexEscape = function(text) {  // ESCAPE -,^$#/.*+?|()[]{}\
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  
  // OBJECTS & ARRAYS
  
  // ADDING TO OBJECT OR ARRAY WITHOUT DESTROYING EXISTING VALUE
  // o.prop = $.addTo(o.prop, val)
  $.addTo = function(prop, val) {
    if (typeof(prop) == "undefined" || typeof(prop) == "null") return val;
    else return [ prop, val ];
  }
  
  // PARSE A SET OF CLASSES FOR PREFIX AND TURN IT INTO KEYVALUES
  $.classToObject = function(cls, prefix, o) {
    var a = cls;
    if ($.type(a) != "array") a = a.split(" ");
    var o = o || {}, m;
    // EACH CLASS
    for (x in a) {
      m = a[x].match(/(\-?[\w]+)/g);
      if (m && prefix == m[0]) {
        o[ m[1].substr(1) ] = $.addTo(o[ m[1].substr(1) ],  (typeof(m[2]) != "undefined" ? m[2].substr(1) : true ) );
      }
    }
    return o;
  };
  
  
  //=============
  // GEO LOCATION
  
  $.locator = function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      doStuff(position.coords.latitude, position.coords.longitude);
    });  
  };
  
  $.pagePath = function() {
    return location.pathname.toLowerCase();
  };
  $.pageRoute = function() {
    var r = $.pagePath();
    // TRIM index.php
    r = r.replace(/\/index\.(php|html|htm)$/i, '/');
    return r;
  };
  
  // INTERNET ONLY ALLOWS
  // 0-9a-zA-Z$-_.+~!*'()|
  //  TO /
  // - TO SPACE
  // !20 TO %20 (SPACE)
  $.cleanUri = function(uri) {
    if ($.loopable(uri)) {
    
    }
    else {
      return uri.replace(/\s/g, '-').replace(/\//g, '~');
    }
  }
  
  $.dirtyUri = function(uri) {
    if ($.loopable(uri)) {
    
    }
    else {
      return uri.replace(/\s/g, '_').replace(/ /);
    }
  }
  
  /*
  // MARKER
  { 
      title: "First Vehicle Services-Davie", 
      position: new google.maps.LatLng(26.065590, -80.238861),
      icon: "http://www.ase.com///CMSWebParts/ASE/Images/PushPins/Blue_markerA.png"
  }
  */
  
  $.locationPost = function(url, vars) {
  
    $.locationPostIntances++;
    
    var f = $('<form id="jandi-locationPost-' + $.locationPostIntances + '" method="post" action="' + url + '">');
    
    for (x in vars) {
      f.append('<input type="hidden" name="' + x + '" value="' + vars[x] + '" />');
    }
    
    var b = $('body');
    b.append(f);
    if (!f.length) f = b.find("form#jandi-locationPost-" + $.locationPostIntances);
    
    f.submit();
  
  }
  $.locationPostIntances = 0;
  
  $.fn.googleMap = function(locations, zoom) {
  
    $.googleMapsDialog = $.googleMapsDialog || null;
    var createInfoWindow = function(map, marker, infoWindowProperties) {
        var info = new google.maps.InfoWindow(infoWindowProperties);
    
        google.maps.event.addListener(marker, 'click', function () {
            if ($.googleMapsDialog != null)
                $.googleMapsDialog.close();
    
            info.open(map, marker);
            $.googleMapsDialog = info;
        });
    }
  
    var t = jQuery(this);
    
    if (t.width() == 0) t.width(500);
    if (t.height() == 0) t.height(300);
  
    /*
    // LOCATIONS
    {
      name, lat, lon, address, city, state, zip, icon, phone, website
    }
    */
  
    if (locations && locations.length > 0)
      var myLatLng = new google.maps.LatLng(locations[0].lat, locations[0].lon);
    else
      var myLatLng = new google.maps.LatLng(0, 0);
    
    var options = {
        zoom: zoom || 12,
        center: myLatLng,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map_canvas = t[0];
    var map = new google.maps.Map(map_canvas, options);

    if (locations && locations.length > 0) {
      var bounds = new google.maps.LatLngBounds();

      // LOOP LOCATIONS
      for (var i = 0; i < locations.length; i++) {
        var loc = locations[i];

        var marker = {
          title: loc.name,
          position: new google.maps.LatLng( loc.lat, loc.lon ),
          icon: loc.icon
        };

        var googleMarker = new google.maps.Marker(marker);
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

      if (Math.abs(bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) < .003) {
          bounds.extend(new google.maps.LatLng(bounds.getNorthEast().lat() + .003, bounds.getNorthEast().lng() - .003));
          bounds.extend(new google.maps.LatLng(bounds.getSouthWest().lat() - .003, bounds.getSouthWest().lng() + .003));
      }

      if (locations.length > 1) {
          map.fitBounds(bounds);
      }

      map.setCenter(bounds.getCenter());
    }
  }
  
  $.intervalLoader = function(fn, seconds, times) {
    if (typeof(fn) != 'function') return false;
    seconds = seconds || .2;
    times = times || 1000;
    var t = 0;
    var i = setInterval(function() {
      if (fn() === false || t > times)
        clearInterval( i );
      t++;
    }, seconds * 1000);
  };

    $.fn.janimate = function(css, complete, duration, options) {
    options = options || {};
    options.complete = complete;
    options.duration = duration || 300;
    options.queue = options.queue || false;
    return $(this).stop().animate(css,options);
    };
  
  //=========
  // JANDI UI
  
  $.fn.disableLoader = function(options) {
    var a = {};
        a.defaults = {
          transition: 'fade', // fade, slide, false
          opacity: .25
        };
        var o = a.options = $.extend({}, a.defaults, options);

    a.box = $(this);
    
    a.on = function() {
      if (o.transition == 'fade') {
        a.layover.css({
          opacity: 0,
          zIndex: 1000
        }).show();
        a.layover.janimate({
          opacity: o.opacity
        });
      } else {
        a.layover.show();
      }
    };
    
    a.off = function() {
      if (o.transition == 'fade') {
        a.layover.show();
        a.layover.janimate(
          {
            opacity: 0
          },
          function() {
            a.layover.css({
              opacity: o.opacity,
              zIndex: -1
            }).hide();
          }
        );
      } else {
        a.layover.hide();
      }
    };
    
    a.init = function() {
      a.box.addClass('ui-disableLoader');
      a.box.prepend('<div class="disableLoader-layover" />');
      
      a.layover = a.box.children('.disableLoader-layover');
      a.layover.hide();
    };
    a.init();
  
    return a;
  };
  
  
  // CSS BACKGROUND ANIMATOR
  $.fn.bgAnimator = function(frames, o) {
    var t = $(this);
    // ANIMATOR OBJECT
    var a = {};
    a.element = t;
    // VALIDATE PARAMS
    if (o)
      o.frames = frames;
    else if (frames)
      o = {frames: frames};
    // DEFAULTS
    a.defaults = {
      frames: 1,
      duration: 200,
      direction: 'down'
    };
    o = a.options = $.extend({}, o, a.defaults, o);
    // VALIDATION OPTIONS
    o.direction = o.direction.toLowerCase();
    // PRIVATE VARS
    var p = {};
    p.current = 0;
  
    a.init = function() {
      // DETERMINE FRAMES
      p.vertical = (o.direction == 'down' || o.direction == 'up');
      p.size = parseFloat(p.vertical ? t.height() : t.width());
      p.totalSize = p.size * o.frames;
      p.secondPosition = t.css('background-position') ? t.css('background-position').replace(/\s{2,}/g, ' ').split(' ')[0] : t.css('background-position-x');
      if (!p.secondPosition || p.secondPosition == 'undefined') p.secondPosition = 'center';
    };
  
    a.start = function(callback) {
      a.stop();
      p.current = 0;
      p.interval = setInterval(p.next, o.duration / o.frames);
      a.animating = true;
      if (callback) p.callback = callback;
    };
  
    a.reverse = function(callback) {
      a.stop();
      p.current = o.frames;
      p.interval = setInterval(p.prev, o.duration / o.frames);
      a.animating = true;
      if (callback) p.callback = callback;
    };
  
    a.stop = function() {
      clearInterval(p.interval);
      t.stop();
      a.animating = false;
      if (typeof p.callback == 'function') {
        p.callback();
        p.callback = null;
      }
    };
  
    p.next = function() {
      if (p.current < o.frames - 1) {
        p.current++;
        a.update();
      } else
        a.stop();
    };
  
    p.prev = function() {
      if (p.current > 0) {
        p.current--;
        a.update();
      } else
        a.stop();
    };
  
    a.update = function() {
      o.position = p.current * p.size * -1;
      if (p.vertical)
        o.backgroundPosition = p.secondPosition + ' ' + o.position + 'px';
      else
        o.backgroundPosition = p.position + 'px ' + p.secondPosition;
      t.css('background-position', o.backgroundPosition);
    };
  
    a.down = a.start;
    a.up = a.reverse;
  
    a.init();
  
    return a;
  };

  //=====================
  // IMAGE LOAD CALLBACKS FOR WHEN IMAGES ARE CACHED TOO

  $.imageLoad = function(img, callback) {
    if (typeof img == 'string') img = $(img);
    if (typeof callback != 'function') callback = function(){};
    $.imageLoad.images = $.imageLoad.images || [];

    var src = img.attr('src');
    if ($.imageLoad.images[src]) return;

    $.imageLoad.images[src] = {
      loaded: null,
      error: null,
      complete: null,
      reloaded: null,
      reloadTimes: 0
    };
    img.load(function() {
      $.imageLoad.images[src].loaded = true;
      callback($.imageLoad.images[src], img);
    });
    img.error(function() {
      $.imageLoad.images[src].error = true;
      callback($.imageLoad.images[src], img);
    });
    setTimeout(function() {
      $.imageLoad.images[src].complete = img.prop('complete');
      // ADD QUERYSTRING TO IMG, TO RELOAD IMAGE
      if (!$.imageLoad.images[src].loaded && !$.imageLoad.images[src].error && $.imageLoad.images[src].complete) {
        $.imageLoad.images[src].reloaded = true;
        $.imageLoad.images[src].reloadTimes ? ++$.imageLoad.images[src].reloadTimes : ($.imageLoad.images[src].reloadTimes = 1);
        if ($.imageLoad.images[src].reloadTimes > 2) return;
        img.attr('src', src + (src.indexOf('?') == -1 ? '&' : '?' ) + 'image_reload=' + Math.floor((Math.random()*100000)+1) );
      }
    }, 500);
  };

  $.imageLoad($('img').first(), function(i, j) {
    console.log([i, j]);
  });

  
  //=====================
  // AVOID CONSOLE ERRORS
  if (!window.console) {
    window.console = {
      log: function(){}
    };
  }
  
  // APP MODULES & UI COMPONENTS
  if (typeof $.slideInLink == 'undefined') {
    $.slideInLink = function() {
      var module = {};

      module.el = 'slideInLink';

      module.dom = {
        button: 'slideInLink-button',
        iframe: 'slideInLink-iframe'
      };

      module.init = function(element_or_link) {

        if (typeof element_or_link == 'object') {
          module.initializeElements(element_or_link);
        } else if (typeof element_or_link == 'string') {
          module.loadLinkUrl(element_or_link);
        }

        module.initializeDom();

        module.dom.button.click(module.slideOut);

        module.slideOut();
      };

      module.initializeDom = function() {

        if (typeof module.el == 'string') {

          var el = $(module.el);

          // BUILD DOM
          if (el.length == 0) {
            module.el = $('<div class="' + module.el + '">');
            module.el.appendTo($('body'));
          }
        }

        if (typeof module.dom.iframe == 'string') {
          module.dom.iframe = $('<iframe class="' + module.dom.iframe + '" frameborder="0" />');
          module.dom.iframe.appendTo(module.el);
        }

        // BUTTON
        if (typeof module.dom.button == 'string') {
          module.dom.button = $('<div class="' + module.dom.button + '" />');
          module.dom.button.appendTo(module.el);
        }

      };

      module.loadLinkUrl = function(linkUrl) {
        module.dom.iframe.attr('src', linkUrl);
        module.slideIn();
      };

      module.initializeElements = function(element) {
        if (typeof element != 'object')
          return;

        $.each(element, function() {
          var t = $(this);

          t.addClass('slideInLink-linked');
          t.click(function(e) {
            if (e && e.preventDefault)
              e.preventDefault();
            module.loadLinkUrl(t.attr('href'));

            return false;
          });

        });
      };

      module.slideOut = function() {
        module.el.animate(
          {
            width: 0
          },
          {
            queue: false,
            complete: function() {
              module.el.hide();
              module.showing = false;
            }
          }
        );
      };

      module.slideIn = function() {

        module.showing = true;
        module.el.show();
        module.el.animate(
          {
            width: '97%'
          },
          {
            queue: false,
            complete: function() {
              module.el.css('overflow', 'visible');
            }
          }
        );

      };

      return module;
    }();
  }

  // RESPONSIVE TRIGGERS FOR DIFFERENT DEVICES
  var responsiveTriggers = function() {

    var w = $(window);
    var doc = $(document);
    var ww;
    var module = {
      devices: [
        {
          name: 'mobile',
          max: 640
        },
        {
          name: 'desktop',
          min: 640
        }
      ]
    };

    module.onResize = function() {
      ww = w.width();

      var d;
      for (k in module.devices) {
        d = module.devices[k];
        if (!d.initialized && (!d.min || ww > d.min) && (!d.max || ww < d.max) ) {
          d.initialized = true;
          console.log(['triggered', d.name]);
          doc.trigger('device-' + d.name);
        }
      }
    };

    module.init = function(devices) {
      if (devices) module.devices = devices;
      $(module.onResize);
      w.resize(module.onResize);
    };

    module.when = function(deviceName, fn) {
      // FIND DEVICE
      var d;
      for (k in module.devices) {
        d = module.devices[k];
        if (d.name && d.name == deviceName) {
          console.log(['when assigned', deviceName, d]);
          doc.bind('device-' + d.name, fn);
          break;
        }
      }
    };

    module.init();

    return module;
  }();



})(jQuery);
