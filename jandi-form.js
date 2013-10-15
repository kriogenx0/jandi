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

EVENT OPTIONS:
success
error
submit or complete

HTML OPTIONS:
data-validation
data-errormessage
*/

var jandi_form = function(form, options) {

  var defaults = {
    debugging:          false,
    focusOnFirstError:  true,
    buildFromHtml:      true,
    stopPropagation:    true,
    stopOnFirstError:   false,
    updateOnBlur:       true,     // IF THE FIELD HAD AN ERROR, VALIDATE AND UPDATE IT ON BLUR
    updateOnKeyUp:      true,     // IF THE FIELD HAD AN ERROR, VALIDATE AND UPDATE IT ON BLUR
    ajax:               false,
    autoMessage:        false     // AUTOMAGICALLY CREATE ERROR MESSAGES BASED OFF NAME
  };
  
  var options = $.extend({}, defaults, options);
  
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
  var r = {
    form: null,
    fields: null,
    ajax: null,
    errors: null,
    submitted: false
  };
  
  var debug = function() {
    if (options.debugging)
      $.debug(arguments);
  };
  
  var createFieldObjectFromSelector = function(domElement) {
    var dom = form.find(domElement);
    var field = {
      dom: dom,
      parent: dom.parent(),
      name: dom.attr('name'),
      hidden: dom.attr('type') == 'hidden',
      error: false,
      hadError: false
    };
    
    field.type = field.parent.attr('data-type') || '';
    field.validation = field.parent.attr('data-validation') || false;
    field.errorMessage = field.parent.attr('data-errormessage');
    
    field.value = function(setValue) {
      // GETTER
      if (typeof setValue == 'undefined') {
        return field.dom.val();
      }
      // SETTER
      else {
        field.dom.val(setValue);
      }
    };
    
    field.validate = function() {
      if (typeof field.validation == 'undefined' || !field.validation)
        return true;
      else if (typeof field.validation == 'string' && field.validation) {
        var valid = true;
        var validations  = field.validation.split(' ');

        for (k in validations) {
          if (typeof $.validate[ validations[k] ] != 'undefined' && !(valid = $.validate(field.value(), validations[k]) ) ) {
            break;
          }
        }
        
        debug('jandi_form - FIELD: ', field, 'VALID: ', valid);
        
        return valid;
      }
    };

    field.showError = function(message) {
    
      if (field.error) return;

      message = message || field.errorMessage || false;
      
      if (!message && options.autoMessage)
        message = 'This field is required';
      
      if (message) {
    
        // CREATE OR FIND DOM
        if (typeof field.errorMessageDom == 'undefined') {
          field.errorMessageDom = field.parent.find('.field-errorMessage');
        }
        if (typeof field.errorMessageDom == 'undefined' || field.errorMessageDom.length == 0) {
          field.parent.append('<div class="field-errorMessage" />');
          field.errorMessageDom = field.parent.find('.field-errorMessage');
        }
  
        field.errorMessageDom.text(message).hide().slideDown();
      
      }
      
      field.hadError = true;
      field.error = true;
      
      field.parent.addClass('field-error');

    };
    
    field.hideError = function() {
      if (typeof field.errorMessageDom != 'undefined')
        field.errorMessageDom.slideUp();
      field.error = false;
      
      field.parent.removeClass('field-error');
    };
    
    field.update = function() {
      if (!field.validate) return;
      
      if (field.validate()) {
        field.hideError();
      }
      else {
        field.showError();
      }
    };
    
    // EVENTS
    if (options.updateOnBlur) {
      field.dom.blur(function() {
        if (field.hadError)
          field.update();
      });
    }
    
    if (options.updateOnKeyUp) {
      field.dom.keyup(function() {
        if (field.hadError)
          field.update();
      });
    }
  
    return field;
  };
  
  var initialize = function() {
  
    r.form = $(form).first();
    r.elements = r.form.find(':input');
    r.fields = []; // {}
    
    // LOAD FORM FIELDS
    var field;
    r.elements.each(function() {
      field = $(this);
      if (typeof field == 'undefined') return true; // continue
      
      fieldObject = createFieldObjectFromSelector(field);
      
      r.fields.push(fieldObject);
      //r.fields[field.name] = fieldObject;
    });
    
    r.form.submit(r.submit);

  };
  
  r.validate = function() {
    r.errors = 0;
    r.firstInvalidField = null;
    
    var field;
    $.each(r.fields, function(fieldKey) {

      field = r.fields[fieldKey];
      
      field.update();
      
      // ON ERROR
      if (field.error) {
        r.errors++;
        if (!r.firstInvalidField) {
          r.firstInvalidField = field;
          if (options.stopOnFirstError)
            return false; // break
        }
      } else {
        debug('no validation', field.name, field);
      }
      
    });
    
    return r.errors === 0;
  };
  
  r.submit = function(e) {
  
    if (r.submitted) return false;

    r.submitted = true;
  
    if (options.ajax && e.stopPropagation)
      e.stopPropagation();

    r.validate();
    
    debug('errors', r.errors);
     
    if (r.errors === 0) {
    
      if (typeof options.submit == 'function') {
        var result = options.submit(e);

        if (result) {
          if (typeof options.success == 'function')
            options.success(e);
        } else {
          if (typeof options.error == 'function')
            options.error(e);
        }

      } else if (options.ajax) {
        ajaxSubmit();
      } else {
        // r.success();
        //r.form.submit();
        if (typeof options.success == 'function')
          options.success(e);
      }
    }
    else {
      r.submitted = false;
      if (e.stopPropagation && options.stopPropagation)
        e.stopPropagation();
        
      if (r.firstInvalidField)
        r.firstInvalidField.dom.focus();
        
      if (typeof options.error == 'function')
          options.error(e);

    }
    
    return r.errors === 0;
  };

  
  var ajaxSubmit = function() {
  
    r.ajax.requestData = r.fieldValues;
    
    r.ajax.data = {
      url: o.url,
      data: r.fieldValues,
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

  //$.ready(initialize);
  initialize();
  
  return r;
};