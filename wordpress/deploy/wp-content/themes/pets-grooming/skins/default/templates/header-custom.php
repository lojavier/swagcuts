<?php
/**
 * The template to display custom header from the ThemeREX Addons Layouts
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.06
 */

$pets_grooming_header_css   = '';
$pets_grooming_header_image = get_header_image();
if ( ! empty( $pets_grooming_header_image ) && pets_grooming_trx_addons_featured_image_override( pets_grooming_is_singular() || pets_grooming_storage_isset( 'blog_archive' ) || is_category() ) ) {
	$pets_grooming_header_image = pets_grooming_get_current_mode_image( $pets_grooming_header_image );
}

$pets_grooming_header_id = pets_grooming_get_custom_header_id();
$pets_grooming_header_meta = pets_grooming_get_custom_layout_meta( $pets_grooming_header_id );
if ( ! empty( $pets_grooming_header_meta['margin'] ) ) {
	pets_grooming_add_inline_css( sprintf( '.page_content_wrap{padding-top:%s}', esc_attr( pets_grooming_prepare_css_value( $pets_grooming_header_meta['margin'] ) ) ) );
	pets_grooming_storage_set( 'custom_header_margin', pets_grooming_prepare_css_value( $pets_grooming_header_meta['margin'] ) );
}

?><header class="top_panel top_panel_custom top_panel_custom_<?php echo esc_attr( $pets_grooming_header_id ); ?> top_panel_custom_<?php echo esc_attr( sanitize_title( get_the_title( $pets_grooming_header_id ) ) ); ?>
				<?php
				echo ! empty( $pets_grooming_header_image )
					? ' with_bg_image'
					: ' without_bg_image';
				if ( '' != $pets_grooming_header_image ) {
					echo ' ' . esc_attr( pets_grooming_add_inline_css_class( 'background-image: url(' . esc_url( $pets_grooming_header_image ) . ');' ) );
				}
				if ( pets_grooming_is_single() && has_post_thumbnail() ) {
					echo ' with_featured_image';
				}
				?>
">
	<?php

	// Custom header's layout
	do_action( 'pets_grooming_action_show_layout', $pets_grooming_header_id );

	?>
</header>
