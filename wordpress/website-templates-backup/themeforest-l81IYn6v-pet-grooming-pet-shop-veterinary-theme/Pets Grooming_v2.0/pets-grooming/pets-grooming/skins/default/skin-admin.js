/* global jQuery, PETS_GROOMING_STORAGE */

( function() {
	"use strict";

	// Disable a "Title, Description, Link" parameters in out shortcodes
	pets_grooming_add_filter( 'trx_addons_filter_add_title_param', function( allow, sc ) {
		return false;
	} );

} )();