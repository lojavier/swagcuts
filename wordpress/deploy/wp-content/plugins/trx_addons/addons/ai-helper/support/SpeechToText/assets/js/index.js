/* global jQuery, TRX_ADDONS_STORAGE */

jQuery( document ).on( 'action.init_hidden_elements', function(e, container) {

	"use strict";
	
	if ( container === undefined ) {
		container = jQuery( 'body' );
	}

	// Voice input
	container.find( '.trx_addons_ai_helper_stt_button:not(.inited)' ).addClass( 'inited' ).each( function() {
		var $stt_button = jQuery( this );
		var id = $stt_button.attr( 'id' ) || '';
		if ( ! id ) {
			id = 'trx_addons_ai_helper_stt_button_' + trx_addons_get_unique_id();
			$stt_button.attr( 'id', id );
		}

		// Init media recorder
		trx_addons_media_recorder( {
			startButtonId: id,
			stopButtonId: '',
			activeClass: 'trx_addons_ai_helper_stt_button_active',
			disabledClass: 'trx_addons_ai_helper_stt_button_disabled',
			onStop: function( audioBlob, audioUrl ) {
				$stt_button.addClass( 'trx_addons_loading_icon' );
				// Convert audioBlob to text via AJAX
				var formData = new FormData();
				formData.append( 'nonce', TRX_ADDONS_STORAGE['ajax_nonce'] );
				formData.append( 'action', 'trx_addons_ai_helper_speech_to_text' );
				formData.append( 'model', $stt_button.data( 'voice-input-model' ) || '' );
				formData.append( 'voice_input', audioBlob, 'voice_input.wav' );
				jQuery.ajax( {
					url: TRX_ADDONS_STORAGE['ajax_url'],
					type: "POST",
					data: formData,
					processData: false,		// Don't process fields to the string
					contentType: false,		// Prevent content type header
					success: function( response ) {
						show_answer( response );
					},
					error: function( jqXHR, textStatus, errorThrown ) {
						trx_addons_msgbox_warning( TRX_ADDONS_STORAGE['msg_ajax_error'], TRX_ADDONS_STORAGE['msg_speech_to_text'] );
						$stt_button.removeClass( 'trx_addons_loading_icon' );
					}
				} );
			}
		} );

		// Fetch answer
		function fetch_answer( data ) {
			$stt_button.addClass( 'trx_addons_loading_icon' );
			jQuery.post( TRX_ADDONS_STORAGE['ajax_url'], {
				nonce: TRX_ADDONS_STORAGE['ajax_nonce'],
				action: 'trx_addons_ai_helper_speech_to_text_fetch',
				fetch_id: data.fetch_id,
				fetch_url: data.fetch_url
			}, function( response ) {
				show_answer( response )
			} );
		}

		// Show answer
		function show_answer( response ) {
			$stt_button.removeClass( 'trx_addons_loading_icon' );
			var rez = trx_addons_parse_ajax_response( response, TRX_ADDONS_STORAGE['msg_ai_helper_error'] );
			if ( rez.finish_reason == 'queued' ) {
				var time = rez.fetch_time ? rez.fetch_time : 2000;
				setTimeout( function() {
					fetch_answer( rez );
				}, time );
			} else if ( ! rez.error ) {
				var $field = $stt_button.data( 'linked-field' )
								? jQuery( '#' + $stt_button.data( 'linked-field' ) )
								: $stt_button.siblings( 'input[type="text"],textarea' ).eq(0);
				var value = $field.val();
				$field.val( ( value ? value + ' ' : '' ) + rez.data.text ).trigger( 'change' ).get(0).focus();
				$stt_button.removeClass( 'trx_addons_loading_icon' );
			} else {
				trx_addons_msgbox_warning( rez.error, TRX_ADDONS_STORAGE['msg_speech_to_text'] );
			}
		}
	} );

} );
