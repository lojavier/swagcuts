<?php
/**
 * Skin Demo importer
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.76.0
 */


// Theme storage
//-------------------------------------------------------------------------

pets_grooming_storage_set( 'theme_demo_url', '//pets-grooming.axiomthemes.com' );


//------------------------------------------------------------------------
// One-click import support
//------------------------------------------------------------------------

// Set theme specific importer options
if ( ! function_exists( 'pets_grooming_skin_importer_set_options' ) ) {
	add_filter( 'trx_addons_filter_importer_options', 'pets_grooming_skin_importer_set_options', 9 );
	function pets_grooming_skin_importer_set_options( $options = array() ) {
		if ( is_array( $options ) ) {
			$demo_type = function_exists( 'pets_grooming_skins_get_current_skin_name' ) ? pets_grooming_skins_get_current_skin_name() : 'default';
			if ( 'default' != $demo_type ) {
				$options['demo_type'] = $demo_type;
				$options['files'][ $demo_type ] = $options['files']['default'];	// Copy all settings from 'default' to the new demo type
				unset($options['files']['default']);
			}
			// Override some settings in the new demo type
			$theme_slug = get_template();
			$theme_name = wp_get_theme( $theme_slug )->get( 'Name' );
			$options['files'][ $demo_type ]['title'] = sprintf( esc_html__( '%s Demo', 'pets-grooming' ), $theme_name )
				. ( $demo_type != 'default'
					? '. ' . sprintf( esc_html__( 'Skin %s', 'pets-grooming' ), ucfirst( str_replace( array( '-', '_' ), ' ', $demo_type ) ) )
					: ''
					);
			$options['files'][ $demo_type ]['domain_dev']  = ''; // Developers domain, example: pets_grooming_add_protocol( '//pets-grooming.dev.themerex.net' ); 
			$options['files'][ $demo_type ]['domain_demo'] = pets_grooming_add_protocol( pets_grooming_storage_get( 'theme_demo_url' ) ); // Demo-site domain
		}
		return $options;
	}
}