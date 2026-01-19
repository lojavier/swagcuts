<?php
/**
 * Required plugins
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.76.0
 */

// THEME-SUPPORTED PLUGINS
// If plugin not need - remove its settings from next array
//----------------------------------------------------------
if ( ! function_exists( 'pets_grooming_skin_required_plugins' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_skin_required_plugins', -1 );
	function pets_grooming_skin_required_plugins() {
		$pets_grooming_theme_required_plugins_groups = array(
			'core'          => esc_html__( 'Core', 'pets-grooming' ),
			'page_builders' => esc_html__( 'Page Builders', 'pets-grooming' ),
			'ecommerce'     => esc_html__( 'E-Commerce & Donations', 'pets-grooming' ),
			'socials'       => esc_html__( 'Socials and Communities', 'pets-grooming' ),
			'events'        => esc_html__( 'Events and Appointments', 'pets-grooming' ),
			'content'       => esc_html__( 'Content', 'pets-grooming' ),
			'other'         => esc_html__( 'Other', 'pets-grooming' ),
		);
		$pets_grooming_theme_required_plugins        = array(
			// Core
			'trx_addons'                 => array(
				'title'       => esc_html__( 'ThemeREX Addons', 'pets-grooming' ),
				'description' => esc_html__( "Will allow you to install recommended plugins, demo content, and improve the theme's functionality overall with multiple theme options", 'pets-grooming' ),
				'required'    => true, // Check this plugin in the list on load Theme Dashboard
				'logo'        => 'trx_addons.png',
				'group'       => $pets_grooming_theme_required_plugins_groups['core'],
			),
			// Page Builders
			'elementor'                  => array(
				'title'       => esc_html__( 'Elementor', 'pets-grooming' ),
				'description' => esc_html__( "Is a beautiful PageBuilder, even the free version of which allows you to create great pages using a variety of modules.", 'pets-grooming' ),
				'required'    => false, // Leave this plugin unchecked on load Theme Dashboard
				'logo'        => 'elementor.png',
				'group'       => $pets_grooming_theme_required_plugins_groups['page_builders'],
			),
			'gutenberg'                  => array(
				'title'       => esc_html__( 'Gutenberg', 'pets-grooming' ),
				'description' => esc_html__( "It's a posts editor coming in place of the classic TinyMCE. Can be installed and used in parallel with Elementor", 'pets-grooming' ),
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => 'gutenberg.png',
				'group'       => $pets_grooming_theme_required_plugins_groups['page_builders'],
			),
			// Content
			'sitepress-multilingual-cms' => array(
				'title'       => esc_html__( 'WPML - Sitepress Multilingual CMS', 'pets-grooming' ),
				'description' => esc_html__( "Allows you to make your website multilingual", 'pets-grooming' ),
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => 'sitepress-multilingual-cms.png',
				'group'       => $pets_grooming_theme_required_plugins_groups['content'],
			),
			'metform'                    => array(
				'title'       => esc_html__( 'MetForm', 'pets-grooming' ),
				'description' => esc_html__( "Contact Form, Survey, Quiz, & Custom Form Builder for Elementor", 'pets-grooming' ),
				'required'    => false,
				'logo'        => 'metform.png',
				'group'       => $pets_grooming_theme_required_plugins_groups['content'],
			),
			'woocommerce'                => array(
				'title'       => esc_html__( 'WooCommerce', 'pets-grooming' ),
				'description' => esc_html__( "Connect the store to your website and start selling now", 'pets-grooming' ),
				'required'    => false,
				'logo'        => 'woocommerce.png',
				'group'       => $pets_grooming_theme_required_plugins_groups['ecommerce'],
			),
			// Other
			'trx_updater'                => array(
				'title'       => esc_html__( 'ThemeREX Updater', 'pets-grooming' ),
				'description' => esc_html__( "Update theme and theme-specific plugins from developer's upgrade server.", 'pets-grooming' ),
				'required'    => false,
				'logo'        => 'trx_updater.png',
				'group'       => $pets_grooming_theme_required_plugins_groups['other'],
			)
		);

		if ( PETS_GROOMING_THEME_FREE ) {
			unset( $pets_grooming_theme_required_plugins['sitepress-multilingual-cms'] );
			unset( $pets_grooming_theme_required_plugins['trx_updater'] );
		}

		// Add plugins list to the global storage
		pets_grooming_storage_set( 'required_plugins', $pets_grooming_theme_required_plugins );
	}
}
