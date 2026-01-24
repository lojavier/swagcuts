<?php
/**
 * The Header: Logo and main menu
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js<?php
	// Class scheme_xxx need in the <html> as context for the <body>!
	echo ' scheme_' . esc_attr( pets_grooming_get_theme_option( 'color_scheme' ) );
?>">

<head>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<?php
	if ( function_exists( 'wp_body_open' ) ) {
		wp_body_open();
	} else {
		do_action( 'wp_body_open' );
	}
	do_action( 'pets_grooming_action_before_body' );
	?>

	<div class="<?php echo esc_attr( apply_filters( 'pets_grooming_filter_body_wrap_class', 'body_wrap' ) ); ?>" <?php do_action('pets_grooming_action_body_wrap_attributes'); ?>>

		<?php do_action( 'pets_grooming_action_before_page_wrap' ); ?>

		<div class="<?php echo esc_attr( apply_filters( 'pets_grooming_filter_page_wrap_class', 'page_wrap' ) ); ?>" <?php do_action('pets_grooming_action_page_wrap_attributes'); ?>>

			<?php do_action( 'pets_grooming_action_page_wrap_start' ); ?>

			<?php
			$pets_grooming_full_post_loading = ( pets_grooming_is_singular( 'post' ) || pets_grooming_is_singular( 'attachment' ) ) && pets_grooming_get_value_gp( 'action' ) == 'full_post_loading';
			$pets_grooming_prev_post_loading = ( pets_grooming_is_singular( 'post' ) || pets_grooming_is_singular( 'attachment' ) ) && pets_grooming_get_value_gp( 'action' ) == 'prev_post_loading';

			// Don't display the header elements while actions 'full_post_loading' and 'prev_post_loading'
			if ( ! $pets_grooming_full_post_loading && ! $pets_grooming_prev_post_loading ) {

				// Short links to fast access to the content, sidebar and footer from the keyboard
				?>
				<a class="pets_grooming_skip_link skip_to_content_link" href="#content_skip_link_anchor" tabindex="<?php echo esc_attr( apply_filters( 'pets_grooming_filter_skip_links_tabindex', 0 ) ); ?>"><?php esc_html_e( "Skip to content", 'pets-grooming' ); ?></a>
				<?php if ( pets_grooming_sidebar_present() ) { ?>
				<a class="pets_grooming_skip_link skip_to_sidebar_link" href="#sidebar_skip_link_anchor" tabindex="<?php echo esc_attr( apply_filters( 'pets_grooming_filter_skip_links_tabindex', 0 ) ); ?>"><?php esc_html_e( "Skip to sidebar", 'pets-grooming' ); ?></a>
				<?php } ?>
				<a class="pets_grooming_skip_link skip_to_footer_link" href="#footer_skip_link_anchor" tabindex="<?php echo esc_attr( apply_filters( 'pets_grooming_filter_skip_links_tabindex', 0 ) ); ?>"><?php esc_html_e( "Skip to footer", 'pets-grooming' ); ?></a>

				<?php
				do_action( 'pets_grooming_action_before_header' );

				// Header
				$pets_grooming_header_type = pets_grooming_get_theme_option( 'header_type' );
				if ( 'custom' == $pets_grooming_header_type && ! pets_grooming_is_layouts_available() ) {
					$pets_grooming_header_type = 'default';
				}
				get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', "templates/header-" . sanitize_file_name( $pets_grooming_header_type ) ) );

				// Side menu
				if ( in_array( pets_grooming_get_theme_option( 'menu_side', 'none' ), array( 'left', 'right' ) ) ) {
					get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/header-navi-side' ) );
				}

				// Mobile menu
				if ( apply_filters( 'pets_grooming_filter_use_navi_mobile', pets_grooming_sc_layouts_showed( 'menu_button' ) || $pets_grooming_header_type == 'default' ) ) {
					get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/header-navi-mobile' ) );
				}

				do_action( 'pets_grooming_action_after_header' );

			}
			?>

			<?php do_action( 'pets_grooming_action_before_page_content_wrap' ); ?>

			<div class="page_content_wrap<?php
				if ( pets_grooming_is_off( pets_grooming_get_theme_option( 'remove_margins' ) ) ) {
					if ( empty( $pets_grooming_header_type ) ) {
						$pets_grooming_header_type = pets_grooming_get_theme_option( 'header_type' );
					}
					if ( 'custom' == $pets_grooming_header_type && pets_grooming_is_layouts_available() ) {
						$pets_grooming_header_id = pets_grooming_get_custom_header_id();
						if ( $pets_grooming_header_id > 0 ) {
							$pets_grooming_header_meta = pets_grooming_get_custom_layout_meta( $pets_grooming_header_id );
							if ( ! empty( $pets_grooming_header_meta['margin'] ) ) {
								?> page_content_wrap_custom_header_margin<?php
							}
						}
					}
					$pets_grooming_footer_type = pets_grooming_get_theme_option( 'footer_type' );
					if ( 'custom' == $pets_grooming_footer_type && pets_grooming_is_layouts_available() ) {
						$pets_grooming_footer_id = pets_grooming_get_custom_footer_id();
						if ( $pets_grooming_footer_id ) {
							$pets_grooming_footer_meta = pets_grooming_get_custom_layout_meta( $pets_grooming_footer_id );
							if ( ! empty( $pets_grooming_footer_meta['margin'] ) ) {
								?> page_content_wrap_custom_footer_margin<?php
							}
						}
					}
				}
				do_action( 'pets_grooming_action_page_content_wrap_class', $pets_grooming_prev_post_loading );
				?>"<?php
				if ( apply_filters( 'pets_grooming_filter_is_prev_post_loading', $pets_grooming_prev_post_loading ) ) {
					?> data-single-style="<?php echo esc_attr( pets_grooming_get_theme_option( 'single_style' ) ); ?>"<?php
				}
				do_action( 'pets_grooming_action_page_content_wrap_data', $pets_grooming_prev_post_loading );
			?>>
				<?php
				do_action( 'pets_grooming_action_page_content_wrap', $pets_grooming_full_post_loading || $pets_grooming_prev_post_loading );

				// Single posts banner
				if ( apply_filters( 'pets_grooming_filter_single_post_header', pets_grooming_is_singular( 'post' ) || pets_grooming_is_singular( 'attachment' ) ) ) {
					if ( $pets_grooming_prev_post_loading ) {
						if ( pets_grooming_get_theme_option( 'posts_navigation_scroll_which_block', 'article' ) != 'article' ) {
							do_action( 'pets_grooming_action_between_posts' );
						}
					}
					// Single post thumbnail and title
					$pets_grooming_path = apply_filters( 'pets_grooming_filter_get_template_part', 'templates/single-styles/' . pets_grooming_get_theme_option( 'single_style' ) );
					if ( pets_grooming_get_file_dir( $pets_grooming_path . '.php' ) != '' ) {
						get_template_part( $pets_grooming_path );
					}
				}

				// Widgets area above page
				$pets_grooming_body_style   = pets_grooming_get_theme_option( 'body_style' );
				$pets_grooming_widgets_name = pets_grooming_get_theme_option( 'widgets_above_page', 'hide' );
				$pets_grooming_show_widgets = ! pets_grooming_is_off( $pets_grooming_widgets_name ) && is_active_sidebar( $pets_grooming_widgets_name );
				if ( $pets_grooming_show_widgets ) {
					if ( 'fullscreen' != $pets_grooming_body_style ) {
						?>
						<div class="content_wrap">
							<?php
					}
					pets_grooming_create_widgets_area( 'widgets_above_page' );
					if ( 'fullscreen' != $pets_grooming_body_style ) {
						?>
						</div>
						<?php
					}
				}

				// Content area
				do_action( 'pets_grooming_action_before_content_wrap' );
				?>
				<div class="content_wrap<?php echo 'fullscreen' == $pets_grooming_body_style ? '_fullscreen' : ''; ?>">

					<?php do_action( 'pets_grooming_action_content_wrap_start' ); ?>

					<div class="content">
						<?php
						do_action( 'pets_grooming_action_page_content_start' );

						// Skip link anchor to fast access to the content from keyboard
						?>
						<span id="content_skip_link_anchor" class="pets_grooming_skip_link_anchor"></span>
						<?php
						// Single posts banner between prev/next posts
						if ( ( pets_grooming_is_singular( 'post' ) || pets_grooming_is_singular( 'attachment' ) )
							&& $pets_grooming_prev_post_loading 
							&& pets_grooming_get_theme_option( 'posts_navigation_scroll_which_block', 'article' ) == 'article'
						) {
							do_action( 'pets_grooming_action_between_posts' );
						}

						// Widgets area above content
						pets_grooming_create_widgets_area( 'widgets_above_content' );

						do_action( 'pets_grooming_action_page_content_start_text' );
