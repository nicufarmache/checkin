var checkin_read = null;

function fillInputField(result){
  var input = document.getElementById("barcode");
  input.value = '';
  input.value = code;
  checkin_read(code);
}

function showScanner() {
  Android.openScanner();
}

async function stopJSScanner() {
  if (window.qrDecoder) {
    console.log('QRC CODE RUNNING, STOPPING')
    await window.qrDecoder.stop();
    console.log('html5QrCode.stop() STOPPED')
    window.qrDecoder = null;
    $('#reader').slideUp(100);
  }
}

function showJSScanner() {
  console.log(`SHOW JS SCANNER`);
  
  if (window.qrDecoder) {
    stopJSScanner()
  } else {
    $('#reader').slideDown(100);
    Html5Qrcode.getCameras().then(devices => {
      // ask for permisiion
      if (devices && devices.length) {
        const html5QrCode = new Html5Qrcode(/* element id */ "reader");
        window.qrDecoder = html5QrCode;
        const config = { fps: 10 };
        // If you want to prefer back camera
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess);
      }
    }).catch(err => {
      console.log('QR scanner error:', err)
    });
  }
}

function onScanSuccess(decodedText, decodedResult) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult);
  if(!window.qrDebounce){
    codeRead(decodedText);
    window.qrDebounce = true
  } 
  stopJSScanner();
  window.qrDebounce = false
}

function codeRead(code) {
  var input = document.getElementById("barcode");
  input.value = '';
  input.value = code;
  checkin_read(code);
}

function ch_ga_login(){

}

function ch_ga_checkin(type){

}

function ch_send_analytics(event_name, event_category, event_label){

}

