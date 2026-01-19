<?php
// Add theme-specific CSS-animations
if ( ! function_exists( 'pets_grooming_elm_add_theme_animations' ) ) {
	add_filter( 'elementor/controls/animations/additional_animations', 'pets_grooming_elm_add_theme_animations' );
	function pets_grooming_elm_add_theme_animations( $animations ) {
		/* To add a theme-specific animations to the list:
			1) Merge to the array 'animations': array(
													esc_html__( 'Theme Specific', 'pets-grooming' ) => array(
														'ta_custom_1' => esc_html__( 'Custom 1', 'pets-grooming' )
													)
												)
			2) Add a CSS rules for the class '.ta_custom_1' to create a custom entrance animation
		*/
		$animations = array_merge(
						$animations,
						array(
							esc_html__( 'Theme Specific', 'pets-grooming' ) => array(
																			'ta_fadeinup' 		=> esc_html__( 'Fade In Up (Short)', 'pets-grooming' ),
																			'ta_fadeinright'	=> esc_html__( 'Fade In Right (Short)', 'pets-grooming' ),
																			'ta_fadeinleft'		=> esc_html__( 'Fade In Left (Short)', 'pets-grooming' ),
																			'ta_fadeindown'		=> esc_html__( 'Fade In Down (Short)', 'pets-grooming' ),
																			'ta_fadein' 		=> esc_html__( 'Fade In (Short)', 'pets-grooming' ),
																			'ta_popup' 			=> esc_html__( 'Pop Up', 'pets-grooming' ),
																			'ta_infiniterotate' => esc_html__( 'Infinite Rotate', 'pets-grooming' ),
																			)
							)
						);
		return $animations;
	}
}
