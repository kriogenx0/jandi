/*
// jandi-forms
// Developed By
// Alex Vaos
//
// REQUIRES:
// jQuery, jandi
*/

/*
OPTIONS:
debugging

HTML OPTIONS:
data-validation
data-errormessage
*/

var jandi_forms = function(form, options) {

  var defaults = {
    debugging:          false,
    focusOnFirstError:  true,
    buildFromHtml:      true,
    stopPropagation:    true
  };

  var options = $.extend({}, d, options);

  var fieldTypes = {
    name: null,
    username: null,
    email: null,
    month: null,
    year: null,
    creditCardYear: null,
    cvv: null
  };

  // RETURNING OBJECT
  var r = {};

  var createFieldObjectFromSelector = function(fieldDomElement) {
    var field = {
      dom: fieldDomElement,
      parent: fieldDomElement.parent(),
      name: fieldDomElement.attr('name'),
      validation: fieldDomElement.attr('data-validation') || false,
      type: fieldDomElement.attr('data-type') || '',
      errorMessage: fieldDomElement.attr('data-errormessage')
    };

    field.value = function(setValue) {
      // GETTER
      if (typeof setValue == 'undefined') {
        this.dom.val();
      }
      // SETTER
      else {
        this.dom.val(setValue);
      }
    };

    field.validate = function() {
      if (typeof this.validation == 'undefined' || !this.validation)
        return true;
      else if (typeof this.validation == 'string' && this.validation) {
        var valid = true;
        var validations  = this.validation.split(' ');

        for (k in validations) {
          if ($.validate.methodExists( validations[k] ) && !(valid = $.validate(field.value(), validations[k]) ) ) {
            break;
          }
        }

        return valid;
      }
    };

    field.showError = function(message) {
      message = message || this.errorMessage;

      // CREATE OR FIND DOM
      if (typeof field.errorMessageDom == 'undefined') {
        field.errorMessageDom = field.parent.find('field-errorMessage');
      }
      if (typeof field.errorMessageDom == 'undefined' || field.errorMessageDom.length == 0) {
        field.parent.append('<div class="field-errorMessage" />');
        field.errorMessageDom = field.parent.find('field-errorMessage');
      }

      field.errorMessageDom.text(message).hide().slideDown();
    };

    field.hideError = function() {
      if (typeof field.errorMessageDom != 'undefined')
        field.errorMessageDom.slideUp();
    };

    return field;
  };

  var initialize = function() {

    r.form = $(form);
    r.elements = r.form.elements;
    r.fields = {};

    var field;
    for (k in r.elements) {
      if (typeof r.fields[k] == 'undefined')
        continue;

      // REMOVE ELEMENTS WITH TYPE HIDDEN
      if (r.elements[k].attr('type') == 'hidden') {
        continue;
      }

      field = createFieldObjectFromSelector(r.elements[k]);

      r.fields[field.name] = field;
    }

  };

  var submit = function(e) {

    r.errors = 0;
    r.firstInvalidField = null;

    var field;

    $.each(r.fields, function(fieldKey) {

      field = r.fields[fieldKey];

      // ON ERROR
      if (!field.validate()) {
        r.errors++;
        field.showError();
        if (!r.firstInvalidField)
          r.firstInvalidField = r.fields;
        //return false; // break
      }


      if (r.firstInvalidField)
        r.firstInvalidField.dom.focus();

    });

    if (r.errors) {
  
      if (e.stopPropagation && options.stopPropagation))
        e.stopPropagation();

    }
    
    if (options.ajax) {
      ajaxSubmit();
    } else {
      // r.success();
      r.dom.form.submit();
    }      
      
    return r.errors === 0;
    
  };

  
  var ajaxSubmit = function() {
  
    r.ajax.requestData = r.fieldValues;
    
    r.ajax.data = {                
      url: o.url,
      data: m.fieldValues,
      dataType: 'json',
      type: 'POST',
      complete: function(d, s) {
        if (s != 'error') {
          debug( ['success', d, s] );
          r.ajax.successData = d;
          r.success(d);
        }
        else {
          debug( ['error!', d, s] );
          r.error();
        }
      }
    };
    
    r.ajax.request = $.ajax(m.ajax.data);

  };


  $(initialize);
  
  return r;
};