$( document ).ready(function() {

  function codeRead_jquery(code) {
    $('#barcode').val(code);

    e = jQuery.Event("keyup");
    e.which = 13 //enter key
    $('#barcode').trigger(e);
  }

  $('.camera').on('click', function(e) {
    try{
      window.webkit.messageHandlers.barcodeReader.postMessage({showCamera: true});
    }catch(err){}
    try{
      showScanner();
    }catch(err){}
    try{
      showJSScanner();
    }catch(err){}
  });

  $('input').on('focus', function(e) {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(
      function() {
      }, 100);
    });

    if (typeof (Storage) !== "undefined") {
      // console.log('Storage works!');
    } else {
      // console.log('Local storage NOT supported :/');
    }

    function maybe_convert_non_http_url_to_https(url){
      if(url.includes('https://')){
        return url;
      }else{
        return 'https://checkinera.com/cross/?destination=' + url;
      }
    }

    function tc_storage_set(key, value) {
      if (typeof (Storage) !== "undefined") {
        localStorage.setItem(key, value);
      }
    }

    function tc_storage_get(key) {
      if (typeof (Storage) !== "undefined") {
        var result = localStorage.getItem(key);
        return result;
      } else {
        return false;
      }
    }

    $.ajaxSetup({cache: false});
    window.offline_mode = 0;
    window.online = 1;
    window.use_badges = 0;
    window.total_listed_tickets = 0;
    window.tickets_count = 0;
    window.tickets_pages = 1;
    window.tickets_per_page = checkinera_ajax.tickets_per_page;
    window.list_loaded = false;
    window.counts_animated = false;
    window.site_url = '';
    window.api_key = '';
    window.screens = new Array('login', 'stats', 'list', 'single-list', 'scanner', 'scan');
    window.attendees_data = new Array();
    window.translation = {};
    window.current_scan_response = {};
    window.get_event_essentials_started = false;
    window.current_screen = 'login';
    window.successful_checking_command = '';
    window.failed_checking_command = '';
    window.show_at_once = 0;
    window.show_attendee_screen = 0;

    // Open initial screen
    show_screen('login', 0);

    // Try to auto login if needed
    setTimeout(maybe_auto_login, 500);

    // Trigger functions
    var key_press_listener = new window.keypress.Listener();

    key_press_listener.register_many([
      {
        "keys": "backspace",
        "is_exclusive": false,
        "on_keydown": function() {
          if (current_screen == 'single-list') {
            show_screen('list', 0);
          }
        },
      },
      {
        "keys": "enter",
        "is_exclusive": true,
        "on_keydown": function() {
          if (current_screen == 'single-list') {
            $('button.tc-checkin-button').click();
          }
        },
      },
      {
        "keys": "home",
        "is_exclusive": false,
        "on_keydown": function() {
          $('a.tc-menu-home').click();
        },
      },
      {
        "keys": "alt h",
        "is_exclusive": false,
        "on_keydown": function() {
          $('a.tc-menu-home').click();
        },
      },
      {
        "keys": "alt l",
        "is_exclusive": false,
        "on_keydown": function() {
          $('a.tc-menu-list').click();
        },
      },
      {
        "keys": "alt c",
        "is_exclusive": false,
        "on_keydown": function() {
          $('a.tc-menu-start-scan').click();
        },
      },
      {
        "keys": "alt s",
        "is_exclusive": false,
        "on_keydown": function() {
          $('a.tc-menu-singout').click();
        },
      },
    ]);

    $('input[type=text], input[type=password]')
    .bind("focus", function() {
      key_press_listener.stop_listening();
    })
    .bind("blur", function() {
      key_press_listener.listen();
    });

    $(window).on('load', function() {

      var condition = navigator.onLine ? "online" : "offline";
      if (condition == 'online') {
        online = 1;
        $('.online').show();
        $('.offline').hide();
      } else {
        online = 0;
        $('.online').hide();
        $('.offline').show();
      }

      var translation = tc_storage_get('translation');
      if (typeof translation !== 'undefined') {
        for (key in translation) {
          $('.' + key).html(translation[key]);
        }
        // Special translation for thde search placeholder
        $('.search_field').attr('placeholder', $('.SEARCH').html());
      }
    });

    window.addEventListener('load', function() {
      function updateOnlineStatus(event) {
        var condition = navigator.onLine ? "online" : "offline";
        if (condition == 'online') {
          online = 1;
          maybe_sync_checkins();
          $('.online').show();
          $('.offline').hide();
        } else {
          online = 0;
          $('.online').hide();
          $('.offline').show();
        }
      }
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    });

    // Extend jQuery with additional functions
    jQuery.fn.center = function(speed) {
      this.css("position", "absolute");
      this.css("z-index", "0");
      this.animate({
        top: Math.max(0, ((($(window).height() - this.outerHeight()) - 80) / 2) +
        $(window).scrollTop()) + "px",
        left: Math.max(0, ((($(window).width() - this.outerWidth()) + $('.tc-sidebar').width()) / 2) +
        $(window).scrollLeft()) + "px"
      }, speed, function() {
        // Animation complete.
      });
      return this;
    }

    jQuery.fn.toTop = function(speed) {
      this.css("position", "absolute");
      this.css("z-index", "0");
      this.animate({
        top: "100px",
        left: Math.max(0, ((($(window).width() - this.outerWidth()) + $('.tc-sidebar').width()) / 2) +
        $(window).scrollLeft()) + "px"
      }, speed, function() {
        // Animation complete.
      });
      return this;
    }

    /**
    * Check if var is object
    *
    * @param {type} val
    * @returns {Boolean}
    */
    function isObject(val) {
      if (val === null) {
        return false;
      }
      return ((typeof val === 'function') || (typeof val === 'object'));
    }

    $(document).on("click touchstart tap", ".checkinera_signout", function () {
      jQuery("#checkinera-singout").css('display','none');
      site_url.val('');
      api_key.val('');
      show_screen('login', 0);
      enable_login_fields();
      clear_login_data();
      list_loaded = false;
      get_event_essentials_started = false;
      $('.tc-tickets-list').empty();
      $('.slearch_field').val('');
    });

    $(document).on("click touchstart tap", ".checkinera_signout_cancel", function (){
      jQuery("#checkinera-singout").css('display','none');
    });

    $('.tc-menu-singout').on('click touchstart tap', function(event) {
      jQuery("#checkinera-singout").css('display','block');
    });


    $('.tc-menu-list').on('click', function(event) {
      show_screen('list', 0);
    });
    $('.tc-menu-home').on('click', function(event) {
      show_screen('stats', 0);
    });
    $('.tc-menu-start-scan').on('click', function(event) {
      show_screen('scan', 0);
    });

    $('body').on('keypress', '#barcode', function(event) {
      if (event.which == 13) {
        check_in_ticket_barcode($(this).val());
      }
    });

    $('body').on('click', '.tc-list-search button', function(event) {
      total_listed_tickets = 0;
      var entered_val = $(this).parent().find('.search_field').val();
      $('.search_field').val(entered_val);
      show_screen('list', 0);
      load_list(true, true);
      tc_show_preloader(true);
      $('.search_field').focus();
    });

    $('body').on('keypress', '.search_field', function(event) {
      total_listed_tickets = 0;
      var entered_val = $(this).val();
      $('.search_field').val(entered_val);
      if (event.which == 13) {
        show_screen('list', 0);
        load_list(true, true); // Force offline
        tc_show_preloader(true);
        $('.search_field').focus();
      }
    });

    $('body').on('click', 'a.tc-back-arrow', function(event) {
      event.preventDefault();
      show_screen('list', 0);
    });

    $('body').on('click', '.tc-checkin-button', function(event) {
      event.preventDefault();
      check_in_ticket($('.ticket_id_value').html());
    });

    $('body').on('click', 'a.tc-list-link', function(event) {
      event.preventDefault();
      var id = $(this).data('id');
      var page = $(this).data('page');
      var checksum = $(this).data('checksum');
      get_check_ins(checksum, true);
      var attendee_data = attendees_data[page + '_' + id].data;
      $('.tc-single-list .buyer_name_value').html(attendee_data.buyer_first + ' ' + attendee_data.buyer_last);
      $('.tc-single-list .ticket_id_value').html(attendee_data.checksum);
      $('.tc-single-list .purchased_date_value').html(attendee_data.payment_date);
      $('.tc-single-list .tc-buyer-address').html('');
      for (i = 0; i < attendee_data.custom_field_count; i++) {
        $('.tc-single-list .tc-buyer-address').append('<span class="tc-span-wrap">' + attendee_data.custom_fields[i][0] + ': <span class="tc_selectable">' + attendee_data.custom_fields[i][1] + '</span></span>  ');
      }

      show_screen('single-list', 0);
    });

    function maybe_redirect_to_single_screen(checksum){
      if(show_attendee_screen == 1 || show_attendee_screen == true){
        $('a.ID'+checksum).click();
      }
    }

    $('body').on('click', '.tc_selectable, .tc-ticket-info', function(event) {
      event.stopPropagation();
      event.preventDefault();
    });

    $('body').on('click', 'div.tc-tickets-one', function(event) {
      var data_holder = $(this).find('a.tc-list-link');
      var id = data_holder.data('id');
      var page = data_holder.data('page');
      var checksum = data_holder.data('checksum');
      get_check_ins(checksum, true);
      var attendee_data = attendees_data[page + '_' + id].data;
      $('.tc-single-list .buyer_name_value').html(attendee_data.buyer_first + ' ' + attendee_data.buyer_last);
      $('.tc-single-list .ticket_id_value').html(attendee_data.checksum);
      $('.tc-single-list .purchased_date_value').html(attendee_data.payment_date);
      $('.tc-single-list .tc-buyer-address').html('');
      for (i = 0; i < attendee_data.custom_field_count; i++) {
        $('.tc-single-list .tc-buyer-address').append('<span class="tc-span-wrap">' + attendee_data.custom_fields[i][0] + ': <span class="tc_selectable">' + attendee_data.custom_fields[i][1] + '</span></span>  ');
      }

      show_screen('single-list', 0);
    });

    $('#tc_login_form').on('submit', function(event) {
      event.preventDefault();
      show_notification(translate_string('PLEASE_WAIT', 'Please wait...'), 'info', 'login');
      site_url = $('#tc-website-url');

      var site_url_val = site_url.val();
      var lastChar = site_url_val.substr(-1); // Selects the last character
      if (lastChar !== '/') {         // If the last character is not a slash
        $('#tc-website-url').val($('#tc-website-url').val() + '/'); // Append a slash to it.
      }

      if (online == 0) {

        var tc_site_url = tc_storage_get('tc_site_url');
        var tc_api_key = tc_storage_get('tc_api_key');

        //do the check
        if ($('#tc-website-url').val() == tc_site_url && $('#tc-api-key').val() == tc_api_key) {//offline site and key match with the provided
          disable_login_fields();
          translate_app(true);
        } else {
          show_notification(translate_string('API_KEY_LOGIN_ERROR', 'Error. Please check the URL and API KEY provided'), 'error', 'login');
          enable_login_fields();
        }

      } else {

        api_key = $('#tc-api-key');
        auto_login = $('#auto-login');
        disable_login_fields();
        var timestamp = new Date().getTime() / 1000;
        var post_data = {};
        post_data.site_url = site_url.val();
        post_data.api_key = api_key.val();
        post_data.timestamp = timestamp;

        $.post(checkinera_ajax.ajaxUrl, {action: 'checkinera_check_credentials', data: post_data}, function(response){
          if(response.wrong_url_or_key !== undefined && response.wrong_url_or_key){
            show_notification(translate_string('API_KEY_LOGIN_ERROR', 'Error. Please check the URL and API KEY provided'), 'error', 'login');
            enable_login_fields();
          }
          if(response.error !== undefined && response.error){
            show_notification(response.error, 'error', 'login');
            enable_login_fields();
          }
          if (response.is_valid !== undefined && response.is_valid == true) {
            ch_ga_login();
            translate_app(true);
            save_login_data();
          }
          if (response.is_valid !== undefined && response.is_valid == false) {
            show_notification(translate_string('ERROR_LICENSE_KEY', 'License key is not valid. Please contact your administrator.'), 'error', 'login');
            enable_login_fields();
          }
        });
      }
    });

    /**
    * Show message how many check-ins are synced (send to a remote server) - for each check-in
    *
    * @param {type} items_num
    * @param {type} items_total
    * @returns void
    */
    function items_synced_progress_message(items_num, items_total) {
      var timestamp = new Date().getTime() / 1000;
      var checkin_record_synced_message = items_num + ' / ' + items_total + ' ' + translate_string('CHECK_IN_RECORDS_SYNCED', 'check-in records synced with the online database successfully.');

      if ( 1 == items_num ){
        var checkin_record_sync_started_message =translate_string('CHECK_IN_RECORDS_SYNC_STARTED', 'check-in records synchronization with the online database started...please wait...');
        // show_notification_popup(checkin_record_sync_started_message, 'success');
      }

      /* chrome.notifications.create(
      'tc_synced_progress_message_'+timestamp, {
      type: "basic", //progress
      title: "Info",
      message: items_num + ' / ' + items_total + ' ' + translate_string('CHECK_IN_RECORDS_SYNCED', 'check-in records synced with the online database successfully.'),
      iconUrl: "assets/images/success.png",
    }, function () {} ); */
  }

  /**
  * Show message that all check-ins are synced
  *
  * @param {type} items_num
  * @param {type} items_total
  * @returns void
  */
  function items_synced_message(items_num) {
    var timestamp = new Date().getTime() / 1000;
    var checkin_record_synced_message = items_num + ' ' + translate_string('CHECK_IN_RECORDS_SYNCED', 'check-in records synced with the online database successfully.')
    show_notification_popup(checkin_record_synced_message, 'success', 5000);
  }

  /**
  * Show message that all attendee data has been downloaded from the server to the app
  *
  * @param {type} progress_percentage
  * @returns void
  */
  function download_progress_message() {
    var timestamp = new Date().getTime() / 1000;
    var attendees_downloaded_message = translate_string('ATTENDEES_DOWNLOADED', 'Attendees and tickets data has been downloaded successfully.');
    show_notification_popup(attendees_downloaded_message, 'success', 5000);//success, info, warn, error
  }

  /**
  * Show preloader gif
  *
  * @param {type} show
  * @returns void
  */
  function tc_show_preloader(show) {
    if (show == true) {
      $('.tc-tickets-list').append('<span class="preloader"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></span>');
      $('.tc-tickets-list').css('background-color', '#ffffff');
      $('.preloader').show();
    } else {
      $('.preloader').hide();
      $('.tc-tickets-list').css('background-color', 'none');
    }
  }

  /**
  * Enable login fields (site url, api key and the login button)
  */
  function enable_login_fields() {
    var login_button = $('.tc-login-button');
    site_url = $('#tc-website-url');
    api_key = $('#tc-api-key');
    site_url.prop("disabled", false);
    api_key.prop("disabled", false);
    login_button.prop("disabled", false);
    login_button.show();
  }

  /**
  * Disable login fields (site url, api key and the login button)
  */
  function disable_login_fields() {
    site_url = $('#tc-website-url');
    api_key = $('#tc-api-key');
    var login_button = $('.tc-login-button');
    site_url.prop("disabled", true);
    api_key.prop("disabled", true);
    login_button.prop("disabled", true);
    login_button.hide();
  }

  function show_notification_popup(message, type, duration){
    $.notify(message, { // whether to hide the notification on click
      clickToHide: true,
      // whether to auto-hide the notification
      autoHide: true,
      // if autoHide, hide after milliseconds
      autoHideDelay: duration,
      // show the arrow pointing at the element
      arrowShow: false,
      // arrow size in pixels
      arrowSize: 5,
      position: 'top right',
      //style: 'bootstrap',
      className: type,
      showAnimation: 'slideDown',
      showDuration: 300,
      hideAnimation: 'slideUp',
      hideDuration: 300,
      gap: 20
    }
  );
}

/**
* Show notification message
*
* @param string message Message to show
* @param string type Type of the message. Possible values: info, success, warning, error
* @param string section Possible values: login, stats, ...
* @returns void
*/
function show_notification(message, type, section) {
  var notification = $('.tc-' + section + ' .tc-notification');
  notification.hide();
  notification.removeClass('error-message info-message success-message warning-message');
  notification.addClass(type + '-message');
  if(section == 'scan' && type == 'error') {
    message = '<span class="tc-close tc-rounded tc-heavy"></span>';
  } else if (section == 'scan' && type == 'success'){
    message = '<div class="tc-checkmark"></div>';
  };
  notification.html(message);

  notification.slideDown(100);
}

function isEmpty(val){
  return (val === undefined || val == null || val.length <= 0) ? true : false;
}

/**
* Show notification message in a button
*
* @param string message Message to show
* @param string type Type of the message. Possible values: info, success, warning, error
* @param string section Possible values: login, stats, ...
* @returns void
*/
function button_notification(message, type, section, button_text) {


  jQuery(".tc-checkin-button").addClass(type);
  jQuery(".tc-checkin-button span").text(message);

  if(!isEmpty(button_text)){
    setTimeout(function() {
      jQuery(".tc-checkin-button").removeClass("error success info");
      jQuery(".tc-checkin-button span").html(button_text);
    }, 3000);
  }
}

/**
* Hide notification messages
*
* @returns void
*/
function hide_notifications() {
  $('.tc-notification').hide();
}

/**
* Get translation from the website and translate all strings in the app
*
* @param boolean show_stats
* @returns void
*/
function translate_app(show_stats) {


  if (online == 0) {

    var translation_app = tc_storage_get('translation');

    for (key in translation_app) {
      $('.' + key).html(translation_app[key]);
    }

    if (show_stats == true) {
      show_screen('stats', 0);
    }

    //Special translation for the search placeholder
    $('.search_field').attr('placeholder', $('.SEARCH').html());

  } else {
    var timestamp = new Date().getTime() / 1000;
    var post_data = {};
    post_data.site_url = site_url.val();
    post_data.api_key = api_key.val();
    post_data.timestamp = timestamp;

    var jqxhr = $.post(checkinera_ajax.ajaxUrl, {action: 'checkinera_translation', data: post_data}, function(response){

      if(response.error !== undefined && response.error){
        show_notification(response.error, 'error', 'login');
        enable_login_fields();
      }

      translation = response;
      tc_storage_set('translation', translation);
      for (key in translation) {
        $('.' + key).html(translation[key]);
      }
      if (show_stats == true) {
        show_screen('stats', 0);
      }
      //Special translation for the search placeholder
      $('.search_field').attr('placeholder', $('.SEARCH').html());

    }, 'json')
    .fail(function() {
      //do not translate strings, call failed
      if (show_stats == true) {
        show_screen('stats', 0);
      }
    });
  }
}

/**
* Translate javascript strings
*
* @param string key
* @param string string
* @returns {translation|window.translation}
*/
function translate_string(key, string) {
  if (key in translation) {
    string = translation[key];
  }
  return string;
}

/**
* Get attendees info (per page) from the website and show them in the container
*
* @param int page_num
* @returns void
*/
async function list_attendees( page_num ) {

  if ( online != 0 ) {

    let post_data = {},
    result;

    post_data.site_url = site_url.val();
    post_data.api_key = api_key.val();
    post_data.timestamp = new Date().getTime() / 1000;
    post_data.tickets_per_page = tickets_per_page;
    post_data.page_num = page_num;
    post_data.action = 'checkinera_tickets_info';

    if ( $('.search_field').val() !== '' ) {
      post_data.search_key = $('.search_field').val();
    }

    try {

      result = await $.ajax( {
        url: checkinera_ajax.ajaxUrl,
        type: 'POST',
        dataType: "json",
        cache: false,
        data:post_data
      });

      update_attendees_list( result, page_num );

    } catch( error ) {}
  }
}

/**
* After Ajax collects attendees' list, update/append content onto DOM
*
* @param result
* @param page_num
*/
function update_attendees_list( result, page_num ) {

  // Starts from zero, last object contains additional info
  let list_length = result.length - 2;

  for ( let i = 0; i <= list_length; i++ ) {
    attendees_data[page_num + '_' + i] = result[i];
    total_listed_tickets++;
    add_attendee_record(result[i].data.checksum, result[i].data.buyer_first, result[i].data.buyer_last, result[i].data.payment_date, result[i].data.custom_field_count, result[i].data.custom_fields, result[i].data.allowed_checkins, page_num, i, result[i].data.badge_url);
    $('.tc-tickets-list').append('<div class="tc-tickets-one"><h3 class="tc_selectable">' + result[i].data.buyer_first + ' ' + result[i].data.buyer_last + '</h3><br /><span class="tc-ticket-info">' + result[i].data.custom_fields[0][1] + '</span><br /><span class="tc-ticket-info">' + translate_string('ID', 'ID') + ': <span class="tc_selectable">' + result[i].data.transaction_id + '</span></span>   <span class="tc-ticket-info">' + translate_string('PURCHASED', 'Purchased') + ': <span>' + result[i].data.payment_date + '</span></span><a class="tc-list-link tc_list_link ID' + result[i].data.checksum + '" data-id="' + i + '" data-page="' + page_num + '" data-checksum="' + result[i].data.checksum + '" data-badge_url="' + result[i].data.badge_url + '"><span class="icon-arrow"></span></a></div>');
  }

  if ( -2 == list_length ) {
    $('.tc-tickets-list').html('');
    $('.tc-tickets-list').append('<div class="tc-tickets-one empty-list"><h3 class="tc_selectable">' + translate_string('EMPTY_LIST', 'The list is empty') + '</h3><br /></div>');
  }

  if ( total_listed_tickets == tickets_count || show_at_once ) {
    download_progress_message();
    $('.search_field').prop('disabled', false);
  }

  tc_show_preloader(false);
  get_all_checkins_and_set_count_db();
}

/**
* Call list_attendees X times based on tickets_pages value in order to list all attendees (page by page in order to get faster loading)
*
* @param {type} clear
* @returns {undefined}
*/
async function load_list( clear, force_offline ) {

  // Important: Do not call it twice
  list_loaded = true;

  if ( true == clear ) {
    $('.tc-tickets-list').empty();
  }

  if ( 0 == online || true == force_offline ) {

    // Retrieve data from local database
    get_db_attendees_data();

  } else {
    tc_show_preloader( true );
    remove_attendee_records();

    if ( 1 == tickets_pages ) {
      await list_attendees( 1 );

    } else {

      if ( 1 == show_at_once ) {
        await list_attendees( 1 );

      } else {
        for ( let i = 1; i < ( tickets_pages + 1 ); i++ ) {
          await list_attendees(i);
        }
      }
    }
  }
}

/**
* Get essential info about the event (number of tickets sold, number of checked in tickets, event name, etc )
*
* @returns void
*/
function get_event_essentials() {
  if (list_loaded == false) {
    tc_show_preloader(true);
  }

  if (online == 0) {
    if (!isNaN(tc_storage_get('tickets_count'))) {
      tickets_count = tc_storage_get('tickets_count');
    }

    if (!isNaN(tc_storage_get('tickets_pages'))) {
      tickets_pages = tc_storage_get('tickets_pages');
    }

    if (!isNaN(tc_storage_get('show_attendee_screen'))) {
      show_attendee_screen = tc_storage_get('show_attendee_screen');
    }

    if (!isNaN(tc_storage_get('sold_tickets'))) {
      $('.tickets_sold_number').html(tc_storage_get('sold_tickets'));
    }

    if (!isNaN(tc_storage_get('checked_tickets'))) {
      $('.tickets_checked_in').html(tc_storage_get('checked_tickets'));
    }

    if (list_loaded == false) {
      load_list(true, false);
    }

  }

  if (online == 1) {
    if (get_event_essentials_started == false) {//call only if it's not called already or if the request is finished

      get_event_essentials_started = true;

      var timestamp = new Date().getTime() / 1000;
      var post_data = {};
      post_data.site_url = site_url.val();
      post_data.api_key = api_key.val();
      post_data.timestamp = timestamp;

      var jqxhr = $.post(checkinera_ajax.ajaxUrl, {action: 'checkinera_event_essentials', data: post_data}, function(response){

        if(response.error !== undefined && response.error){
          show_notification(response.error, 'error', 'login');
          enable_login_fields();
        }

        use_badges = response.use_badges;
        show_at_once = response.show_at_once;
        show_attendee_screen = response.show_attendee_screen;

        $('.tickets_sold_number').html(response.sold_tickets);
        $('.tickets_checked_in').html(response.checked_tickets);
        tickets_count = response.sold_tickets;
        if (tickets_count <= tickets_per_page) {
          tickets_pages = 1;
        } else {
          tickets_pages = Math.ceil(tickets_count / tickets_per_page);
        }

        //Save event essentials
        tc_storage_set('tickets_count', tickets_count);
        tc_storage_set('tickets_pages', tickets_pages);
        tc_storage_set('sold_tickets', response.sold_tickets);
        tc_storage_set('checked_tickets', response.checked_tickets);
        tc_storage_set('show_attendee_screen', response.show_attendee_screen);

        if (counts_animated == false) {
          $('.counter').each(function() {
            $(this).prop('Counter', 0).animate({
              Counter: $(this).text()
            }, {
              duration: 500,
              easing: 'swing',
              step: function(now) {
                $(this).text(Math.ceil(now));
              }
            });
          });
          counts_animated = true;
        }

        if (list_loaded == false) {
          load_list(true, false);
        }

        get_event_essentials_started = false;
      }, 'json')
      .fail(function() {
        get_event_essentials_started = false;
        //Show error message here-----------------------------------------------------------
      });
      if (online == 1) {
        maybe_sync_checkins();
      }
    }
  }
}

/**
* Show screen (and hide other unneeded screens)
*
* @param string screen
* @param int animation_time (animation duration in milliseconds)
* @returns void
*/
function show_screen(screen, animation_time, animation_type) {

  current_screen = screen;
  for (i = 0; i < screens.length; i++) {
    $('.tc-' + screens[i]).hide(0);
  }

  if (screen == 'stats') {
    get_event_essentials();
  }

  if (screen == 'list') {
    $('.tc-tickets-list').height($(window).height() - 65);
    jQuery(window).resize(function() {
      $('.tc-tickets-list').height($(window).height() - 65);
    });
  }

  if (screen == 'single-list') {

    tc_set_details_size();

    jQuery(window).resize(function() {
      tc_set_details_size();
    });
  }

  if (screen == 'login') {
    $('.online_status').hide();
  } else {
    $('.online_status').show();
    $('.online_status').css('display','inline-block');
  }

  hide_notifications();

  if (animation_type == 'opacity') {
    $('.tc-' + screen).fadeTo(animation_time, 1, function() {
    });
  } else {
    $('.tc-' + screen).slideDown(animation_time, function() {
    });
  }

  if (screen == 'scan') {
    $('#barcode').val('');
    scan_show_additional_info(false, 0);
    show_notification(translate_string('BARCODE_SCAN_INFO', 'Select input field and scan a barcode'), 'info', 'scan');
    // $('.barcode-main').center(0);
    // $('#barcode').focus();
  }
}

function tc_set_details_size() {
  setTimeout(function() {
    height_bottom = jQuery('.tc-notifications-wrap').outerHeight();
    height_middle = jQuery('.tc-ticket-info-single').height();
    height_top = jQuery('.tc-single-list .tc-content-heading').height();
    tc_height_all = height_bottom + height_middle + height_top;
    $('.attendee-details-wrap').height($(window).height() - tc_height_all);
  }, 500);
}

/**
* Saves login data based on auto login value
*
* @returns void
*/
function save_login_data() {

  var auto_login_checked = $('#auto-login:checkbox:checked').length > 0;

  site_url = $('#tc-website-url');
  api_key = $('#tc-api-key');
  auto_login = $('#auto-login');

  tc_storage_set('tc_site_url', site_url.val());
  tc_storage_set('tc_api_key', api_key.val());

  if (auto_login_checked) {
    tc_storage_set('tc_auto_login', auto_login_checked);
  } else {
    clear_login_data();
  }
}

/**
* Delete login information stored
*
* @returns void
*/
function clear_login_data() {
  tc_storage_set('tc_site_url', '');
  tc_storage_set('tc_api_key', '');
  tc_storage_set('tc_auto_login', false);
}

/**
* Fills check-ins data
*
* @param string checksum
* @param boolean please_wait_message
* @returns void
*/
function get_check_ins(checksum, please_wait_message) {

  if (online == 0) {
    //get offline checkins
    get_check_ins_db(checksum, false);
  } else {
    if (please_wait_message) {
      $('.tc-single-list .tc-checkins ul').html('');
      $('.tc-single-list .tc-checkins ul').append('<li>' + translate_string('PLEASE_WAIT', 'Please wait...') + '</li>');
    }

    var timestamp = new Date().getTime() / 1000;
    var post_data = {};
    post_data.site_url = site_url.val();
    post_data.api_key = api_key.val();
    post_data.timestamp = timestamp;
    post_data.checksum = checksum;

    var jqxhr = $.post(checkinera_ajax.ajaxUrl, {action: 'checkinera_ticket_checkins', data: post_data}, function(response){

      if (response.length > 0) {
        $('.tc-single-list .tc-checkins ul').html('');
        for (i = 0; i < response.length; i++) {
          $('.tc-single-list .tc-checkins ul').append('<li>' + response[i].data.date_checked + ' - ' + response[i].data.status + '</li>');
        }
      } else {
        $('.tc-single-list .tc-checkins ul').html('');
        $('.tc-single-list .tc-checkins ul').append('<li>' + translate_string('EMPTY_LIST', 'The list is empty') + '</li>');
      }
    }, 'json')
    .fail(function() {
      $('.tc-single-list .tc-checkins ul').html('');
      $('.tc-single-list .tc-checkins ul').append('<li>' + translate_string('ERROR', 'An error occured.') + '</li>');
      //Show error message here-----------------------------------------------------------
    });
  }
}


/**
* Check-in ticket and show appropriate notification based on the result
*
* @param string checksum
* @returns void
*/
function check_in_ticket(checksum) {

  if (online == 0) {
    check_in_ticket_barcode_db(checksum);
  } else {
    button_notification(translate_string('PLEASE_WAIT', 'Please wait...'), 'info', 'single-list');

    var timestamp = new Date().getTime() / 1000;
    var post_data = {};
    post_data.site_url = site_url.val();
    post_data.api_key = api_key.val();
    post_data.timestamp = timestamp;
    post_data.checksum = checksum;

    var jqxhr = $.post(checkinera_ajax.ajaxUrl, {action: 'checkinera_check_in', data: post_data}, function(response){

      if (response.status == true) {
        ch_ga_checkin(true);
        button_notification(translate_string('SUCCESS_MESSAGE', 'Ticket has been check in successfully'), 'success', 'single-list', translate_string('CHECK_IN', 'Check In'));
      } else {
        ch_ga_checkin(false);
        button_notification(translate_string('ERROR_MESSAGE', 'Wrong ticket code'), 'error', 'single-list', translate_string('CHECK_IN', 'Check In'));
        play_fail_sound();
      }

      get_check_ins(checksum, false);
    }, 'json')
    .fail(function() {
      show_notification(translate_string('ERROR', 'An error occured.'), 'info', 'single-list');
      play_fail_sound();
    });
  }
}

/**
* Check-in ticket from barcode reader screen and shows appropriate notification
*
* @param string checksum
* @returns void
*/
function check_in_ticket_barcode(checksum) {

  show_notification(translate_string('PLEASE_WAIT', 'Please wait...'), 'info', 'scan');
  var timestamp = new Date().getTime() / 1000;
  if (online == 0) {
    check_in_ticket_barcode_db(checksum);
  } else {
    var timestamp = new Date().getTime() / 1000;
    var post_data = {};
    post_data.site_url = site_url.val();
    post_data.api_key = api_key.val();
    post_data.timestamp = timestamp;
    post_data.checksum = checksum;

    var jqxhr = $.post(checkinera_ajax.ajaxUrl, {action: 'checkinera_check_in', data: post_data}, function(response){

      current_scan_response = response;

      if (response.status == true) {
        show_notification(translate_string('SUCCESS_MESSAGE', 'Ticket has been check in successfully'), 'success', 'scan');
        $('#barcode').val('');
        ch_ga_checkin(true);
      } else {
        show_notification(translate_string('ERROR_MESSAGE', 'Wrong ticket code'), 'error', 'scan');
        play_fail_sound();
        $('#barcode').val('');
        ch_ga_checkin(false);
      }

      scan_show_additional_info( true, 250 );

    }, 'json')
    .fail(function() {
      show_notification(translate_string('ERROR', 'An error occured.'), 'info', 'scan');
      play_fail_sound();
      $('#barcode').val('');
      scan_show_additional_info( false, 250 );
    });
  }

  maybe_redirect_to_single_screen(checksum);
}

checkin_read = check_in_ticket_barcode;

/**
* Shows additional information for the attendee (custom fields and check-in data)
*
* @param boolean show
* @param int speed
* @returns void
*/
function scan_show_additional_info(show, speed) {
  if (show == false) {
    $( '.tc-additional-info' ).hide();
    // $('.barcode-main').center(speed);
  } else {
    $( '#tc-custom-fields' ).html( `
    <div class="tc-custom-field">
      <div class="tc-custom-field-name">
        Name
      </div>
      <div class="tc-custom-field-value">
        ${current_scan_response.name}
      </div>
    </div>` );

    const fields_to_show = [
      'Ticket Type',
      'Details',
      'Attendee Email',
      'Event Name',
      'Code',
    ];

    fields_to_show.forEach(field_name => {
      const found_field = current_scan_response.custom_fields.find(custom_field => (custom_field[0] === field_name));
      if(found_field){
        $( '#tc-custom-fields' ).append( `
        <div class="tc-custom-field">
          <div class="tc-custom-field-name">
            ${found_field[0]}
          </div>
          <div class="tc-custom-field-value">
            ${found_field[1]}
          </div>
        </div>` );
      }
    });

    // current_scan_response.custom_fields.forEach(element => {
    //   if (!fields_to_show.includes(element[0])) return;

    //   $( '#tc-custom-fields' ).append( `
    //   <div class="tc-custom-field">
    //     <div class="tc-custom-field-name">
    //       ${element[0]}
    //     </div>
    //     <div class="tc-custom-field-value">
    //       ${element[1]}
    //     </div>
    //   </div>` );
    // });

    $( '.tc-additional-info' ).show( speed );
    // $( '.barcode-main' ).toTop( speed );
  }
}

/**
* Auto login if auto login was selected
*
* @returns void
*/
function maybe_auto_login() {

  var tc_auto_login = tc_storage_get('tc_auto_login');

  if (tc_auto_login == 'true') {
    $('#auto-login').prop('checked', true);
  } else {
    $('#auto-login').prop('checked', false);
  }

  if (tc_auto_login == 'true') {
    $('#tc-website-url').val(tc_storage_get('tc_site_url'));
    var api_key = tc_storage_get('tc_api_key');

    $('#tc-api-key').val(api_key);
    $('.tc-login-button').click();

  }
}

/* ---------------------------------------------OFFLINE DB ---------------------------------------*/

function on_upgrade_needed(open, store) {
  var db = open.result;
  if (store == 'attendee_data') {
    var store = db.createObjectStore("attendee_data", {keyPath: "id"});
    var index = store.createIndex("attendee_index", ["first_name", "last_name"]);
  }

  if (store == 'checkins_records') {
    var store = db.createObjectStore("checkins_records", {keyPath: "id", autoIncrement: true});
    store.createIndex("checkins_index", ["checksum", "timestamp"], {unique: true});
  }

}

function get_allowed_checkins_db(checkin_data, checksum) {
  if (isObject(checkin_data.result) == true && !isNaN(checkin_data.result.allowed_checkins)) {
    var allowed_checkins = checkin_data.result.allowed_checkins;
    var data_id = $('.ID' + checksum).attr('data-id');
    var data_page = $('.ID' + checksum).attr('data-page');
    offline_checkins = attendees_data[data_page + '_' + data_id].data.offline_checkins;
    if (isNaN(offline_checkins)) {
      offline_checkins = 0;
    }

    allowed_checkins = allowed_checkins - offline_checkins;
    return allowed_checkins;
  } else {
    return 99999; // Infinite
  }
}

/**
* Offline check-in of a ticket
*
* @param {type} checksum
* @returns {undefined}
*/
function check_in_ticket_barcode_db(checksum) {

  var indexedDB = window.indexedDB;
  var open = indexedDB.open("tc_checkin_attendee_data", 4.1);
  open.onupgradeneeded = function() {
    on_upgrade_needed(open, 'attendee_data');
  };
  open.onsuccess = function() {
    var db = open.result;
    var tx = db.transaction("attendee_data", IDBTransaction.READ_ONLY);
    var store = tx.objectStore("attendee_data");
    var checkin_data = store.get(checksum);
    checkin_data.onsuccess = function() {
      if (isObject(checkin_data.result) == true) {
        if (get_allowed_checkins_db(checkin_data, checksum) > 0) {
          add_check_in_record(checksum);
          show_notification(translate_string('SUCCESS_MESSAGE', 'Ticket has been check in successfully'), 'success', 'scan');
          show_notification(translate_string('SUCCESS_MESSAGE', 'Ticket has been check in successfully'), 'success', 'single-list');
        } else {
          show_notification(translate_string('ERROR_MESSAGE', 'Wrong ticket code'), 'error', 'scan');
          show_notification(translate_string('ERROR_MESSAGE', 'Wrong ticket code'), 'error', 'single-list');
          play_fail_sound();
        }
        $('#barcode').val('');
      } else {
        show_notification(translate_string('ERROR_MESSAGE', 'Wrong ticket code'), 'error', 'scan');
        show_notification(translate_string('ERROR_MESSAGE', 'Wrong ticket code'), 'error', 'single-list');
        play_fail_sound();
        $('#barcode').val('');
      }

      get_check_ins(checksum, false);
    };
  }
}

function timeConverter(timestamp) {

  var a = new Date(timestamp);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  if (sec < 10) {
    sec = '0' + sec;
  }

  if (min < 10) {
    min = '0' + min;
  }

  if (hour < 10) {
    hour = '0' + hour;
  }

  var time = date + ' ' + month + ', ' + hour + ':' + min + ':' + sec;
  return time;
}

function get_single_checkins_and_set_count_db(checksum) {

  var indexedDB = window.indexedDB;
  var open = indexedDB.open("tc_checkins_data", 4.1);
  open.onupgradeneeded = function() {
    on_upgrade_needed(open, 'checkins_records');
  };
  open.onsuccess = function() {
    var db = open.result;
    var trans = db.transaction("checkins_records", IDBTransaction.READ_ONLY);
    window.current_checkin_store = trans.objectStore("checkins_records");
    var items = [];
    trans.oncomplete = function(evt) {

      list_length = items.length;
      offline_checkins = 0;
      if (list_length > 0) {
        for (var i = 0; i < list_length; i += 1) {
          if (items[i].checksum == checksum) {//make sure the checksum is the same one we want (checksum argument)
            checksum_db = items[i].checksum;
            var data_id = $('.ID' + checksum_db).attr('data-id');
            var data_page = $('.ID' + checksum_db).attr('data-page');
            offline_checkins++;
          }
        }

        attendees_data[data_page + '_' + data_id].data.offline_checkins = offline_checkins;
      } else {
        //no offline checkin records available, don't do anything
      }
    };
    var cursorRequest = current_checkin_store.openCursor();
    cursorRequest.onerror = function(error) {

    };
    cursorRequest.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
    };
  }

}

/**
* Get all checkins from offline database and set count of checkins
*
* @returns {undefined}
*/
function get_all_checkins_and_set_count_db() {

  var indexedDB = window.indexedDB;
  var open = indexedDB.open("tc_checkins_data", 4.1);
  open.onupgradeneeded = function() {
    on_upgrade_needed(open, 'checkins_records');
  };
  open.onsuccess = function() {
    var db = open.result;
    var trans = db.transaction("checkins_records", IDBTransaction.READ_ONLY);
    window.current_checkin_store = trans.objectStore("checkins_records");
    var items = [];
    trans.oncomplete = function(evt) {

      list_length = items.length;
      if (list_length > 0) {
        for (var i = 0; i < list_length; i += 1) {
          checksum_db = items[i].checksum;
          var data_id = $('.ID' + checksum_db).attr('data-id');
          var data_page = $('.ID' + checksum_db).attr('data-page');
          var offline_checkins = attendees_data[data_page + '_' + data_id].data.offline_checkins;
          if (!isNaN(offline_checkins)) {
            attendees_data[data_page + '_' + data_id].data.offline_checkins = (attendees_data[data_page + '_' + data_id].data.offline_checkins) + 1;
          } else {
            attendees_data[data_page + '_' + data_id].data.offline_checkins = 1;
          }
        }
      }
    };
    var cursorRequest = current_checkin_store.openCursor();
    cursorRequest.onerror = function(error) {
    };
    cursorRequest.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
    };
  }

}

