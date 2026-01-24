<?php
/**
 * Generate custom CSS for theme hovers
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

// Theme init priorities:
// 3 - add/remove Theme Options elements
if ( ! function_exists( 'pets_grooming_hovers_theme_setup3' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_hovers_theme_setup3', 3 );
	function pets_grooming_hovers_theme_setup3() {
		// Add 'Image hover' option
		pets_grooming_storage_set_array_after(
			'options', 'general_misc_info', array(
				'image_hover'  => array(
					'title'    => esc_html__( "Image hover", 'pets-grooming' ),
					'desc'     => wp_kses_data( __( 'Select a hover effect for theme images', 'pets-grooming' ) ),
					'std'      => 'default',
					'options'  => pets_grooming_get_list_hovers(),
					'type'     => 'select',
				),
			)
		);
	}
}

// Theme init priorities:
// 9 - register other filters (for installer, etc.)
if ( ! function_exists( 'pets_grooming_hovers_theme_setup9' ) ) {
	add_action( 'after_setup_theme', 'pets_grooming_hovers_theme_setup9', 9 );
	function pets_grooming_hovers_theme_setup9() {
		add_action( 'wp_enqueue_scripts', 'pets_grooming_hovers_frontend_styles', 1100 );       // Priority 1100 -  after theme/skin styles (1050)
		add_filter( 'pets_grooming_filter_merge_styles', 'pets_grooming_hovers_merge_styles' );
		add_action( 'pets_grooming_action_add_hover_icons','pets_grooming_hovers_add_icons', 10, 2 );
	}
}

// Enqueue styles for frontend
if ( ! function_exists( 'pets_grooming_hovers_frontend_styles' ) ) {
	//Handler of the add_action( 'wp_enqueue_scripts', 'pets_grooming_hovers_frontend_styles', 1100 );
	function pets_grooming_hovers_frontend_styles() {
		if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'debug_mode' ) ) ) {
			$pets_grooming_url = pets_grooming_get_file_url( 'theme-specific/theme-hovers/theme-hovers.css' );
			if ( '' != $pets_grooming_url ) {
				wp_enqueue_style( 'pets-grooming-hovers', $pets_grooming_url, array(), null );
			}
		}
	}
}

// Merge hover effects into single css
if ( ! function_exists( 'pets_grooming_hovers_merge_styles' ) ) {
	//Handler of the add_filter( 'pets_grooming_filter_merge_styles', 'pets_grooming_hovers_merge_styles' );
	function pets_grooming_hovers_merge_styles( $list ) {
		$list[ 'theme-specific/theme-hovers/theme-hovers.css' ] = true;
		return $list;
	}
}

// Add hover icons on the featured image
if ( ! function_exists( 'pets_grooming_hovers_add_icons' ) ) {
	//Handler of the add_action( 'pets_grooming_action_add_hover_icons','pets_grooming_hovers_add_icons', 10, 2 );
	function pets_grooming_hovers_add_icons( $hover, $args = array() ) {

		// Additional parameters
		$args = array_merge(
			array(
				'cat'        => '',
				'image'      => null,
				'no_links'   => false,
				'link'       => '',
				'post_info'  => '',
				'meta_parts' => ''
			), $args
		);

		$post_link = empty( $args['no_links'] )
						? ( ! empty( $args['link'] )
							? $args['link']
							: apply_filters( 'pets_grooming_filter_get_post_link', get_permalink() )
							)
						: '';
		$no_link   = 'javascript:void(0)';
		$target    = ! empty( $post_link ) && pets_grooming_is_external_url( $post_link ) && function_exists( 'pets_grooming_external_links_target' ) ? pets_grooming_external_links_target() : '';

		if ( 'default' == $hover ) {
			// Hover style 'Default'
			if ( ! empty( $args['post_info'] ) ) {
				pets_grooming_show_layout( $args['post_info'] );
			}
			?>
			<a href="<?php echo ! empty( $post_link ) ? esc_url( $post_link ) : $no_link; ?>" <?php pets_grooming_show_layout( $target ); ?> aria-hidden="true" class="cover-link"></a>
			<?php

		} elseif ( 'dots' == $hover ) {
			// Hover style 'Dots'
			if ( ! empty( $args['post_info'] ) ) {
				pets_grooming_show_layout( $args['post_info'] );
			}
			?>
			<a href="<?php echo ! empty( $post_link ) ? esc_url( $post_link ) : $no_link; ?>" <?php pets_grooming_show_layout( $target ); ?> aria-hidden="true" class="icons"><span></span><span></span><span></span></a>
			<?php

		} else {

			do_action( 'pets_grooming_action_custom_hover_icons', $args, $hover );

			if ( ! empty( $args['post_info'] ) ) {
				pets_grooming_show_layout( $args['post_info'] );
			}
			if ( ! empty( $post_link ) ) {
				?>
				<a href="<?php echo esc_url( $post_link ); ?>" <?php pets_grooming_show_layout( $target ); ?> aria-hidden="true" class="icons"></a>
				<?php
			}
		}
	}
}
