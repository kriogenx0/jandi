var omui = function(){
	
	var init = function() {
		$(function(){
		
			// BUTTONS
			jQuery("a.omui-button").raptor("button");
			
			
			// FORM ELEMENTS
			jQuery("input.one-textbox").raptor("textbox");
			
			$("input[type='checkbox'].omui").raptor();
			
			
			
			/*
			
			jQuery("select.one-select").raptor("select");
			jQuery("div.one-checklist").raptor("checklist");
			jQuery("select.one-listSelect").raptor("listSelect");
			
			
			// LISTS
			jQuery("ul.one-listPanel").raptor("listPanel");
			jQuery("ul.one-listAlt").raptor("listAlt");
			jQuery("ul.one-list-doubleborder").raptor("listDoubleBorder");
			
			// PANELS
			jQuery("div.one-panel").raptor("panel");
			jQuery("div.one-panel-secondBg").raptor("panel-secondbg");
			jQuery("div.one-panel-rounded").raptor("panel-rounded");
			
			// TABS
			jQuery("div.a123-tall-tabs").raptor("tabs");	
			jQuery("div.actionTabs").addClass("a123-tabs").raptor("tabs");
			*/
		
		});
	};
	return {
		init: init	
	};
}();

omui.init();

