var raptorquick = function(){
	
	var l = function($){
	
		// BUTTON
		$("input[type='button'], input[type='submit'], input[type='reset']").raptor("button");
		
		// TEXTBOX
		$("input[type='text'], input[type='password']").raptor("textbox");
		
		// TEXTAREA
		$("textarea").raptor("textarea"); // TEXTAREA MAY NOT WORK
		
		// SELECT
		$("select").raptor("comboSelect");
		
		// ADD CHECKBOXES
		
		// ADD RADIO
		
	};
	if (jQuery) l(jQuery);
	
}();