/**
* Get checkins for a ticket in the offline mode
*
* @param {type} checksum
* @returns {undefined}
*/
function get_check_ins_db(checksum) {

  var indexedDB = window.indexedDB;
  var open = indexedDB.open("tc_checkins_data", 4.1);
  open.onupgradeneeded = function() {
    on_upgrade_needed(open, 'checkins_records');
  };
  open.onsuccess = function() {
    var db = open.result;
    var trans = db.transaction("checkins_records", IDBTransaction.READ_ONLY);
    window.current_checkin_store = trans.objectStore("checkins_records");
    var items = [];
    trans.oncomplete = function(evt) {

      $('.tc-single-list .tc-checkins ul').html('');
      list_length = items.length;
      listed = 0;
      if (list_length > 0) {
        for (var i = 0; i < list_length; i += 1) {
          if (items[i].checksum == checksum) {
            listed++;
            $('.tc-single-list .tc-checkins ul').append('<li>' + timeConverter(items[i].timestamp) + ' - ' + translate_string('PASS', 'Pass') + '</li>');
          }
        }
      } else {
        //no offline checkin records available, don't do anything
      }

      if (listed == 0) {
        $('.tc-single-list .tc-checkins ul').html('');
        $('.tc-single-list .tc-checkins ul').append('<li>' + translate_string('EMPTY_LIST', 'The list is empty') + '</li>');
      }
    };
    var cursorRequest = current_checkin_store.openCursor();
    cursorRequest.onerror = function(error) {
    };
    cursorRequest.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
    };
  }


}

