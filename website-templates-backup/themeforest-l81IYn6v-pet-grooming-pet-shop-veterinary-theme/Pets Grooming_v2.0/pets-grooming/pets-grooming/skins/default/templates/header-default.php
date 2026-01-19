<?php
/**
 * The template to display default site header
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

$pets_grooming_header_css   = '';
$pets_grooming_header_image = get_header_image();
$pets_grooming_header_video = pets_grooming_get_header_video();
if ( ! empty( $pets_grooming_header_image ) && pets_grooming_trx_addons_featured_image_override( pets_grooming_is_singular() || pets_grooming_storage_isset( 'blog_archive' ) || is_category() ) ) {
	$pets_grooming_header_image = pets_grooming_get_current_mode_image( $pets_grooming_header_image );
}
?><header class="top_panel top_panel_default
	<?php
	echo ! empty( $pets_grooming_header_image ) || ! empty( $pets_grooming_header_video ) ? ' with_bg_image' : ' without_bg_image';
	if ( '' != $pets_grooming_header_video ) {
		echo ' with_bg_video';
	}
	if ( '' != $pets_grooming_header_image ) {
		echo ' ' . esc_attr( pets_grooming_add_inline_css_class( 'background-image: url(' . esc_url( $pets_grooming_header_image ) . ');' ) );
	}
	if ( pets_grooming_is_singular() && has_post_thumbnail() ) {
		echo ' with_featured_image';
	}
	?>
">
	<?php

	// Background video
	if ( ! empty( $pets_grooming_header_video ) ) {
		get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/header-video' ) );
	}

	// Main menu
	get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/header-navi' ) );

	// Page title and breadcrumbs area
	if ( ! pets_grooming_is_single() ) {
		get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/header-title' ) );
	}
	?>
</header>
