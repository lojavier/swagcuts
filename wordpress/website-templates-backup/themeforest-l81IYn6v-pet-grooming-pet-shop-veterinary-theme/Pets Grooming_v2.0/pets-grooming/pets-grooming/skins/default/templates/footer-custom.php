<?php
/**
 * The template to display default site footer
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.10
 */

$pets_grooming_footer_id = pets_grooming_get_custom_footer_id();
$pets_grooming_footer_meta = pets_grooming_get_custom_layout_meta( $pets_grooming_footer_id );
if ( ! empty( $pets_grooming_footer_meta['margin'] ) ) {
	pets_grooming_add_inline_css( sprintf( '.page_content_wrap{padding-bottom:%s}', esc_attr( pets_grooming_prepare_css_value( $pets_grooming_footer_meta['margin'] ) ) ) );
}
?>
<footer class="footer_wrap footer_custom footer_custom_<?php echo esc_attr( $pets_grooming_footer_id ); ?> footer_custom_<?php echo esc_attr( sanitize_title( get_the_title( $pets_grooming_footer_id ) ) ); ?>">
	<?php
	// Custom footer's layout
	do_action( 'pets_grooming_action_show_layout', $pets_grooming_footer_id );
	?>
</footer>