/**
* Send offline check-ins to the online database
* @returns void
*/
function maybe_sync_checkins() {
  if (online == 1) {//only sync if app is online
    var indexedDB = window.indexedDB;
    var open = indexedDB.open("tc_checkins_data", 4.1);
    open.onupgradeneeded = function() {
      on_upgrade_needed(open, 'checkins_records');
    };
    open.onsuccess = function() {
      var db = open.result;
      var trans = db.transaction("checkins_records", IDBTransaction.READ_ONLY);
      window.current_checkin_store = trans.objectStore("checkins_records");
      var items = [];
      trans.oncomplete = function(evt) {

        list_length = items.length;
        var synced_items = 0;
        if (list_length > 0) {
          for (var i = 0; i < list_length; i += 1) {
            window.current_checkin_item = items[i];

            var timestamp = new Date().getTime() / 1000;
            var post_data = {};
            post_data.site_url = site_url.val();
            post_data.api_key = api_key.val();
            post_data.timestamp = items[i].timestamp / 1000;
            post_data.checksum = items[i].checksum;
            post_data.action = "checkinera_sync";

            $.ajax({
              type: "POST",
              url: checkinera_ajax.ajaxUrl,
              dataType: "json",
              data: post_data,
              cache: false,
              tryCount: 0,
              retryLimit: 10,
              success: function(response) {
                synced_items++;

                // Delete a record in the DB
                if (synced_items == list_length) {

                  // Show a message for sync completed
                  items_synced_message(synced_items);

                  // Delete check-ins table, all are in sync
                  var indexedDB = window.indexedDB;

                  // Open (or create) the database
                  var open = indexedDB.open("tc_checkins_data", 4.1);
                  open.onupgradeneeded = function() {
                    on_upgrade_needed(open, 'tc_checkins_data');
                  };
                  open.onsuccess = function() {
                    var db = open.result;
                    var tx = db.transaction("checkins_records", "readwrite");
                    var store = tx.objectStore("checkins_records");

                    // clear all the data out of the object store
                    var objectStoreRequest = store.clear();
                    objectStoreRequest.onsuccess = function(event) {
                    };
                  }

                } else {
                  items_synced_progress_message(synced_items, list_length);
                }
              },
              error: function(xhr, textStatus, errorThrown) {

                if ( 'timeout' == textStatus || 0 == xhr.status ) {

                  // Try again
                  this.tryCount++;
                  if (this.tryCount <= this.retryLimit) {
                    $.ajax(this);
                  }
                }
                if (xhr.status == 500) {
                } else {
                }
              }

            });
          }
        } else {
          //no offline checkin records available, don't do anything
        }

      };
      var cursorRequest = current_checkin_store.openCursor();
      cursorRequest.onerror = function(error) {
      };
      cursorRequest.onsuccess = function(evt) {
        var cursor = evt.target.result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        }
      };
    }
  }
}

