<?php
/* MetForm support functions
------------------------------------------------------------------------------- */

// Theme init priorities:
// 9 - register other filters (for installer, etc.)
if ( ! function_exists( 'pets_grooming_metform_theme_setup9' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_metform_theme_setup9', 9 );
	function pets_grooming_metform_theme_setup9() {
		if ( is_admin() ) {
			add_filter( 'pets_grooming_filter_tgmpa_required_plugins', 'pets_grooming_metform_tgmpa_required_plugins' );
			add_filter( 'pets_grooming_filter_theme_plugins', 'pets_grooming_metform_theme_plugins' );
		}
	}
}

// Filter to add in the required plugins list
if ( ! function_exists( 'pets_grooming_metform_tgmpa_required_plugins' ) ) {
	//Handler of the add_filter('pets_grooming_filter_tgmpa_required_plugins',	'pets_grooming_metform_tgmpa_required_plugins');
	function pets_grooming_metform_tgmpa_required_plugins( $list = array() ) {
		if ( pets_grooming_storage_isset( 'required_plugins', 'metform' ) && pets_grooming_storage_get_array( 'required_plugins', 'metform', 'install' ) !== false ) {
			$list[] = array(
				'name'     => pets_grooming_storage_get_array( 'required_plugins', 'metform', 'title' ),
				'slug'     => 'metform',
				'required' => false,
			);
		}
		return $list;
	}
}

// Filter theme-supported plugins list
if ( ! function_exists( 'pets_grooming_metform_theme_plugins' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_theme_plugins', 'pets_grooming_metform_theme_plugins' );
	function pets_grooming_metform_theme_plugins( $list = array() ) {
		return pets_grooming_add_group_and_logo_to_slave( $list, 'metform', 'metform-' );
	}
}



// Check if a plugin is installed and activated
if ( ! function_exists( 'pets_grooming_exists_metform' ) ) {
	function pets_grooming_exists_metform() {
		return class_exists( 'MetForm\Plugin' );
	}
}
