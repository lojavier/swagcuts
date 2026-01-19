<?php
/**
 * The template to display the logo or the site name and the slogan in the Header
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

$pets_grooming_args = get_query_var( 'pets_grooming_logo_args' );

// Site logo
$pets_grooming_logo_type   = isset( $pets_grooming_args['type'] ) ? $pets_grooming_args['type'] : '';
$pets_grooming_logo_image  = pets_grooming_get_logo_image( $pets_grooming_logo_type );
$pets_grooming_logo_text   = pets_grooming_is_on( pets_grooming_get_theme_option( 'logo_text' ) ) ? get_bloginfo( 'name' ) : '';
$pets_grooming_logo_slogan = get_bloginfo( 'description', 'display' );
if ( ! empty( $pets_grooming_logo_image['logo'] ) || ! empty( $pets_grooming_logo_text ) ) {
	?><a class="sc_layouts_logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
		<?php
		if ( ! empty( $pets_grooming_logo_image['logo'] ) ) {
			if ( empty( $pets_grooming_logo_type ) && function_exists( 'the_custom_logo' ) && is_numeric( $pets_grooming_logo_image['logo'] ) && (int) $pets_grooming_logo_image['logo'] > 0 ) {
				the_custom_logo();
			} else {
				$pets_grooming_attr = pets_grooming_getimagesize( $pets_grooming_logo_image['logo'] );
				echo '<img src="' . esc_url( $pets_grooming_logo_image['logo'] ) . '"'
						. ( ! empty( $pets_grooming_logo_image['logo_retina'] ) ? ' srcset="' . esc_url( $pets_grooming_logo_image['logo_retina'] ) . ' 2x"' : '' )
						. ' alt="' . esc_attr( $pets_grooming_logo_text ) . '"'
						. ( ! empty( $pets_grooming_attr[3] ) ? ' ' . wp_kses_data( $pets_grooming_attr[3] ) : '' )
						. '>';
			}
		} else {
			pets_grooming_show_layout( pets_grooming_prepare_macros( $pets_grooming_logo_text ), '<span class="logo_text">', '</span>' );
			pets_grooming_show_layout( pets_grooming_prepare_macros( $pets_grooming_logo_slogan ), '<span class="logo_slogan">', '</span>' );
		}
		?>
	</a>
	<?php
}