/**
* Get attendee data from offline DB
*
* @param {type} callback
* @returns void
*/
function get_db_attendees_data() {

  var indexedDB = window.indexedDB;

  // Open (or create) the database
  var open = indexedDB.open("tc_checkin_attendee_data", 4.1);
  open.onupgradeneeded = function() {
    on_upgrade_needed(open, 'attendee_data');
  };
  open.onsuccess = function() {
    var db = open.result;
    var trans = db.transaction("attendee_data", IDBTransaction.READ_ONLY);
    var store = trans.objectStore("attendee_data");
    var items = [];
    var items_count = 0;
    trans.oncomplete = function(evt) {
      list_length = items.length;
      for (var i = 0; i < list_length; i += 1) {
        attendees_data[items[i].page_num + '_' + items[i].i] = {};
        attendees_data[items[i].page_num + '_' + items[i].i].data = {};
        attendees_data[items[i].page_num + '_' + items[i].i].data.buyer_first = items[i].first_name;
        attendees_data[items[i].page_num + '_' + items[i].i].data.buyer_last = items[i].last_name;
        attendees_data[items[i].page_num + '_' + items[i].i].data.checksum = items[i].id;
        attendees_data[items[i].page_num + '_' + items[i].i].data.payment_date = items[i].purchased_date;
        attendees_data[items[i].page_num + '_' + items[i].i].data.custom_field_count = items[i].custom_field_count;
        attendees_data[items[i].page_num + '_' + items[i].i].data.custom_fields = items[i].custom_fields;
        attendees_data[items[i].page_num + '_' + items[i].i].data.allowed_checkins = items[i].allowed_checkins;
        attendees_data[items[i].page_num + '_' + items[i].i].data.badge_url = items[i].badge_url;
        if ($('.search_field').val() !== '') {
          try {
            var search_key_match = new RegExp($('.search_field').val(), 'i');
          } catch (e) {
            var search_key_match = '';
          }

          custom_form_search_match = false;

          for (x = 0; x < items[i].custom_field_count; x++) {
            if (items[i].custom_fields !== undefined && items[i].custom_fields !== null) {
              if (items[i].custom_fields[x] !== undefined && items[i].custom_fields[x] !== null) {
                if (items[i].custom_fields[x][1] !== undefined && items[i].custom_fields[x][1] !== null) {
                  if (items[i].custom_fields[x][1].match(search_key_match)) {
                    custom_form_search_match = true;
                  }
                }
              }
            }
          }

          if (custom_form_search_match || (items[i].id.match(search_key_match)) || (items[i].first_name.match(search_key_match)) || (items[i].last_name.match(search_key_match))) {
            $('.tc-tickets-list').append('<div class="tc-tickets-one"><h3 class="tc_selectable">' + items[i].first_name + ' ' + items[i].last_name + '</h3><br /><span class="tc-ticket-info">' + items[i].custom_fields[0][1] + '</span><br /><span class="tc-ticket-info">' + translate_string('ID', 'ID') + ': <span class="tc_selectable">' + items[i].id + '</span></span>   <span class="tc-ticket-info">' + translate_string('PURCHASED', 'Purchased') + ': <span>' + items[i].purchased_date + '</span></span><a class="tc-list-link tc_list_link ID' + items[i].id + '" data-id="' + items[i].i + '" data-page="' + items[i].page_num + '" data-checksum="' + items[i].id + '" data-badge_url="' + items[i].badge_url + '"><span class="icon-arrow"></span></a></div>');
            items_count++;
          }

        } else {
          items_count++;
          $('.tc-tickets-list').append('<div class="tc-tickets-one"><h3 class="tc_selectable">' + items[i].first_name + ' ' + items[i].last_name + '</h3><br /><span class="tc-ticket-info">' + items[i].custom_fields[0][1] + '</span><br /><span class="tc-ticket-info">' + translate_string('ID', 'ID') + ': <span class="tc_selectable">' + items[i].id + '</span></span>   <span class="tc-ticket-info">' + translate_string('PURCHASED', 'Purchased') + ': <span>' + items[i].purchased_date + '</span></span><a class="tc-list-link tc_list_link ID' + items[i].id + '" data-id="' + items[i].i + '" data-page="' + items[i].page_num + '" data-checksum="' + items[i].id + '" data-badge_url="' + items[i].badge_url + '"><span class="icon-arrow"></span></a></div>');
        }

      }

      if (items_count == 0) {
        $('.tc-tickets-list').html('');
        $('.tc-tickets-list').append('<div class="tc-tickets-one empty-list"><h3 class="tc_selectable">' + translate_string('EMPTY_LIST', 'The list is empty') + '</h3><br /></div>');
      }

      $('.search_field').prop('disabled', false);
      get_all_checkins_and_set_count_db();
      tc_show_preloader(false);
    };
    var cursorRequest = store.openCursor();
    cursorRequest.onerror = function(error) {
    };
    cursorRequest.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      }
    };
  }
}