(function($) {

  // CLASS DEFINITION
  var formValidator = function (options) {
    var r = {
      forms: []
    };
    r.items = $(this);
    
    // DEFAULTS
    var d = {
      fieldsJson:        null,  // TO LOAD FIELDS FROM JSON OBJECT
      ajax:          false,  // WHETHER OR NOT TO USE AJAX
      debug:          false,
      captchaExists:      false,
      unobtrusive:      true,  // WHETHER OR NOT TO PARSE EXISTING FIELDS
      url:          null,  // null WILL DETECT
      submitOnEnter:      true,  // Whether or not hitting enter submits form
      focusFirstError:    true,
      submitButtonSearch:    ".formulator-submit, .submit, .form-submit, input[type='submit']",
      buildFromHtml:      true,
      messages:        null,
      success:        null,
      error:          null
      // organize:      true  // Whether or not organizing HTML to standards
    };

    var o = $.extend({}, d, options);
    
    // STATICS
    var parseField = function(fieldClasses, o) {
      /*
      o = o || {};
      var a = fieldClasses;
      if ($.type(a) != "array") a = a.split(" ");
      var attrs = ['validation', 'type', 'required'];
      // EACH CLASS
      for (x in a) {
        // EACH POSSIBLE ATTR
        for (y in attrs) {
          if (a[x].indexOf('field-' + attrs[y]) > -1) {
            var v = a[x].replace('field-' + attrs[y], "");
            if (v.substring(0, 1) == "-")
              o[ attrs[y] ] = $.addTo(o[ attrs[y] ],  v.substring(1));
            else
              o[ attrs[y] ] = $.addTo(o[ attrs[y] ],  true);
          }
        }
      }
      return o;
      */
      return $.classToObject(fieldClasses, "field", o);
    };
    
    var debug = function(text, type) {
      if (o.debug) return $.debug(text, type);
    };
    
    var loadFieldsJson = function(fieldsJson, form) {
      if (typeof(fieldsJson) == 'string') fieldsJson = $.parseJSON(fieldsJson);
      var fields = [];
      $.each(fieldsJson, function(k) {
        // BUILD FIELD OBJECT
        fields[k] = buildField(fieldsJson[k], form);
      });
      
      $.debug('fields:');
      $.debug(fields);
      return fields;
    };
    
    var buildField = function(fieldData, form) {
      var o = {
        field: null,
        input: fieldData.input || fieldData.element || (fieldData.name && form ? form.find("[name='" + fieldData.name + "']") : {}),
        label: fieldData.label,
        type: fieldData.type,
        name: fieldData.name,
        required: fieldData.required || false,
        validation: fieldData.validation || fieldData.validate,
        // validation: fieldData.validation ? fieldData.validation : ($.validate[ fieldData.type ] ? $.validate[ fieldData.type ] : null),validation: fieldData.validation ? fieldData.validation : ($.validate[ fieldData.type ] ? $.validate[ fieldData.type ] : null),
        format: fieldData.format ? fieldData.format : ($.format[ fieldData.type ] ? $.format[ fieldData.type ] : null)
      };
      
      // INPUT
      if (typeof(o.input) == 'string') {
        if (typeof(o.field) == 'object')
          o.input = o.field.find(o.input);
        else
          o.input = form.find(o.input);
      }
      
      // FIND FIELD
      var parent = o.input;
      for (var i = 6; i > 0; i--) {
        parent = parent.parent();
        if (parent.hasClass('form-field') && parent != form)
          break;
      }
      if (parent != form)
        o.field = parent;
      
      // VAL
      if (!o.val) {
        o.val = function(v) {
          if (typeof(v) == 'undefined')
            return o.input.val();
          else
            o.input.val(v);
        };
      }
      
      // $.debug([o.val(), o.input.val()]);
      
      return o;
    };
    
    // INTERFACE
    var validate = function(val, type) {
      // IGNORE OPTIONS
      if (type == "options") return true;
      return $.validate(val, type);
    };
    
    if (!r.items.length) {
      debug(["FORM NOT FOUND", r.items]);
      return;
    }
    
    r.items.each(function() {
    
      // INSTANCE PRIVATES
      var m = {
        // CONTROLS
        form: null,
        fields: null,
        formElements: null,
        
        // VARS
        intrans: false,     // IF IN TRANSITION
        selectedSection: 0,   // SECTION BY ID
        ctnOffset: 0,      // CONTAINER OFFSET
        fieldValues: [],
        ajax: null,
        errors: null
      };
      m.box = $(this);
      
      m.loadForm = function(el) {
        if (typeof(el) == "undefined") return;
        el = $(el) || m.box;
        return m.form = el.is("form") ? el : el.find("form").form;
      };
      
      m.submit = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        debug(["formulator - submit", m.fieldValues]);
        
        m.disableFields();
        m.loader.on();
        
        m.getFieldValues();        
        
        // VALIDATE SUCCESSFUL
        if (m.validate() && m.errors === 0) {
          if (o.ajax) {
          
            m.ajax.requestData = m.fieldValues;
            
            m.ajax.data = {                
              url: o.url,
              data: m.fieldValues,
              dataType: 'json',
              type: 'POST',
              complete: function(d, s) {
                if (s != 'error') {
                  debug( ['success', d, s] );
                  m.ajax.successData = d;
                  m.success(d);
                }
                else {
                  debug( ['error!', d, s] );
                  m.error();
                }
              }
            };
            
            m.ajax.request = $.ajax(m.ajax.data);
            
            debug(["FORMULATOR - SENDING AJAX REQUEST", m.ajax]);
          }
          // NON AJAX
          else {

            m.form.submit();
            m.success();
          }
        }
        // ERRORS
        else {
          m.error();
        }
      };
      
      m.success = function(data) {
        debug(["formulator - success", m.fieldValues]);
        
        m.loader.off();
        
        //if (o.ajax) m.form.slideOut(500);
        //m.messages.show("Thank You for contacting us.");
        
        if ($.type(o.success) == 'function') o.success(data, m);
      };
      
      m.error = function() {
        debug(["formulator - error!", m.fieldValues]);
        m.loader.off();
        m.enableFields();
        // alert("ERRORS: " + err);
        // messages.show(firstError.error);
        m.messages.show("An error has occurred");
        if (o.focusFirstError && m.firstInvalidField && m.firstInvalidField.input)
          m.firstInvalidField.input.focus().scrollWindow();
      
        if ($.type(o.error) == 'function') o.error(m);
      };
      
      // VALIDATE FIELDS AND GET VALUES
      m.validate = function() {
        m.errors = 0;
        m.firstInvalidField = null;
      
        var valueMethod, validateMethod;
        $.each(m.fields, function(fk) {
          var fo = m.fields[fk];
          valueMethod = false;
          validateMethod = false;
          
          // GET VALUE
          if (typeof(fo.val) == "function") {
            fo.value = fo.val();
            valueMethod = '.val';
          }
          else {
            // CHECKBOX, RADIO
            if (fo.type == "checkbox" || fo.type == "radio") {
              var val = "";
              fo.inputs.each(function(){
                var t = $(this);
                if (t.attr("checked") == "checked" || t.attr("checked") == true) {
                  if (val != "") val += "|";
                  val += t.val();
                }
              });
              fo.value = val;
            }
            // TEXTAREA, TEXT INPUT
            else {
              fo.value = fo.input.val();
              valueMethod = '.input.val';
            }
          }
          
          // VALIDATE REQUIRED
          if (fo.required && (typeof(fo.value) == 'undefined' || fo.value.length == 0)) {
            validateMethod = 'required';
          }
          // VALIDATE
          else if (fo.validate) {
            if ($.type(fo.validate) == "function") {
              if (!fo.validate(fo.value)) {
                validateMethod = '.validate as function';
              }
            }
            else if ($.validate[ fo.validate ]) {
              if (!$.validate(fo.value, fo.validate) ) {
                validateMethod = '.validate as $.validate';
              }
            }
          }
          // VALIDATION
          else if (fo.validation) {
            if ($.type(fo.validation) == "function") {
              if (!fo.validation(fo.value)) {
                validateMethod = '.validation as function';
              }
            }
            else if ($.validate[ fo.validation ]) {
              if (!$.validate(fo.value, fo.validation) ) {
                validateMethod = '.validation as $.validate';
              }
            }
            // ADD:
            // TEST FOR ARRAY
          }
          // REQUIRED
          else if (fo.required) {
            if (! validate(fo.value, "required")) {
              validateMethod = '.required';
            }
          }
          
          if (validateMethod)
            m.errors++;
          
          // SHOW FIELD ERROR
          if (fo.field) {
            if (fo.validate || fo.validation || fo.required) {
              fo.field.removeClass("field-success field-error");
              fo.field.addClass("field-" + (m.errors ? "error" : "success") );
            }
            
            // SHOW MESSAGE IF EXISTS
            if (fo.messageCtn) {
              if (fo.error)
                fo.messageCtn.text($.type(fo.error) == "string" ? fo.error : fo.errorMessage).slideDown();
              else
                fo.messageCtn.slideUp();
            }
          }
          
          if (m.errors && !m.firstInvalidField) {
            //debug(["FORMULATOR - ERRORS: ", m.errors, fo]);
            debug(["FORMULATOR - ERROR VALIDATING FIELD: ", fo, "VALUE: ", fo.value, 'value method:', valueMethod, 'validate', validateMethod]);
            m.firstInvalidField = fo;
            return false;
          }
          
          // ADD
          var k = fo.name || fk;
          debug([k, fo.value]);
          m.fieldValues[k] = fo.value;

        });
        
        return m.errors === 0;
      };
      
      // MESSAGES COMPONENT
      m.messages = function() {
        var a = {};
        
        a.show = function(txt) {
          if (a.ctn.length == 0)
            a.ctn.css("display", "none");
          a.ctn.text(txt);
          a.ctn.slideDown();
          a.set();  
        };
        a.set = function() {
          a.clear();
          a.interval = setInterval(function(){a.ctn.slideUp(500);}, 5000);
        };
        a.clear = function() {
          clearInterval(a.interval);  
        };
        a.init = function() {
          // C
          a.ctn = m.form.find(".field-messages");
          if (!a.ctn.length) {
            a.ctn = m.messages = $("<div class='formulator-messages'>");
            m.form.prepend(m.messages);
            m.messages = m.form.find("div.field-messages");
          }
        };
      
        return a;
      } ();
      
      m.captcha = function() {
        var a = {};
        
        a.refresh = function() {
  
          if (typeof(a.image) == "string")
            a.image = document.images[a.image];
          
          if (typeof(a.image) == "undefined" || a.image == null) {
            return;
          } else {
            a.exists = true;
          }
          var now = new Date();
          a.image.src = a.image.src.split('?')[0] + '?x=' + now.toUTCString();
          
        };
        
        a.init = function() {
          a.refreshBtn = m.form.find(".formulator-refresh, .form-refresh, .field-type-captcha .captcha-refresh");
          a.refreshBtn.click(a.refresh);
        };

        return a;
      }();
      
      
      // CONFIGURING FIELD OBJECT
      
      var findInput = function(field) {
        var f = field || this;
        var ctn = f.field || f;
        
        // SELECT
        if (f.type == "select") {
          f.input = ctn.find("select").first();
        }
        // TEXT AREA
        else if (f.type == "textarea") {
          f.input = ctn.find("textarea").first();
        }
        // CHECKBOXES
        else if (field.type == "checkbox") {
          f.input = ctn.find("input[type='checkbox']");      
        }
        // RADIOS
        else if (f.type == "radio") {
          f.input = ctn.find("input[type='radio']");      
        }
        // TEXT INPUT
        else {
          f.input = ctn.find("input").first();
        }
        return f.input;
      };
      
      var configureField = function(fo) {
      
        /*
        // GET ELEMENTS
        if (!$.type(fo.element) == "object") {
          if (typeof(fo.element) != "undefined") {
            fo.element = $(fo.element);
          } else if (typeof(fo.name) != "undefined") {
            fo.element = m.form.find("[name='" + fo.name + "']");
          }
        }
        */
        
        // INPUT PROPERTY
        fo.input = findInput(fo);
        
        
        /*
        if (!fo.validate && fo.validation) {
          //debug(["FORMULATOR - VALIDATE NOT FOUND: ", fo]);
          fo.validate = function() {
            //debug(["FORMULATOR - VALIDATING: ", fo]);
          
            fo.error = 0;
            
            var v = ($.type(fo.validation == "array") ? fo.validation : [fo.validation] );
            for (x in fo.validation) {
              if ($.type(fo.validation[x]) == "function") {
                fo.validation[x]( fo.input ) ? true : fo.error++;
              }
              else {
                validate( fo.input.val(), fo.validation[x] ) ? true : fo.error++;
              }
            }
          
            fo.field.removeClass("field-error field-success");
            fo.field.addClass( "field-" + (fo.error ? "error" : "success") );
            
            if (fo.error) {
              fo.messageCtn.text(fo.errorMessage).slideDown();
            }
            else {
              fo.messageCtn.slideUp();
            }
            return fo.error === 0;
          };
        }
        */
        
        if (fo.type == "text") {
        
          // FORMAT
          if (fo.format && $.type(fo.format) != "function") {
            fo.formatType = fo.format;
            fo.format = function() {
              var t = $(this);
              t.input.val( $.format( t.input.val(), formatType ) );
            };
          }

          fo.input.keyup(fo.format);
          fo.input.blur(fo.format);
        }
        
        /*
        // ASSIGN ENTER KEY
        if (fo.type != "textarea") {
          if (o.submitOnEnter) 
            fo.input.enterKey(m.form.submit);
          // REMOVE HTML EVENT
          else
            fo.input.enterKey();
        }
        */
        
        return fo;
      };
      
      var buildFromJsonString = function() {
        // BUILD FIELDS FROM JSON
        m.fields.each(function(k) {
          var t = $(this);
          
          // BUILD FIELD OBJECT
          m.fields[k] = {};
          m.fields[k] = $.run("{" + jQuery(this).attr("title").replace(/'/g, "\"") + "}");
          
          m.fields[k].element = $(this);
          
          // VALIDATE USER INPUT
          if (typeof(m.fields[k].type) == "undefined") m.fields[k].type = "text";
          else m.fields[k].type = m.fields[k].type.toLowerCase();
          
          m.fields[k].element = $(this);
          
          // ADD METHODS
          m.fields[k].inputs = {};
          m.fields[k].value = "";
          m.fields[k].validate = _validateField;
          m.fields[k].getInputs = _getInputs;
          
          // GET INPUTS
          m.fields[k].getInputs();
          
          // VALIDATE NAME
          if (typeof(m.fields[k].name) == "undefined") {
            m.fields[k].name = m.fields[k].inputs.first().attr("name");
          }
          
          // debug(m.fields[k]);
          
        });
      };
      
      var buildFromHtml = function() {
        if (!m.fields) m.fields = [];
        var f = m.form.find("div.form-field");
        f.each(function() {
          var t = $(this);
          // FIELD OBJECT
          var fo = {
            field: t,
            input: t.find(":input"),
            label: t.find(".field-label"),
            messageCtn: t.find(".field-message"),
            error: 0
          };
          
          fo = parseField(fo.field.attr("class"), fo);
          
          fo = configureField(fo);
          
          debug(['built form field', fo]);  
        
          m.fields.push(fo);
        });
      };
      
      m.getFieldValues = function() {
        m.fieldValues = {};
        $.each(m.fields, function(f) {
          if (f.name && f.input)
            m.fieldValues[ f.name ] = f.input.val();
        });
        debug( ['formulator - collected data', m.fieldValues] );
      };
      
      m.disableFields = function() {
        debug( 'formulator - disabling fields' );
        
        var fo;
        $.each(m.fields, function( f ) {
          fo = $(f);
          if (f && fo.enable)
            fo.enable();
        });
        $.each(m.formElements, function( f ) {
          fo = $(f);
          if (f && fo.enable)
            fo.enable();
        });
      };
      
      m.enableFields = function() {
        var fo;
        $.each(m.fields, function( f ) {
          fo = $(f);
          if (f && fo.disable)
            fo.disable();
        });
        $.each(m.formElements, function( f ) {
          fo = $(f);
          if (f && fo.disable)
            fo.disable();
        });
      };
      
      m.clearFields = function() {
        if (m.form && m.form[0].reset)
          m.form[0].reset();
        /*
        var b;
        $.each(m.fields, function( f ) {
          if (!f) return 1;
          b = $(f);
          if (b.isText())
            b.val('');
            
          if (f && b.enable)
            fo.enable();
        });
        $.each(m.formElements, function( f ) {
          b = $(f);
          if (f && b.enable)
            b.enable();
        });
        */
      };
      
      /*INIT*/
      m.init = function() {
        m.ajax = {};
        
        // SELF
        // m.box = $(m.box);
        m.box.addClass("formulator formulator-init");
        
        $.debug( ['formulator - using form', m.box] );
        
        // INIT FORM
        m.loadForm(m.box);
                
        // LOAD FORM URL
        if (o.ajax && !o.url) o.url = o.url || (m.form.attr("action") + "/ajax");
        
        // MODULES    
        m.messages.init();
        if (o.captchaExists) m.captcha.init();
        
        m.submitButtons = m.box.find(o.submitButtonSearch);
        
        // FIELDS
        if (o.fields) {
          m.fields = o.fields;  
        }
        // FIND FROM JSON
        else if (o.fieldsJson)
          m.fields = loadFieldsJson(o.fieldsJson, m.box);
        // FIND FIELDS
        else {
          buildFromHtml();
        }
        
        // $.debug( ['formulator - loaded fields', m.fields]);
        
        m.formElements = m.form.find(':input');
        
        // EVENTS
        
        m.submitButtons.click(m.submit);
        m.form.submit(m.submit);
        
        // OTHER MODULES
        m.loader = m.form.disableLoader();

      }; // INIT
      
      $(m.init);
      
      r.forms.push(m);
    });
    
    if (r.forms.length === 1) return r.forms[0];
    return r.forms;
  };
  
})(jQuery);
