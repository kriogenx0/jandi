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

jandi_agent = (function() {
  var self = {};

  self.operatingSystems = [
    {
      name: 'Mac OS X',
      agent: ['Macintosh', 'Mac OS X'],
      flag: 'mac'
    },
    {
      name: 'Windows',
      agent: 'Windows'
    }
  ];

  self.browsers = [
    {
      name: 'Google Chrome',
      agent: 'Chrome',
      flag: 'chrome'
    },
    {
      name: 'Safari',
      agent: 'Safari',
      flag: 'safari'
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
      type: 'desktop',
      flag: 'ie'
    }
  ];

  self.devices = [
    // Apple
    {
      name: 'iPad',
      agent: 'iPad',
      type: 'tablet',
      smart: 1,
      flag: 'ipad'
    },
    {
      name: 'iPod',
      agent: 'iPod',
      type: 'music',
      smart: 1,
      flag: 'ipod'
    },
    {
      name: 'iPhone',
      agent: 'iPhone',
      type: 'phone',
      smart: 1,
      flag: 'iphone'
    },
    {
      name: 'Apple Macintosh',
      agent: 'Mac OS X 10',
      type: 'desktop',
      flag: 'mac'
    },
    // Android
    {
      agent: 'android',
      smart: 1,
      mobile: 1
    },
    // Blackberry
    {
      name: 'Blackberry Playbook',
      agent: 'playbook',
      type: 'tablet'
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
    {
      agent: 'xoom',
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
      agentSearch: 'palm|opera mini|hiptop|windows ce|smartphone|mobile|treo',
      type: 'phone'
    },
    // OLD
    {
      name: 'Symbian',
      agent: ['Symbian', 'Series60', 'Series70', 'Series80', 'Series90']
    },
    // BOTS
    {
      agentSearch: 'alexa|bot|crawler|crawling|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo|yandex',
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
      mobile: 1
    },
    // TVs
    {
      agent: 'googletv'
    },
    // OTHERS
    {    
        // GOOGLE
        googleTv: "googletv",
    
        xoom: "xoom",
        nuvifone: "nuvifone",
    
        // WINDOWS
        deviceWinPhone7: "windows phone os 7",
        deviceWinMob: "windows ce",
        deviceWindows: "windows",
        deviceIeMob: "iemobile",
        devicePpc: "ppc", //Stands for PocketPC
        enginePie: "wm5 pie",  //An old Windows Mobile
    
        blackberry: "blackberry",
        vndRIM: "vnd.rim", //Detectable when BB devices emulate IE or Firefox
        blackberryStorm: "blackberry95", //Storm 1 and 2
        blackberryBold: "blackberry97", //Bold
        blackberryTour: "blackberry96", //Tour
        blackberryCurve: "blackberry89", //Curve 2
        blackberryTorch: "blackberry 98", //Torch
    
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
        devicePlaystation: "playstation",
        deviceNintendoDs: "nitro",
        deviceNintendo: "nintendo",
        deviceWii: "wii",
        deviceXbox: "xbox",
        deviceArchos: "archos",
        engineOpera: "opera", //Popular browser
        engineNetfront: "netfront", //Common embedded OS browser
        engineUpBrowser: "up.browser", //common on some phones
        engineOpenWeb: "openweb", //Transcoding by OpenWave server
        deviceMidp: "midp", //a mobile Java technology
        uplink: "up.link",
        engineTelecaQ: 'teleca q', //a modern feature phone browser
    
        devicePda: "pda",
        mini: "mini",  //Some mobile browsers put 'mini' in their names.
        mobile: "mobile", //Some mobile browsers put 'mobile' in their user agent strings.
        mobi: "mobi", //Some mobile browsers put 'mobi' in their user agent strings.
    
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
      }
  ];

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
    var device = null;
    
    var startTime = new Date().getTime();

    // Loop Through Devices
    var devicesLength = self.devices.length;
    for (var i = 0; i < devicesLength; i++) {
      // console.log(self.devices[i]);
      if (self.devices[i].detect) {
          if (typeof self.devices[i].detect == 'function') {
            if (self.devices[i].detect() ) {
              device = self.devices[i];
              break;
            }
          }
      }
      else if (self.devices[i].agentSearch) {
        if (new RegExp(self.devices[i].agentSearch).test(userAgent), 'i') {
            device = self.devices[i];
            break;
        }
          
      }
      else if (self.devices[i].agent) {
        var agentType = $.type(self.devices[i].agent);
        if (agentType == 'array') {
            for (var j = self.devices[i].agent.length; j > 0; j--) {
                self.devices[i].agent[j];
            }
        }
        // STRING
        else {
            if (userAgentLower.indexOf(self.devices[i].agent.toLowerCase()) > -1) {
                device = self.devices[i];
                break;
            }
        }
          
      }
    }
    
    if (device == null) {
        device = {};
        if (userAgent.indexOf('tablet') > -1)
            device.type = 'tablet';
        if (userAgent.indexOf('phone') > -1)
            device.type = 'phone';
        if (userAgent.indexOf('mobi') > -1 || userAgent.indexOf('mini') > -1)
            device.mobile = true;
    }

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
    
    var endTime = new Date().getTime();
    
    //console.log(['jandi_agent - time taken', endTime - startTime]);
    
    device.userAgent = userAgent;

    return self.device = device;
  };

  self.runOnce = function(userAgent) {
    var device;
    if (device = $.cookie('jandi_agent')) {
        return device;
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
      self.run();
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