/**
* Remove all attendee records from offline database
* @returns void
*/
function remove_attendee_records() {
  //IMPORTANT
  window.indexedDB.deleteDatabase("tc_checkin_attendee_data");
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
  var indexedDB = window.indexedDB;
  // Open (or create) the database
  var open = indexedDB.open("tc_checkin_attendee_data", 4.1);
  open.onupgradeneeded = function() {
    on_upgrade_needed(open, 'attendee_data');
  };
  open.onsuccess = function() {
    var db = open.result;
    var tx = db.transaction("attendee_data", "readwrite");
    var store = tx.objectStore("attendee_data");
    // clear all the data out of the object store
    var objectStoreRequest = store.clear();
    objectStoreRequest.onsuccess = function(event) {
    };
  }
}


/**
* Add attendee data to the offline database
*
* @param {type} checksum
* @param {type} first_name
* @param {type} last_name
* @param {type} purchased_date
* @param {type} custom_field_count
* @param {type} custom_fields
* @param {type} page_num
* @param {type} i
* @returns void
*/
function add_attendee_record(checksum, first_name, last_name, purchased_date, custom_field_count, custom_fields, allowed_checkins, page_num, i, badge_url) {
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
  var indexedDB = window.indexedDB;
  // Open (or create) the database
  var open = indexedDB.open("tc_checkin_attendee_data", 4.1);
  // Create the schema
  open.onupgradeneeded = function() {
    on_upgrade_needed(open, 'attendee_data');
  };
  open.onsuccess = function() {
    // Start a new transaction
    var db = open.result;
    var tx = db.transaction("attendee_data", "readwrite");
    var store = tx.objectStore("attendee_data");
    var index = store.index("attendee_index");
    // Add some data
    store.put({id: checksum, first_name: first_name, last_name: last_name, purchased_date: purchased_date, custom_field_count: custom_field_count, custom_fields: custom_fields, allowed_checkins: allowed_checkins, page_num: page_num, i: i, badge_url: badge_url});
    // Close the db when the transaction is done
    tx.oncomplete = function() {
      db.close();
    };
  }
}

