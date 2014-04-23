/*
// Raptor
// Version: 1.1.02
// Developed By
// Alex Vaos
// simplex0@gmail.com
// 
// REQUIRES:
// jquery
*/

(function($){
	
	// UTILITIES
	var debug = function(text,type) {
		if (window.console && window.console.log) {
			if(type == 'info' && window.console.info) {
				window.console.info(text);
			}
			else if(type == 'warn' && window.console.warn) {
				window.console.warn(text);
			}
			else {
				window.console.log(text);
			}
		}
	};
	
	var run = function(code) {
		try {
			return new Function("return " + code)();
		} catch (e) {
			debug("RAPTOR - RUN ERROR");
		}
	};
	
	
	$.fn.raptor = function(options) {
		
		// RUN RAPTOR AS FUNCTIONS
		
		var r = $.fn.raptor;
		
		////////
		// CALL INIT
		// RAN FOR EVERY FUNCTION CALL INSTANCE
		
		var _d = {
			name: null,
			type: null, // TYPES: textbox, button, select, listSelect, listPanel, panel, colorSwatch, checklist
			prefix: null,
			me: "raptor",
			ui: "raptorui",
			t: this,
			selector: this.selector,
			nosprites: false, // WHETHER OR NOT TO USE SPRITES
			debug: false
		};
		if (typeof(options) == "string") {
			// SET TYPE
			options = {
				type: options
			};
		}
		var _o = $.extend({}, _d, options);
	
		// GLOBAL FUNCTIONS
		var _f = {};
		
		_f.rap = function(name, w, tag) {
			tag = tag || "div";
			//var e = $("<" + tag + " class=\"" + _o.prefix + "-" + name + "\">");
			w.wrapInner(_f.create(name, tag));
			return w.find(tag + "." + _o.prefix + "-" + name);
		};
		
		_f.createInside = _f.rap;
		
		_f.createOutside = function(name, w, tag) {
			if (w && w.wrap && w.parent) {
				tag = tag || "div";
				var el = _f.create(name, tag);
				w.wrap(el);
				return w.parent();
			} else {
				debug("ERROR - createOutside: " + w);	
			}
		};
		
		_f.create = function(cls, tag) {
			tag = tag || "div";
			//if (jQuery.browser.msie) return $("<" + tag + " class=\"" + _o.prefix + "-"  + cls + "\">&nbsp;</" + tag + ">");
			return $("<" + tag + " class=\"" + _o.prefix + "-"  + cls + "\"></" + tag + ">");
		};
		
		_f.focusBlur = function(input, cls, el) {
			el = el || input;
			input.focus(function() { el.addClass(cls); });
			input.blur(function() { el.removeClass(cls); });
		};
		
		_f.hoverClass = function(el, cls) {
			if (el.hover) {
				el.hover(
					function() {
						$(this).addClass(cls);
					},
					function() {
						$(this).removeClass(cls);
					}
				);
			}
		}
		
		_f.downClass = function(el, cls) {
			if (el.mousedown) {
				el.mousedown(function() {
					$(this).addClass(cls);
				});
				el.mouseup(function() {
					$(this).removeClass(cls);
				});
				el.mouseleave(function() {
					$(this).removeClass(cls);
				});
			}
		}
		
		_f.noSelect = function(target) {
			target = jQuery(target);
	
			if (jQuery.browser.mozilla) {
				return target.each(function() {
					target.css({
						'MozUserSelect': 'none'
					});
				});
			} else if (jQuery.browser.msie) {
				target.onselectstart = function() { return false; }
				target.bind('selectstart', function() { return false; });	
			} else {
				target.each(function() {
					target.bind('selectstart.disableTextSelect', function() {
						return false;
					});
				});
				target.mousedown(function() { return false; });
			}
	
		}
	
		// RAN FOR EVERY INSTANCE FOUND
		return this.each(function(){
			
			// I - VARIABLE FOR COMPONENTS
			var _i = { // ITEM CONTROLS, PRIVATES, AND OPTIONS
				c: {},
				p: {},
				o: _o,
				f: _f,
				rap: _f.rap,
				create: _f.create,
				focusBlur: _f.focusBlur,
				hoverClass: _f.hoverClass,
				downClass: _f.downClass
			};
			
			_i.c.self = jQuery(this);
			
			// FIND OUT TYPE
			if (_i.o.type === null || (typeof(r.components[_i.o.type]) != "function" && typeof(r.components[_i.o.type]) != "object")) {
				
				// LOOP THROUGH COMPONENTS
				for (prop in r.components) {
					var compname = r.components[prop];
					if (_i.o.selector.indexOf(prop) != "-1") {
						_i.o.type = prop;
						break;
					}
				}
				
				if (_i.o.type === null) {
					if (_i.c.self.is("select")) {
						_i.o.type = "select";
					} else if (_i.c.self.is("input")) {
						if (_i.c.self.attr("type") == "checkbox") {
							_i.o.type == "checkbox";
						} else if (_i.c.self.attr("type") == "radio") {
							_i.o.type == "radio";
						} else {
							_i.o.type == "textbox";
						}
					}
				}
				
				if (_i.o.type) debug("RAPTOR - NO TYPE SELECTED: " + _i.o.selector + " - DETERMINED AS: " + _i.o.type);
				else debug("RAPTOR - NO TYPE FOUND: " + _i.o.selector);
			}
			if (_i.o.type === null) {
				return;
			}
			
			
			//if (_i.o.name == null) _i.o.name = _c.self.attr("class");
			if (_i.o.name == null) _i.o.name = _i.o.me + "-" + _i.o.type;
			if (_i.o.prefix == null) _i.o.prefix = _i.o.type;
			
			if (!_i.c.self.hasClass(_i.o.name + "-styled")) {
				_i.c.self.addClass(_i.o.name + "-styled");
				if (jQuery.browser.msie) _i.c.self.addClass(_i.o.me + "-ie");
				
				var ret; // COMPONENT RETURN
				
				// RUN COMPONENT
				
				if (typeof(r.components[_i.o.type]) == "function") {
					// debug("RAPTOR - RAN: " + _i.o.type);
					ret = r.components[_i.o.type](_i);
				} else if (typeof(r.components[_i.o.type]) == "object" && typeof(r.components[_i.o.type].init) == "function") {
					// debug("RAPTOR - RAN: " + _i.o.type);
					ret = r.components[_i.o.type].init(_i);
				} else {
					debug("RAPTOR - COULD NOT RUN COMPONENT: " + _i.o.type);	
				}
				
				if (ret) {
					
					// ADD UI CLASS
					if (ret.c && ret.c.ctn)
						ret.c.ctn.addClass(_i.o.me + "-" + _i.o.type).addClass(_i.o.ui + "-" + _i.o.type);
						
					// ADD SPRITE CLASS
					if (ret.o && ret.o.nosprites && ret.c && ret.c.ctn)
						ret.c.ctn.addClass(_i.o.me + "-nosprites");
					
				}
				
				return ret;
				
			}
		
		
		});	
	};
	
	// BUILT IN COMPONENTS
	$.fn.raptor.components = {
		"listSelect":0,
		"listPanel":0,
		"listAlt":0,
		"listDoubleborder":0,
		"panelRound":0,
		"panelSecondbg":0,
		"customOptions":0,
		"colorSwatch":0,
		"checklist":0,
		"tabs":0,
		"textbox":0,
		"button":0,
		"select":0,
		"panel":0
	};
	
	/* COMPONENT DEVELOPMENT OPTIONS */
	/*
	i.c				// CONTROLS
	i.p				// PRIVATES
	i.o				// OPTIONS
	i.f				// FUNCTIONS
	i.rap			// RAP FUNCTION
	i.create		// CREATE
	i.focusBlur 	// focusBlur,
	i.hoverClass	// hoverClass,
	i.downClass		// downClass
	*/
	
	
	
	// TEXTBOX COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.textbox = function(i) {
		
		// if (i.o.floatWrap) {
		
			i.c.ctn = $("<div class=\"" + i.o.name + "\">");
							
			i.c.self.wrap(i.c.ctn);
			
			i.c.ctn = i.c.self.parent();
			
			i.focusBlur(i.c.self, i.o.prefix + "-focus", i.c.ctn);
			i.hoverClass(i.c.ctn, i.o.prefix + "-over");
			
			i.c.self.wrap("<div class=\"" + i.o.prefix + "-bg\">");
			i.c.ctn.prepend("<div class=\"" + i.o.prefix + "-left\">");
			i.c.ctn.append("<div class=\"" + i.o.prefix + "-right\">");
			
			
		
		/*
		} else {
			
			i.c.bg = $("<div class=\"" + i.o.prefix + "-bg\">");
			i.c.self.wrapInner(i.c.bg);
			i.c.contents = $("<div class=\"" + i.o.prefix + "-contents\">");
			i.c.bg = i.c.self.find("div." + i.o.prefix + "-bg");
			i.c.bg.wrapInner(i.c.contents);
			i.c.self.prepend("<div class=\"" + i.o.prefix + "-left\">");
			i.c.self.append("<div class=\"" + i.o.prefix + "-right\">");
			
			
		}
		*/
	
		return i;
	}
	
	// TEXTAREA COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.textarea = function(i) {
		
		i.c.self.addClass(i.o.name);
		
		i.c.ctn = i.c.self;
		
		i.c.center = i.rap("center", i.c.ctn);
		
		i.c.left = i.rap("l", i.c.center);
		
		i.c.right = i.rap("r", i.c.left);
		
		i.c.bg = i.rap("bg", i.c.right);
		
		i.c.contents = i.rap("contents", i.c.bg);
		
		i.c.ctn.prepend("<div class=\"" + i.o.prefix + "-top\"><div class=\"" + i.o.prefix + "-tl\"><div class=\"" + i.o.prefix + "-tr\"><div class=\"" + i.o.prefix + "-t\"></div></div></div></div>");
		i.c.ctn.append("<div class=\"" + i.o.prefix + "-bottom\"><div class=\"" + i.o.prefix + "-bl\"><div class=\"" + i.o.prefix + "-br\"><div class=\"" + i.o.prefix + "-b\"></div></div></div></div>");
	
		return i;
	}
	
	
	
	// BUTTON COMPONENT
	///////////////////////////////////////////
	
	
	$.fn.raptor.components.button = function(i) {
		
		if (i.c.self.is("input") || i.c.self.is("button")) {
			
							
			i.c.bg = i.f.createOutside("bg", i.c.self);
			
			i.c.ctn = i.f.createOutside("contents", i.c.bg);
			
			i.c.ctn.prepend("<div class=\"" + i.o.prefix + "-left\">&nbsp;</div>");
			i.c.ctn.append("<div class=\"" + i.o.prefix + "-right\">&nbsp;</div>");
			i.c.ctn.append("<div class=\"" + i.o.prefix + "-clear\">&nbsp;</div>");
			
			i.c.ctn.addClass(i.o.name);
			
		} else {
		
			i.c.self.addClass(i.o.name);
							
			i.c.bg = i.rap("bg", i.c.self, "span");
			//if (jQuery.browser.msie) i.c.bg = i.c.self.find("span." + i.o.prefix + "-bg");
			
			i.c.contents = i.rap("contents", i.c.bg, "span");
			//i.c.contents = $("<span class=\"" + i.o.prefix + "-contents\">");
			//i.c.bg.wrapInner(i.c.contents);
			
			i.c.self.prepend("<span class=\"" + i.o.prefix + "-left\">&nbsp;</span>");
			i.c.self.append("<span class=\"" + i.o.prefix + "-right\">&nbsp;</span>");
			i.c.self.append("<span class=\"" + i.o.prefix + "-clear\">&nbsp;</span>");
			
		}
		
		if (!i.c.self.is("a")) {
			i.hoverClass(i.c.self, i.o.prefix + "-over");
		}
		i.downClass(i.c.self, i.o.prefix + "-down");
		
		return i;
	};
	
	// CHECKBOX COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.checkbox = function(i) {
				

		/*
		// CHECKBOX jQUERY PLUGIN WRITTEN FOR SHOWROOM
		if (typeof(name) == "object" && type(options) == "undefined") {
			name = null;
			options = name;
		}
		
		*/
		var checked = false;
		
		i.o.checkedClass = i.o.prefix + "-checked";
		
		i.c.input = i.c.self;
		
		if (i.c.input.attr("checked") && i.c.input.attr("checked") != "false") {
			checked = true;
		}
		
		i.c.parent = i.c.input.parent();		
		
		if (i.c.input.is(":only-child")) {
			i.c.ctn = i.c.parent;			
		} else if (i.c.parent.is("label")) {
			//  || i.c.parent.attr("class").indexOf("label") >= 0
			i.c.ctn = i.c.parent;
			// i.c.label.parent().append(i.c.input);
		} else {
			i.c.ctn = i.f.createOutside("ctn", i.c.input);
		}
		
		// CREATE LABEL
		i.c.label = i.f.createInside("label", i.c.ctn);
		i.c.ctn.append(i.c.input);
		
				
		// CREATE INPUT
		/*
		if (!i.c.input.nodeName) {
			i.c.input = jQuery("<input>").attr("type", "checkbox");
			i.c.ctn.prepend(i.c.input);
		}
		*/
		// VALUE
		if (i.c.input.val() != "" && i.c.label.text().length > 0) 
			i.c.input.val(i.c.label.text());
		
		
		// CREATE DISPLAY BOX
		i.c.box = i.f.create("box");
		i.c.ctn.prepend(i.c.box);
		i.c.box.append(i.f.create("checkmark"));
		//i.c.box.prepend(jQuery("<b>").width(o.width).height(o.height)); // CHECKED MARK
		//i.c.box.width(i.o.width).height(i.o.height).addClass("Checkbox");
		
		i.f.hoverClass(i.c.ctn, i.o.prefix + "-over");
		i.f.downClass(i.c.ctn, i.o.prefix + "-down");
		i.f.noSelect(i.c.ctn);
		
		i.c.ctn.attr("title", i.c.input.val());
		
		
		// CHECKBOX
		// i.c.input.css("display", "block"); //TESTING
		
		var _toggle = function() {
			// debug("BEFORE: " + checked);
			if (checked) {
				_uncheck();
			} else {
				_check();
			}
			// debug("AFTER: " + checked);
		};
		
		var _check = function() {
			checked = true;
			i.c.ctn.addClass(i.o.checkedClass);
			i.c.input.attr("checked", true);
		};
		
		var _uncheck = function() {
			checked = false;
			i.c.ctn.removeClass(i.o.checkedClass);
			i.c.input.attr("checked", false);
		}
		
		
		// EVENT
		i.c.ctn.mouseup(_toggle);
		
		if (checked) _check();
		
		
		
		


		return i;
	}
	
	// RADIO COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.radio = function(i) {

		var checked = false;
		
		i.o.checkedClass = i.o.prefix + "-checked";
		
		i.c.input = i.c.self;
		
		if (i.c.input.attr("checked") && i.c.input.attr("checked") != "false") {
			checked = true;
		}
		
		i.c.parent = i.c.input.parent();		
		
		if (i.c.input.is(":only-child")) {
			i.c.ctn = i.c.parent;			
		} else if (i.c.parent.is("label")) {
			//  || i.c.parent.attr("class").indexOf("label") >= 0
			i.c.ctn = i.c.parent;
			// i.c.label.parent().append(i.c.input);
		} else {
			i.c.ctn = i.f.createOutside("ctn", i.c.input);
		}
		
		// CREATE LABEL
		i.c.label = i.f.createInside("label", i.c.ctn);
		i.c.ctn.append(i.c.input);
		
				
		// CREATE INPUT
		/*
		if (!i.c.input.nodeName) {
			i.c.input = jQuery("<input>").attr("type", "checkbox");
			i.c.ctn.prepend(i.c.input);
		}
		*/
		// VALUE
		if (i.c.input.val() != "" && i.c.label.text().length > 0) 
			i.c.input.val(i.c.label.text());
		
		// CREATE DISPLAY BOX
		i.c.box = i.f.create("box");
		i.c.ctn.prepend(i.c.box);
		i.c.box.append(i.f.create("checkmark"));
		//i.c.box.prepend(jQuery("<b>").width(o.width).height(o.height)); // CHECKED MARK
		//i.c.box.width(i.o.width).height(i.o.height).addClass("Checkbox");
		
		i.f.hoverClass(i.c.ctn, i.o.prefix + "-over");
		i.f.downClass(i.c.ctn, i.o.prefix + "-down");
		i.f.noSelect(i.c.ctn);
		
		i.c.ctn.attr("title", i.c.input.val());
		
		
		// CHECKBOX
		// i.c.input.css("display", "block"); //TESTING
		
		var _toggle = function() {
			// debug("BEFORE: " + checked);
			if (checked) {
				_uncheck();
			} else {
				_check();
			}
			// debug("AFTER: " + checked);
		};
		
		var _check = function() {
			checked = true;
			i.c.ctn.addClass(i.o.checkedClass);
			i.c.input.attr("checked", true);
		};
		
		var _uncheck = function() {
			checked = false;
			i.c.ctn.removeClass(i.o.checkedClass);
			i.c.input.attr("checked", false);
		}
		
		
		// EVENT
		i.c.ctn.mouseup(_toggle);
		
		if (checked) _check();
		
		return i;
	}
	

	// COMBO SELECT COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.comboSelect = function(it) {
		
		var selectedIndex = 0;
		
		it.c.ctn = $("<div class=\"" + it.o.name + "\">");
		
		it.c.self.wrap(it.c.ctn);
		
		it.c.ctn = it.c.self.parent();
		
		//it.c.self.wrap("<div class=\"" + it.o.prefix + "-bg\">");
		
		it.c.heading = jQuery("<div class=\"" + it.o.prefix + "-heading\">");
		it.c.ctn.prepend(it.c.heading);
		
		// it.c.label = jQuery("<div class=\"" + it.o.prefix + "-label\">");
		it.c.input = jQuery("<input class=\"" + it.o.prefix + "-input\" type=\"text\" />");
		
		it.c.heading.prepend(it.c.input);
		
		it.c.input.keyup(function(e) {
			if (e.which == 13 || e.which == 9 || e.which == 27) { // ENTER, TAB, ESC
				_close();
			} else if (e.which == 38) { // UP ARROW
				
			} else if (e.which == 40) { // DOWN ARROW
			
			} else if ((e.which >= 16 && e.which <= 20) || e.which == 144) { // MODIFIERS LIKE SHIFT, CONTROL, ALT, CAPS, NUMLOCK
				// DO NOTHING
				
			} else {
				_open();
				var v = it.c.input.val();
				if (v.length > 0)
					_highlightOption(v);
			}
		});
		
		
		it.c.heading.prepend("<div class=\"" + it.o.prefix + "-right\">");
		it.c.heading.prepend("<div class=\"" + it.o.prefix + "-left\">");
		
		it.hoverClass(it.c.heading, it.o.prefix + "-over");
		it.downClass(it.c.heading, it.o.prefix + "-down");
		
		// ITEMS
		it.c.itemsMask = $("<div class=\"" + it.o.prefix + "-itemsMask\">");
		it.c.ctn.append(it.c.itemsMask);
		
		it.c.itemsCtn = $("<div class=\"" + it.o.prefix + "-items\">");
		it.c.itemsMask.append(it.c.itemsCtn);
		
		it.c.selectItems = it.c.self.find("option");
		
		// ADD OPTIONS
		it.c.selectItems.each(function(){
			var j = $(this);
			var opt = $("<div class=\"" + it.o.prefix + "-option\">" + j.text() + "</div>");
			it.c.itemsCtn.append(opt);
			it.f.hoverClass(opt, it.o.prefix + "-over");
			opt.click(function(){
				var o = $(this);
				// NEED TO SELECT VALUE IN SELECT TAG
				it.c.input.val(o.text());
				//it.c.self.find("option")$(this)
				_close();
				it.c.items.removeClass(it.o.prefix + "-lowlight").removeClass(it.o.prefix + "-over");
			});
		});
		
		it.c.items = it.c.itemsCtn.find("div." + it.o.prefix + "-option");
		
		it.c.itemsMask.height(it.c.itemsCtn.height() * 1.1);
		
		// OPTIONS CTN
		// it.f.noSelect(it.c.ctn);
		
		it.c.heading.click(function() {
			if (it.p.opened)
				_close();
			else
				_open();
		});
		
		var _highlightOption = function(v) {
			var first, highlights = [];
			it.c.items.each(function(){
				var opt = $(this);
				if (opt.text().indexOf(v) != -1) {
					highlights.push(opt);
					if (!first) first = opt;
				}
			});
			it.c.items.removeClass(it.o.prefix + "-lowlight").removeClass(it.o.prefix + "-over");
			if (highlights.length == 1) {
				it.c.items.addClass(it.o.prefix + "-lowlight");
				first.removeClass(it.o.prefix + "-lowlight").addClass(it.o.prefix + "-over");
			} else {
				it.c.items.addClass(it.o.prefix + "-lowlight");
				$.each(highlights, function(i, t) {
					$(t).removeClass(it.o.prefix + "-lowlight");
				});
			}
			debug(first);
			debug(highlights);
			return first;
		};
		
		var _selectOption = function(v) {
			var sel;
			it.c.items.each(function(){
				var opt = $(this);
				if (opt.text().indexOf(v) != -1) {
					sel = opt;
					return false;	
				}
			});
			if (sel) {
				it.c.input.val(sel.text());
				_close();
			}
			return sel;
		};
		
		var _close = function() {
			if (it.p.opened) {
				it.p.opened = false;
				it.c.itemsCtn.animate(
					{top: 0 - it.c.itemsCtn.height() * 1.1},
					{
						queue: false,
						complete: function() {
							it.c.ctn.removeClass(it.o.prefix + "-open");
						}
					}
				);
			}
		}
		
		var _open = function() {
			if (!it.p.opened) {
				it.p.opened = true;
				it.c.ctn.addClass(it.o.prefix + "-open");
				it.c.itemsCtn.animate(
					{top: 0},
					{
						queue: false,
						complete: function() {
							$("body").one("click", _close);
						}
					}
				);
				it.c.input.select();
			}
		}
		
		var _updateLabel = function() {
			it.c.input.val(it.c.self.find('option:selected').html());	
		};
		
		_updateLabel();		
		_close();
		
		
		// EVENTS
		/*
		it.c.self.trigger("change");
		
		it.c.self.change(function() {
			it.c.label.html(it.c.self.find('option:selected').html());
		});
		*/
		
		return it;
	};
	
	$.fn.raptor.components.select = $.fn.raptor.components.dropDown;
	
	// DROPDOWN SELECT COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.dropDown = function(it) {
		
		it.c.ctn = $("<div class=\"" + it.o.name + "\">");
							
		it.c.self.wrap(it.c.ctn);
		
		it.c.ctn = it.c.self.parent();
		
		//it.c.self.wrap("<div class=\"" + it.o.prefix + "-bg\">");
		
		it.c.heading = jQuery("<div class=\"" + it.o.prefix + "-heading\">");
		it.c.ctn.prepend(it.c.heading);
		
		it.c.label = jQuery("<div class=\"" + it.o.prefix + "-label\">");
		it.c.heading.prepend(it.c.label);
		
		it.c.heading.prepend("<div class=\"" + it.o.prefix + "-right\">");
		it.c.heading.prepend("<div class=\"" + it.o.prefix + "-left\">");
		
		it.hoverClass(it.c.heading, it.o.prefix + "-over");
		it.downClass(it.c.heading, it.o.prefix + "-down");
		
		// ITEMS
		it.c.itemsMask = $("<div class=\"" + it.o.prefix + "-itemsMask\">");
		it.c.ctn.append(it.c.itemsMask);
		
		it.c.itemsCtn = $("<div class=\"" + it.o.prefix + "-items\">");
		it.c.itemsMask.append(it.c.itemsCtn);
		
		
		it.c.items = it.c.self.find("option");
		
		it.c.items.each(function(){
			var j = $(this);
			var opt = $("<div class=\"" + it.o.prefix + "-option\">" + j.text() + "</div>");
			it.c.itemsCtn.append(opt);
			it.f.hoverClass(opt, it.o.prefix + "-over");
			opt.click(function(){
				var o = $(this);
				// NEED TO SELECT VALUE IN SELECT TAG
				it.c.label.text(o.text());
				//it.c.self.find("option")$(this)
				_close();
			});
		});
		
		it.c.itemsMask.height(it.c.itemsCtn.height() * 1.1);
		
		it.f.noSelect(it.c.ctn);
		
		it.c.heading.click(function() {
			if (it.p.opened)
				_close();
			else
				_open();
		});
		
		var _close = function() {
			it.p.opened = false;
			it.c.itemsCtn.animate(
				{top: 0 - it.c.itemsCtn.height() * 1.1},
				{
					queue: false,
					complete: function() {
						it.c.ctn.removeClass(it.o.prefix + "-open");
					}
				}
			);
		}
		
		var _open = function() {
			it.p.opened = true;
			it.c.ctn.addClass(it.o.prefix + "-open");
			it.c.itemsCtn.animate({top: 0},
				{
					queue: false,
					complete: function() {
						$("body").one("click", _close);
					}
				}
			);
		}
		
		var _updateLabel = function() {
			it.c.label.html(it.c.self.find('option:selected').html());	
		};
		
		_updateLabel();		
		_close();
		
		
		// EVENTS
		/*
		it.c.self.trigger("change");
		
		it.c.self.change(function() {
			it.c.label.html(it.c.self.find('option:selected').html());
		});
		*/
		
		return it;
	};
	
	$.fn.raptor.components.select = $.fn.raptor.components.dropDown;
	
	// SIMPLE SELECT COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.simpleSelect = function(i) {
		
		i.c.ctn = $("<div class=\"" + i.o.name + "\">");
							
		i.c.self.wrap(i.c.ctn);
		
		i.c.ctn = i.c.self.parent();
		
		//i.c.self.wrap("<div class=\"" + i.o.prefix + "-bg\">");
		i.c.label = jQuery("<div class=\"" + i.o.prefix + "-label\">");
		i.c.ctn.prepend(i.c.label);
		
		i.c.ctn.prepend("<div class=\"" + i.o.prefix + "-right\">");
		i.c.ctn.prepend("<div class=\"" + i.o.prefix + "-left\">");
		
		// EVENTS
		i.c.self.change(function() {
			i.c.label.html(i.c.self.find('option:selected').html());
		});
		i.c.self.trigger("change");
		
		return i;
	};
	
	
	// LISTSELECT COMPONENT
	///////////////////////////////////////////
	
	
	$.fn.raptor.components.listSelect = function(it) {
		it.o.transitionSpeed = it.o.transitionSpeed || 400;
	
		it.c.select = it.c.self;
	
		// ADD CONTAINER
		it.c.ctn = $("<div class=\"" + it.o.name + "\">");
		it.c.select.wrap(it.c.ctn);
		it.c.ctn = it.c.select.parent();
		
		it.c.opts = it.c.select.find("option");
		it.c.opts.each(function(){
			
			var t = jQuery(this);
			
			var opt = jQuery("<div class=\"" + it.o.prefix + "-option\">" + t.text() + "</div>");
			it.c.ctn.append(opt);
			
			// NEED TO STORE OPTION VALUE IN OPTION DIV
			
			opt.click(function() {
				var s = jQuery(this);
				s.siblings().removeClass("active");
				s.addClass("active");
			});
			
		});
		it.c.optionLinks = it.c.ctn.find("a, div." + it.o.prefix + "-option");
		
		// CREATE SELECTOR
		it.c.selector = jQuery("<div class=\"" + it.o.prefix + "-selector\"><div class=\"" + it.o.prefix + "-selector-left\"><div class=\"" + it.o.prefix + "-selector-right\"><div class=\"" + it.o.prefix + "-selector-bg\">&nbsp;</div></div></div>");
		it.c.ctn.append(it.c.selector);
		
		it.c.ctn.append("<div class=\"clear\"></div>");
		
		// OPTION LINKS
		it.c.optionLinks.click(function() {
			// if (it.p.intrans) return;
			
			var t = jQuery(this);
			t.siblings().removeClass(it.o.prefix + "-active");
			
			// NEED TO SELECT VALUE IN SELECT
			//it.c.select
			
			// START ANIMATION
			//it.p.ctnOffset = it.c.ctn.offset().top; // GET OFFSET
			var top =  t.offset().top - it.c.ctn.offset().top;
			//debug(top);
			it.c.selector.animate({ "top": top }, {"duration" : it.o.transitionSpeed, "queue": false});
			
			t.addClass(it.o.prefix + "-active");
			
		});
		
		// PRIVATE DATA
		
		//it.p.ctnOffset = it.c.ctn.offset().top;
		
		//it.c.sections.hide();		
		
		// INITIATE FIRST IF EXISTS
		//it.p.selectedSection = it.c.sections.first();	
		var _firstTab = it.c.optionLinks.find(it.o.prefix + "-active");
		if (!(_firstTab.length > 0)) {
			_firstTab = it.c.optionLinks.first();
		}
		_firstTab.trigger('click');
		
		return it;
	};
	
	// LISTPANEL COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.listPanel = function(i) {
		
		i.c.ctn = $("<div class=\"" + i.o.name + "\">");
						
		i.c.self.wrap(i.c.ctn);
		
		i.c.ctn = i.c.self.parent();
		
		i.p.counter = 0;
		
		i.c.self.find("li").each(function() {
			
			var t = jQuery(this);
			
			i.p.counter++;
			if (i.p.counter % 2 == 0) t.addClass(i.o.prefix + "-alt");
			t.append("<span class=\"clear\"></span>");
			
		});
		
		return i;
	};
	
	// LISTALT COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.listAlt = function(i) {
		
		i.p.counter = 0;
		i.c.self.find("li").each(function() {
			
			var t = jQuery(this);
			
			i.p.counter++;
			if (i.p.counter % 2 == 0) t.addClass(i.o.prefix + "-alt");
			t.append("<span class=\"clear\"></span>");
			
		});
		
		return i;
	};
	
	// LISTDOUBLE BORDER COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.listDoubleBorder = function(i) {
		
		i.c.self.find("li").each(function() {
			jQuery(this).wrapInner("<span class=\"" + i.o.prefix + "-secondborder\">");
		});
		
		return i;
	};
	
	
	
	// PANEL COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.panel = function(i) {
		
		i.c.bg = $("<div class=\"" + i.o.prefix + "-bg\">");
		i.c.self.wrapInner(i.c.bg);
		i.c.contents = $("<div class=\"" + i.o.prefix + "-contents\">");
		i.c.bg = i.c.self.find("div." + i.o.prefix + "-bg");
		i.c.bg.wrapInner(i.c.contents);
		i.c.self.prepend("<div class=\"" + i.o.prefix + "-left\">");
		i.c.self.append("<div class=\"" + i.o.prefix + "-right\">");
		
		return i;
	};
	
	
	
	// PANELROUND COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.panelRound = function(i) {
		
		// i.c.self // CONTENTS
		i.c.self.addClass(i.o.name);
		
		i.c.center = i.rap("center", i.c.self);
		
		i.c.left = i.rap("l", i.c.center);
		
		i.c.right = i.rap("r", i.c.left);
		
		i.c.bg = i.rap("bg", i.c.right);
		
		i.c.contents = i.rap("contents", i.c.bg);
		
		i.c.self.prepend("<div class=\"" + i.o.prefix + "-top\"><div class=\"" + i.o.prefix + "-tl\"><div class=\"" + i.o.prefix + "-tr\"><div class=\"" + i.o.prefix + "-t\"></div></div></div></div>");
		i.c.self.append("<div class=\"" + i.o.prefix + "-bottom\"><div class=\"" + i.o.prefix + "-bl\"><div class=\"" + i.o.prefix + "-br\"><div class=\"" + i.o.prefix + "-b\"></div></div></div></div>");

		return i;
	}
	
	// COLORSWATCH COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.colorSwatch = function(i) {
		
		if (i.c.self.is("select")) {

			i.c.select = i.c.self;
			
			// CREATE CONTAINER
			i.c.ctn = $("<div class=\"" + i.o.name + "\">");
			i.c.select.wrap(i.c.ctn);
			i.c.ctn = i.c.select.parent();
			
		}
		// DIV
		else {
			i.c.ctn = i.c.self;
			i.c.select = i.c.self.find("select");
		}
		
		i.c.opts = i.c.select.find("option");
		
		// CREATE MOUSE OVERS
		var ft = i.c.opts.first().attr("title"); // FIRST TITLE
		//debug(i.c.opts.first().text());
		if (ft.length > 0) {
			ft = run(ft);
			
			i.c.fieldsCtn = i.create("titleFields");
			i.c.ctn.prepend(i.c.fieldsCtn);
			
			// CREATE TITLE FIELDS
			i.c.fields = [];
			jQuery.each(ft, function(k) {
				var th;
				i.c.fields.push(th = i.create("titleField"));
				i.c.fieldsCtn.append(th);
			});
		}
		i.c.label = i.c.ctn.find("." + i.o.prefix + "-label");
		
		// CREATE SWATCHES
		i.c.swatches = i.create("swatches");
		i.c.ctn.prepend(i.c.swatches);
		
		i.c.opts.each(function(){
			
			var t = jQuery(this);
			
			var a = jQuery("<a href=\"javascript: void(0)\" style=\"background-color: " + t.attr("value") + "\" title=\"" + t.attr("title") + "\"> </a>");
			a.append(i.create("innerborder", "span").text(t.text()));
			i.c.swatches.append(a);
			
			a.click(function() {
				var s = jQuery(this);
				s.siblings().removeClass("active");
				s.addClass("active");
				
				if (i.c.label.length) i.c.label.val(s.text());
			});
			
			a.hover(
				function() {
					var ft = jQuery(this).attr("title");
					ft = run(ft);
					var fc = 0; //FIELD COUNTER
					jQuery.each(ft, function(k) {
						i.c.fields[fc].text(k + ": " + ft[k]);
						//debug(ft[fc]);
						fc++;
					});
				},
				function() {
					jQuery.each(i.c.fields, function(k) {
						i.c.fields[k].html("&nbsp;");
					});
				}
			);
			
		});
		
		i.c.swatches.append("<div class=\"clear\"></div>");	
			
		return i;
	}
	
	// CHECKLIST COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.checklist = function(it) {
		
		it.o.editable = it.o.editable || true;
					
		it.c.opts = it.c.self.find("input[type=checkbox]");
		
		_counter = 0;
		
		it.c.opts.each(function(){
			
			var t = jQuery(this);
			
			var l = t.parent();
			
			var f = $("<div class=\"" + it.o.prefix + "-field\">"); //FIELD
			
			// IF IT HAS A LABEL
			if (l.is("label")) {
				
				// WRAP LABEL
				l.wrap(f);
				f = l.parent();
				
				// MOVE INPUTS IF THEY EXIST
				var i = l.find("input[type=text]");
				f.append(i);
				
			} else {
				t.wrap(f);
				f = t.parent();
			}
			
			_counter++;
			if (_counter % 2 == 0) f.addClass(it.o.prefix + "-alt");
				
			// CHANGE SPANS TO INPUTS IF THEY EXIST
			var s = l.find("span");
			if (it.o.editable) {
				s.each(function(){
					var th = jQuery(this);
					f.append("<input type=\"text\" class=\"" + it.o.prefix + "-textinput\" name=\"" + th.attr("title") + "\" value=\"" + th.html() + "\" />");
				});
			} else {
				f.append(s);
			}
			
			// ADD STYLING
			var action = $("<a class=\"" + it.o.prefix + "-checkbox\">&nbsp;</a>");
			action.click(function(){
				// TOGGLE CHECK
				if (t.attr("checked")) {
					action.removeClass("checkbox-checked");
					t.attr("checked", false);
				} else {
					action.addClass("checkbox-checked");
					t.attr("checked", "checked");
				}
			});
			f.prepend(action);
			
			f.append("<div class=\"clear\">");
			
		});
		
		return it;
	}
	
	// CUSTOMOPTIONS COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.customOptions = function(it) {
		
		it.o.editable = it.o.editable || true;
					
		var _updateFields = function() {
			it.c.fields = it.c.optionsCtn.find("div." + it.o.prefix + "-field");
			it.c.fields.removeClass(it.o.prefix + "-alt");
			it.c.fields.each(function(k){
				if (k % 2 == 1) jQuery(this).addClass(it.o.prefix + "-alt");
			});
		};
		
		var _addField = function(elementOrValue) {
			var t = elementOrValue; // ELEMENT
			
			// EACH FIELD HAS 4 PARTS
			// label(checkbox), textCtn, a.closeButton, clear
			
			var f = it.create("field");
			
			var val;
			
			// OBJECT
			if (typeof(t) != "string") {
			
				var l = t.parent();
				
				// IF IT HAS A LABEL
				if (l.is("label")) {
					
					// WRAP LABEL
					l.wrap(f);
					f = l.parent();
					
					// MOVE INPUTS IF THEY EXIST
					var i = l.find("input[type=text]");
					f.append(i);
					
				} else {
					t.wrap(f);
					f = t.parent();
				}
				
				_counter++;
				if (_counter % 2 == 0) f.addClass(it.o.prefix + "-alt");
				
				val = jQuery.trim(l.text());
			
			}
			// t is STRING (VALUE)
			else {
				val = elementOrValue; // VALUE
				
				it.c.optionsCtn.append(f);
				
				// LABEL / CHECKBOX
				var l = jQuery("<label>");
				f.append(l);
			
			}
			
			// CHECKBOX
			var checkbox = f.find("input[type=checkbox]");
			if (checkbox.length > 0) {
				checkbox.attr("checked", "checked");
				checkbox.attr("name", it.p.name);
			} else {
				debug("RAPTOR - CREATING CHECKBOX");
				checkbox = jQuery("<input type=\"checkbox\" name=\"" + it.p.name + "\" value=\"" + val + "\" checked=\"checked\" />");
				l.append(checkbox);
				debug(checkbox);
			}
			
			debug(val);
			
			// TEXTBOX
			// textbox = $("<input type=\"text\" class=\"" + it.o.prefix + "-textbox\" name=\"" + it.p.name + "\" value=\"" + l.text() + "\" />");
			var textCtn = it.create("textCtn");
			f.append(textCtn);
			var textInput = jQuery("<input type=\"text\" class=\"" + it.o.prefix + "-textInput\" name=\"" + it.p.name + "\" value=\"" + val + "\" />");
			textCtn.append(textInput);
			var textbox;
			textCtn.append(textbox = it.create("textbox"));
			
			var _focus = function() {
				//textbox.hide();
				//textInput.show();
				textCtn.addClass(it.o.prefix + "-editing");
				textInput.focus();
				it.p.editing = true;
				//debug("focus");
			};
			var _blur = function() {
				textCtn.removeClass(it.o.prefix + "-editing");
				it.p.editing = false;
				var v = textInput.val();
				textbox.text(v);
				checkbox.val(v);
				//debug("blur");
			};
			
			if (it.o.editable) {
				// TEXTBOX ACTIONS	
				textCtn.click(function() {
					if (!it.p.editing) {
						_focus();
					}
				});
				textInput.blur(_blur);
				textInput.keyup(function(e){
					if (e.which == 13) { //ENTER
						_blur();
					}
					e.handled = true;
				});
			}
			
			_blur();			
			
			
			// XBOX
			var action = it.create("xbox", "a");
			action.click(function(){
				// TOGGLE CHECK
				f.slideUp(200, function() {
					f.remove();
					_updateFields();
				});
			});
			f.append(action);
			
			f.append("<div class=\"clear\">");
		}
	
	
		// START
	
		it.c.opts = it.c.self.find("input[type=checkbox]");
		
		it.c.ctn = it.c.self;
		
		it.c.optionsCtn = it.rap("optionsCtn", it.c.ctn);
		
		it.p.name = it.c.opts.first().attr("name");
		
		_counter = 0;
		
		it.c.opts.each(function(){
			
			_addField(jQuery(this));
			
		});
		
		
		
		// CREATE ADD FIELD
		var f = it.create("addField");
		it.c.ctn.append(f);
		
		var textInput = jQuery("<input type=\"text\" class=\"" + it.o.prefix + "-textInput\" name=\"" + it.p.name + "\" value=\"\" />");
		f.append(textInput);
		
		textInput.keyup(function(e){
			if (e.which == 13) { //ENTER
				_addEditable();
			}
			e.handled = true;
		});
		
		var _addEditable = function() {
			// textInput
			_addField(textInput.val());								
				
			//
			_updateFields();
			it.c.optionsCtn.scrollTop(1000); // SCROLL DOWN
			textInput.val(""); // CLEAR					
		};
		
		
		
		debug(it.c.opts);
		
		return it;
	}
	
	
	// TABS COMPONENT
	///////////////////////////////////////////
	
	$.fn.raptor.components.tabs = function(it) {
		
		// DEFAULTS
						
		it.o = $.extend(it.o, {
			transition: true,
			transitionSpeed: 300
		});
		
		// PRIVATES
		
		it.p.transitioning = false;
		it.p.selectedSection = 0;
		
		
		// START
		it.c.self.addClass(it.o.name);
		
		// FIND SECTIONS
		it.c.sections = it.c.self.find("." + it.o.prefix + "-section[title]");
		
		// IF SECTIONS CANT BE FOUND, USE CHILDREN
		if (!(it.c.sections.length > 0)) {
			it.c.sections = it.c.self.children();
			it.c.sections.addClass(it.o.prefix + "-section");
		} else {
			it.c.sections = it.c.sections.first().parent().children("." + it.o.prefix + "-section[title]");
		}
		//debug(it.c.sections);
		
		// WRAP SECTIONS IN CONTENT
		it.c.content = it.c.self.find("." + it.o.prefix + "-content");
		if (!(it.c.content.length > 0)) {
			it.c.content = jQuery("<div>").addClass(it.o.prefix + "-content");
			it.c.self.append(it.c.content);
			
			// MOVE SECTIONS
			it.c.content.append(it.c.sections);
		}
		
		// CREATE TAB NAV
		it.c.nav = it.c.self.find("." + it.o.prefix + "-nav");
		if (!(it.c.nav.length > 0)) {
			it.c.nav = jQuery("<div>").addClass(it.o.prefix + "-nav");
			it.c.self.prepend(it.c.nav);
		}
		
		// NAV BUTTONS
		it.c.navButtons = it.c.nav.find("a");
		
		if (!(it.c.navButtons.length > 0)) {
			// CREATE TABS
			it.c.sections.each(function() {
				it.c.nav.append("<a href='javascript: void(0);'><span class=\"" + it.o.prefix + "-left\"></span><span class=\"" + it.o.prefix + "-bg\"><span class=\"" + it.o.prefix + "-nav-content\">" + jQuery(this).attr("title") + "</span></span><span class=\"" + it.o.prefix + "-right\"></span></a>");
			});
			it.c.nav.append("<div class=\"clear\"></div>");
			
		}
		
		it.c.navButtons = it.c.nav.find("a"); // UPDATE AFTER ADDING ANCHORS
		
		it.c.navButtons.click(function() {
			//if (it.p.transitioning) return;
			var t = jQuery(this);
			it.c.nav.find("a").removeClass(it.o.prefix + "-active");
			t.addClass(it.o.prefix + "-active");
			
			// GET TITLE NAME
			var title = t.find("." + it.o.prefix + "-nav-content").text();
		
			// FIND SECTION
			var nextSection = it.c.sections.filter("[title='" + title + "']");
			//var nextSection = it.c.content.find("." + it.o.prefix + "-section[title=" + title + "]");
			//debug(nextSection);
			
			if (nextSection.length == 0) {
				debug("Section not found");
				//debug(nextSection);
			}
			
			if (!it.p.selectedSection) it.p.selectedSection = nextSection;
			else if (it.p.selectedSection.attr("title") == nextSection.attr("title")) return;
			
			
			if (it.o.transition) {
				it.p.transitioning = true;
				it.p.selectedSection.fadeOut(it.o.transitionSpeed/2, function() {
					it.p.selectedSection = nextSection;
					it.p.transitioning = false;
					nextSection.fadeIn(it.o.transitionSpeed);
				});
			} else {
				it.p.selectedSection = nextSection;
				it.p.selectedSection.hide();
				nextSection.show();
			}
		});
		
		it.c.sections.hide();		
		
		// INITIATE FIRST IF EXISTS
		//it.p.selectedSection = it.c.sections.first();	
		var _firstTab = it.c.navButtons.find("." + it.o.prefix + "-active");
		if (!(_firstTab.length > 0)) {
			_firstTab = it.c.navButtons.first();
		}
		_firstTab.trigger('click');
		
		return it;
	}
	
	
	
	// RAPTOR UI
	$.fn.raptor.raptorui = function() {
		$.fn.raptor.ui("raptorui");
	};
	
	$.fn.raptor.ui = function(uiName) {
		
		jQuery(document).ready(function(){
			
			jQuery.fn.raptor({
				ui: uiName,
				debug: true
			});

			// BUTTONS
			jQuery("." + uiName + "-button").raptor("button");
			
			// FORM ELEMENTS
			jQuery("input." + uiName + "-textbox").raptor("textbox");
			jQuery("input." + uiName + "-checkbox").raptor("checkbox");
			jQuery("input." + uiName + "-radio").raptor("radio");
			jQuery("select." + uiName + "-select").raptor("select");
			jQuery("." + uiName + "-comboSelect").raptor("comboSelect");
			jQuery("." + uiName + "-checklist").raptor("checklist");
			jQuery("select." + uiName + "-listSelect").raptor("listSelect");
			jQuery("." + uiName + "-customOptions").raptor("customOptions");
			
			// LISTS
			jQuery("ul." + uiName + "-listPanel").raptor("listPanel");
			jQuery("ul." + uiName + "-listAlt").raptor("listAlt");
			jQuery("ul." + uiName + "-list-doubleborder").raptor("listDoubleBorder");
			
			// PANELS
			jQuery("div." + uiName + "-panel").raptor("panel");
			jQuery("div." + uiName + "-panelInside").raptor("panelInside");
			jQuery("div." + uiName + "-panelRound").raptor("panelRound");
			
			// TABS
			jQuery("div." + uiName + "-tabs").raptor("tabs");
		
		});
	
	}
	
	
})(jQuery);