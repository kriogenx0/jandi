(function($) {

    // CLASS DEFINITION
    $.fn.tabulator = function (options) {
		
		// DEFAULTS
		var _d = {
			transition: true,
			transitionSpeed: 300,
			contentClass: "tabulator-content"
		};

        var _o = $.extend({}, _d, options);
		
		return this.each(function() {
			
			el = jQuery(this);
			
			el.addClass("ui-tabulator");
			
			var transitioning = false;
			var selectedSection = 0;
			
			var _tabCtn = el.find(".tabulator-tabs");
			if (!(_tabCtn.length > 0)) {
				_tabCtn = jQuery("<div>").addClass("tabulator-tabs");
				el.prepend(_tabCtn);
			}
			
			var _allTabs = _tabCtn.find("a");
			var _allSections = el.find(".tab-section[title]");
			
			var _contentCtn = el.find("." + _o.contentClass);
			if (!(_contentCtn.length > 0)) {
				_contentCtn = jQuery("<div>").addClass(_o.contentClass);
				el.append(_contentCtn);
			}
			
			_contentCtn.append(_allSections);
			
			if (!(_allTabs.length > 0)) {
				// CREATE TABS
				_allSections.each(function() {
					_tabCtn.append("<a href='javascript: void(0);'><b></b><span>" + jQuery(this).attr("title") + "</span><i></i></a>");
				});
				
			}
			
			_allTabs = _tabCtn.find("a"); // UPDATE AFTER ADDING ANCHORS
			
			_allTabs.click(function() {
				if (transitioning) return;
				var t = jQuery(this);
				_tabCtn.find("a").removeClass("tab-active");
				t.addClass("tab-active");
				var txt = t.find("span").text();
				var nextSection = _contentCtn.find(".tab-section[title=" + txt + "]");
				
				if (!selectedSection) selectedSection = nextSection;
				else if (selectedSection.attr("title") == nextSection.attr("title")) return;
				
				
				if (_o.transition) {
					transitioning = true;
					selectedSection.fadeOut(_o.transitionSpeed/2, function() {
						selectedSection = nextSection;
						transitioning = false;
						nextSection.fadeIn(_o.transitionSpeed);
					});
				} else {
					selectedSection = nextSection;
					selectedSection.hide();
					nextSection.show();
				}
			});
			
			_allSections.hide();		
			
			// INITIATE FIRST IF EXISTS
			//selectedSection = _allSections.first();	
			var _firstTab = _allTabs.find(".tab-active");
			if (!(_firstTab.length > 0)) {
				_firstTab = _allTabs.first();
			}
			_firstTab.trigger('click');
			
		});
	};
	
})(jQuery); // end of closure, bind to jQuery Object

	
/*
Tabulator Example

$(document).ready(function() {
						   
	jQuery("div.propertiesPanel").tabulator;
	
	jQuery("div.featurePanel").tabulator;
	
});
*/