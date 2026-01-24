<?php
/**
 * The Front Page template file.
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.31
 */

get_header();

// If front-page is a static page
if ( get_option( 'show_on_front' ) == 'page' ) {

	// If Front Page Builder is enabled - display sections
	if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'front_page_enabled', false ) ) ) {

		if ( have_posts() ) {
			the_post();
		}

		$pets_grooming_sections = pets_grooming_array_get_keys_by_value( pets_grooming_get_theme_option( 'front_page_sections' ) );
		if ( is_array( $pets_grooming_sections ) ) {
			foreach ( $pets_grooming_sections as $pets_grooming_section ) {
				get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'front-page/section', $pets_grooming_section ), $pets_grooming_section );
			}
		}

		// Else if this page is a blog archive
	} elseif ( is_page_template( 'blog.php' ) ) {
		get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'blog' ) );

		// Else - display a native page content
	} else {
		get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'page' ) );
	}

	// Else get the template 'index.php' to show posts
} else {
	get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'index' ) );
}

get_footer();
