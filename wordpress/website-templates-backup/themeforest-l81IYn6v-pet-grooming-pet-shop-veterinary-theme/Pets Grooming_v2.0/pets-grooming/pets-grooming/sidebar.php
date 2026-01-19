<?php
/**
 * The Sidebar containing the main widget areas.
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

if ( pets_grooming_sidebar_present() ) {
	
	$pets_grooming_sidebar_type = pets_grooming_get_theme_option( 'sidebar_type' );
	if ( 'custom' == $pets_grooming_sidebar_type && ! pets_grooming_is_layouts_available() ) {
		$pets_grooming_sidebar_type = 'default';
	}
	
	// Catch output to the buffer
	ob_start();
	if ( 'default' == $pets_grooming_sidebar_type ) {
		// Default sidebar with widgets
		$pets_grooming_sidebar_name = pets_grooming_get_theme_option( 'sidebar_widgets' );
		pets_grooming_storage_set( 'current_sidebar', 'sidebar' );
		if ( is_active_sidebar( $pets_grooming_sidebar_name ) ) {
			dynamic_sidebar( $pets_grooming_sidebar_name );
		}
	} else {
		// Custom sidebar from Layouts Builder
		$pets_grooming_sidebar_id = pets_grooming_get_custom_sidebar_id();
		do_action( 'pets_grooming_action_show_layout', $pets_grooming_sidebar_id );
	}
	$pets_grooming_out = trim( ob_get_contents() );
	ob_end_clean();
	
	// If any html is present - display it
	if ( ! empty( $pets_grooming_out ) ) {
		$pets_grooming_sidebar_position    = pets_grooming_get_theme_option( 'sidebar_position' );
		$pets_grooming_sidebar_position_ss = pets_grooming_get_theme_option( 'sidebar_position_ss', 'below' );
		?>
		<div class="sidebar widget_area
			<?php
			echo ' ' . esc_attr( $pets_grooming_sidebar_position );
			echo ' sidebar_' . esc_attr( $pets_grooming_sidebar_position_ss );
			echo ' sidebar_' . esc_attr( $pets_grooming_sidebar_type );

			$pets_grooming_sidebar_scheme = apply_filters( 'pets_grooming_filter_sidebar_scheme', pets_grooming_get_theme_option( 'sidebar_scheme', 'inherit' ) );
			if ( ! empty( $pets_grooming_sidebar_scheme ) && ! pets_grooming_is_inherit( $pets_grooming_sidebar_scheme ) && 'custom' != $pets_grooming_sidebar_type ) {
				echo ' scheme_' . esc_attr( $pets_grooming_sidebar_scheme );
			}
			?>
		" role="complementary">
			<?php

			// Skip link anchor to fast access to the sidebar from keyboard
			?>
			<span id="sidebar_skip_link_anchor" class="pets_grooming_skip_link_anchor"></span>
			<?php

			do_action( 'pets_grooming_action_before_sidebar_wrap', 'sidebar' );

			// Button to show/hide sidebar on mobile
			if ( in_array( $pets_grooming_sidebar_position_ss, array( 'above', 'float' ) ) ) {
				$pets_grooming_title = apply_filters( 'pets_grooming_filter_sidebar_control_title', 'float' == $pets_grooming_sidebar_position_ss ? esc_html__( 'Show Sidebar', 'pets-grooming' ) : '' );
				$pets_grooming_text  = apply_filters( 'pets_grooming_filter_sidebar_control_text', 'above' == $pets_grooming_sidebar_position_ss ? esc_html__( 'Show Sidebar', 'pets-grooming' ) : '' );
				?>
				<a href="#" role="button" class="sidebar_control" title="<?php echo esc_attr( $pets_grooming_title ); ?>"><?php echo esc_html( $pets_grooming_text ); ?></a>
				<?php
			}
			?>
			<div class="sidebar_inner">
				<?php
				do_action( 'pets_grooming_action_before_sidebar', 'sidebar' );
				pets_grooming_show_layout( preg_replace( "/<\/aside>[\r\n\s]*<aside/", '</aside><aside', $pets_grooming_out ) );
				do_action( 'pets_grooming_action_after_sidebar', 'sidebar' );
				?>
			</div>
			<?php

			do_action( 'pets_grooming_action_after_sidebar_wrap', 'sidebar' );

			?>
		</div>
		<div class="clearfix"></div>
		<?php
	}
}
