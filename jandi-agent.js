/*
// jandi-agent
// jandi.kriogenx.net
// jandi.kriogenx.net/source/license.txt
//
// REQUIRES:
// jQuery
*/

/*
// TYPE
desktop, tablet, phone, music, game, tv, bot, server

// FLAGS
dumb - no css or js
mobile - tablets, phones, music are considered mobile, unless flagged
email
*/

// Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31

var jandi_agent = (function() {
  var self = {};

  self.operatingSystems = [
    {
      name: 'Mac OS X',
      agent: ['Macintosh', 'Mac OS X'],
      flag: 'mac'
    },
    {
      name: 'Windows',
      agent: 'Windows',
      flag: 'pc'
    }
  ];

  self.browsers = [
    {
      name: 'Safari',
      agent: 'Safari',
      flag: 'safari'
    },
    {
      name: 'Chrome',
      agent: 'Chrome',
      flag: 'chrome'
    },
    {
      name: "Firefox",
      agent: 'Firefox',
      flag: 'firefox'
    },
    {
      name: 'Opera',
      agent: 'Opera',
      detect: function() {
        return window.opera;
      },
      flag: 'opera'
    },
    {
      name: 'Internet Explorer',
      agent: 'MSIE|Explorer',
      flag: 'ie'
    }
  ];
  
  self.webEngine = [
    {
      name: 'WebKit',
      agent: 'WebKit',
      flag: 'webkit'
    }
  ];

  self.devices = [
    // Apple
    {
      name: 'iPad',
      agent: 'iPad',
      type: 'tablet',
      smart: 1,
      flag: 'ipad',
      os: 'ios'
    },
    {
      name: 'iPod',
      agent: 'iPod',
      type: 'music',
      smart: 1,
      flag: 'ipod',
      os: 'ios'
    },
    {
      name: 'iPhone',
      agent: 'iPhone',
      type: 'phone',
      smart: 1,
      flag: 'iphone',
      os: 'ios'
    },
    {
      name: 'Apple Macintosh',
      agent: 'Mac OS X 10',
      type: 'desktop',
      flag: 'mac',
      os: 'mac os x'
    },
    // Android
    {
      agent: 'android',
      smart: 1,
      mobile: 1
    },
    // Windows Desktops
    {
      agent: 'Windows NT',
      type: 'desktop'
    },
    // Windows Phones
    {
      agent: "windows phone os 7",
      type: 'phone'
    },
    {
      agent: "windows ce",
      type: 'phone'
    },
    {
      agent: 'iemobile',
      type: 'phone',
      os: 'windows'
    },
    // Blackberry
    {
      name: 'Blackberry Playbook',
      agent: 'playbook',
      type: 'tablet'
    },
    {
      name: 'Blackberry',
      agent: 'blackberry',
      type: 'phone'
    },
    // HTC
    {
      agent: 'htc_flyer',
      type: 'tablet'
    },
    // MOTOROLA
    {
      name: 'Motorola Xoom',
      agent: 'Xoom',
      type: 'tablet'
    },
    // KINDLE
    {
      agent: 'Kindle',
      type: 'tablet'
    },
    // OTHERS
    {
      agent: 'SonyEricsson',
      type: 'phone',
      dumb: 1
    },
    {
      name: 'Smart Phone',
      agentRegex: 'palm|opera mini|hiptop|smartphone|mobile|treo',
      type: 'phone'
    },
    // OLD
    {
      name: 'Symbian',
      agent: ['Symbian', 'Series60', 'Series70', 'Series80', 'Series90'],
      typr: 'phone'
    },
    // BOTS
    {
      agentRegex: 'alexa|bot|crawler|crawling|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo|yandex',
      type: 'bot'
    },
    {
      name: 'Google Search Bot',
      agent: ['Googlebot', 'Google Web Preview'],
      type: 'bot'
    },
    {
      name: 'W3C Validator',
      agent: 'W3C_Validator',
      type: 'bot'
    },
    // GAMES
    {
      agent: 'psp',
      type: 'game'
    },
    {
      agent: 'xbox',
      type: 'game'
    },
    {
      agent: 'wii',
      type: 'game'
    },
    {
      agent: ['nintendo','nitro'],
      type: 'game'
    },
    {
      agent: 'playstation',
      type: 'game'
    },
    // TVs
    {
      agent: 'googletv',
      type: 'tv'
    },
    // OTHERS
    {
      agent: "nuvifone"
    },
    {
      name: 'Mobile',
      agent: ['mini', 'mobile']
    }
  ];
  
  var otherTypes = {
      // WINDOWS
      devicePpc: "ppc", //Stands for PocketPC
      enginePie: "wm5 pie",  //An old Windows Mobile
  
      vndRIM: "vnd.rim", //Detectable when BB devices emulate IE or Firefox
  
      palm: "palm",
      webOS: "webos", //For Palm's new WebOS devices
      blazer: "blazer", //Old Palm browser
      xiino: "xiino",
      deviceKindle: "kindle", //Amazon Kindle, eInk one.
  
      //Initialize variables for mobile-specific content.
      vndwap: "vnd.wap",
      wml: "wml",
  
      //Initialize variables for random devices and mobile browsers.
      //Some of these may not support JavaScript
      deviceBrew: "brew",
      deviceDanger: "danger",
      deviceHiptop: "hiptop",
      deviceArchos: "archos",
      
      engineOpera: "opera", //Popular browser
      engineNetfront: "netfront", //Common embedded OS browser
      engineUpBrowser: "up.browser", //common on some phones
      engineOpenWeb: "openweb", //Transcoding by OpenWave server
      deviceMidp: "midp", //a mobile Java technology
      uplink: "up.link",
      engineTelecaQ: 'teleca q', //a modern feature phone browser
  
      devicePda: "pda",
  
      //Use Maemo, Tablet, and Linux to test for Nokia's Internet Tablets.
      maemo: "maemo",
      maemoTablet: "tablet",
      linux: "linux",
      qtembedded: "qt embedded", //for Sony Mylo and others
      mylocom2: "com2", //for Sony Mylo also
  
      //In some UserAgents, the only clue is the manufacturer.
      manuSonyEricsson: "sonyericsson",
      manuericsson: "ericsson",
      manuSamsung1: "sec-sgh",
      manuSony: "sony",
      manuHtc: "htc", //Popular Android and WinMo manufacturer
  
      //In some UserAgents, the only clue is the operator.
      svcDocomo: "docomo",
      svcKddi: "kddi",
      svcVodafone: "vodafone",
  
      //Disambiguation strings.
      disUpdate: "update" //pda vs. update
  };
  /*
      blackberryStorm: "blackberry95", //Storm 1 and 2
      blackberryBold: "blackberry97", //Bold
      blackberryTour: "blackberry96", //Tour
      blackberryCurve: "blackberry89", //Curve 2
      blackberryTorch: "blackberry 98", //Torch
      mobi: "mobi", //Some mobile browsers put 'mobi' in their user agent strings.
  */

  var debug = function(m) {
    if (typeof(console) != "undefined" && console.log) {
      console.log(m);
    }
  }

  // Optionally takes a userAgent
  self.run = function(userAgent) {
    userAgent || (userAgent = navigator.userAgent);
    userAgentLower = userAgent.toLowerCase();

    // FAILSAFE
    
    //var startTime = new Date().getTime();

    // Loop Through Devices
    var device = null, deviceLoop;
    for (var i = self.devices.length-1; i > 0; i--) {
      deviceLoop = self.devices[i];
      // console.log(deviceLoop);
      if (deviceLoop.detect) {
        if (typeof deviceLoop.detect == 'function' && deviceLoop.detect()) {
          device = deviceLoop;
          break;
        }
      }
      else if (deviceLoop.agentRegex) {
        //console.log('agentRegex - ' + deviceLoop.agentRegex + ' - ' + (new RegExp(deviceLoop.agentRegex, 'i')).test(userAgent));
        if ((new RegExp(deviceLoop.agentRegex, 'i')).test(userAgent)) {
          device = deviceLoop;
          break;
        }
      }
      else if (deviceLoop.agent) {
        var agentType = $.type(deviceLoop.agent);
        if (agentType == 'array') {
          for (var j = deviceLoop.agent.length - 1; j > 0; j--) {
            if (userAgentLower.indexOf(deviceLoop.agent[j].toLowerCase()) > -1) {
              device = deviceLoop;
              break;
            }
          }
        }
        // STRING
        else if (userAgentLower.indexOf(deviceLoop.agent.toLowerCase()) > -1) {
          device = deviceLoop;
          break;
        }
      }
    }
    
    // DEVICE NOT FOUND
    if (device == null) {
        device = {};
        if (userAgent.indexOf('tablet') > -1)
            device.type = 'tablet';
        if (userAgent.indexOf('phone') > -1)
            device.type = 'phone';
        if (userAgent.indexOf('mobi') > -1 || userAgent.indexOf('mini') > -1)
            device.mobile = true;
    }
    
    // OPERATING SYSTEM
    var os = null, osLoop;
    for (var i = self.operatingSystems.length-1; i > 0; i--) {
      osLoop = self.operatingSystems[i];
      if (osLoop.detect) {
        if (typeof osLoop.detect == 'function' && osLoop.detect()) {
          os = osLoop;
          break;
        }
      }
      else if (osLoop.agentRegex) {
        if ((new RegExp(osLoop.agentRegex, 'i')).test(userAgent)) {
          os = osLoop;
          break;
        }
      }
      else if (osLoop.agent) {
        var agentType = $.type(osLoop.agent);
        if (agentType == 'array') {
          for (var j = osLoop.agent.length - 1; j > 0; j--) {
            // osLoop.agent[j];
            if (userAgentLower.indexOf(osLoop.agent[j].toLowerCase()) > -1) {
              os = osLoop;
              break;
            }
          }
        }
        // STRING
        else if (userAgentLower.indexOf(osLoop.agent.toLowerCase()) > -1) {
          os = osLoop;
          break;
        }
      }
    }
    if (os && os.name)
      device.os = os.name;
    
    // BROWSER
    var browser = {name:null}, browserLoop;
    for (var i = self.browsers.length-1; i > 0; i--) {
      browserLoop = self.browsers[i];
      if (typeof browserLoop == 'undefined')
        continue;
      if (typeof browserLoop.detect == 'function') {
        if (browserLoop.detect()) {
          browser = browserLoop;
          break;
        }
      }
      else if (browserLoop.agentRegex) {
        if ((new RegExp(browserLoop.agentRegex, 'i')).test(userAgent)) {
          browser = browserLoop;
          break;
        }
      }
      else if (browserLoop.agent) {
        var agentType = $.type(browserLoop.agent);
        if (agentType == 'array') {
          for (var j = browserLoop.agent.length - 1; j > 0; j--) {
            // browserLoop.agent[j];
            if (userAgentLower.indexOf(browserLoop.agent[j].toLowerCase()) > -1) {
              browser = browserLoop;
              break;
            }
          }
        }
        // STRING
        else if (userAgentLower.indexOf(browserLoop.agent.toLowerCase()) > -1) {
          browser = browserLoop;
          break;
        }
      }
    }
    if (browser.name)
      device.browser = browser.name;

    // TYPE & MOBILE FLAGS
    if (device.type) {
      device[device.type] = true;
      if (device.type == 'phone' || device.type == 'tablet' || device.type == 'music')
        device.mobile = true;
    }

    // ADD FLAGS
    if (device.flag) {
      device[device.flag] = true;
    }
    
    //var endTime = new Date().getTime();
    //console.log(['jandi_agent - time taken', endTime - startTime]);
    
    device.userAgent = userAgent;

    return self.device = device;
  };

  self.runOnce = function(userAgent) {
    var device;
    if (device = $.cookie('jandi_agent')) {
        //return device;
    }
    /*
    // DONT REQUIRE $.cookie
    if (document.cookie.indexOf('jandi_agent') > -1) {
      var cookies = document.cookie.split(";");
      var cookieRaw, cookie;
      for (i = cookies.length; i > 0; i--) {
        cookieRaw = cookies[i].split('=');
        if (cookieRaw[0])
      }
      
    }
    */
    else if (self.device) {
      return self.device;
    }
    else {
      //$.cookie('jandi_agent', self.run(), {expires: 3650, path: '/'});
      return self.run();
    }
  };
  
  self.getDevice = self.runOnce;

  // Initialize
  // Optionally takes a userAgent
  self.init = function(userAgent) {
    return self.runOnce(userAgent);
  };

  // FOR TESTING
  self.alert = function() {
    debug('jandi_agent');
    debug(self.device);
  };

  return self;

})();

if (typeof jandi == 'undefined') var jandi = {};
jandi.agent = jandi_agent;

// START
jandi_agent.init();