/**
* Add check-in record to the offline database
* @param {type} checksum
* @returns {undefined}
*/
function add_check_in_record(checksum) {

  var indexedDB = window.indexedDB;
  // Open (or create) the database
  var open_checkins = indexedDB.open("tc_checkins_data", 4.1);
  // Create the schema

  open_checkins.onupgradeneeded = function() {
    on_upgrade_needed(open_checkins, 'checkins_records');
  };
  open_checkins.onsuccess = function() {
    // Start a new transaction
    var db = open_checkins.result;
    var tx = db.transaction("checkins_records", "readwrite");
    var store = tx.objectStore("checkins_records");
    var index = store.index("checkins_index");
    // Add some data
    store.put({checksum: checksum, timestamp: Date.now()});
    get_single_checkins_and_set_count_db(checksum);
    // Close the db when the transaction is done
    tx.oncomplete = function() {
      db.close();
    };
  }
}

function play_fail_sound() {
  var myAudio = new Audio();
  myAudio.src = checkinera_ajax.fail_sound_url;
  myAudio.play();
}

jQuery(".tc-additional-info-hide").on("click", function(ev) {
  $('.tc-ticket-additional-info').toggleClass('tc-hide-additional-info');
  $('a.tc-back-arrow').toggleClass('tc-move-arrow');
  $('.tc-additional-info-hide').toggleClass('tc-turn-arrow');
});

jQuery(window).scroll(function() {
  jQuery('.tc-sidebar').css('margin-top', jQuery(window).scrollTop() + 'px');
});

jQuery("input#barcode, #tc-api-key").focusout(function() {
  jQuery('.tc-sidebar').css('margin-top', '0');
  jQuery("html, body").scrollTop(0);
});

if (navigator.userAgent.search("Safari") >= 0 || navigator.userAgent.search("Android") >= 0 ) {

  var pheight = $(window).height();
  jQuery('body').height(pheight + 'px');

  jQuery(window).resize(function() {
    var pheight = $(window).height();
    jQuery('body').height(pheight + 'px');

  });
};

jQuery('.tc-notifications-wrap').css('display', 'block');

});
