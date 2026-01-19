<?php
/**
 * The template to display the widgets area in the footer
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0.10
 */

// Footer sidebar
$pets_grooming_footer_name    = pets_grooming_get_theme_option( 'footer_widgets' );
$pets_grooming_footer_present = ! pets_grooming_is_off( $pets_grooming_footer_name ) && is_active_sidebar( $pets_grooming_footer_name );
if ( $pets_grooming_footer_present ) {
	pets_grooming_storage_set( 'current_sidebar', 'footer' );
	ob_start();
	if ( is_active_sidebar( $pets_grooming_footer_name ) ) {
		dynamic_sidebar( $pets_grooming_footer_name );
	}
	$pets_grooming_out = trim( ob_get_contents() );
	ob_end_clean();
	if ( ! empty( $pets_grooming_out ) ) {
		$pets_grooming_out          = preg_replace( "/<\\/aside>[\r\n\s]*<aside/", '</aside><aside', $pets_grooming_out );
		$pets_grooming_need_columns = true;   //or check: strpos($pets_grooming_out, 'columns_wrap')===false;
		if ( $pets_grooming_need_columns ) {
			$pets_grooming_columns = max( 0, (int) pets_grooming_get_theme_option( 'footer_columns' ) );			
			if ( 0 == $pets_grooming_columns ) {
				$pets_grooming_columns = min( 4, max( 1, pets_grooming_tags_count( $pets_grooming_out, 'aside' ) ) );
			}
			if ( $pets_grooming_columns > 1 ) {
				$pets_grooming_out = preg_replace( '/<aside([^>]*)class="widget/', '<aside$1class="column-1_' . esc_attr( $pets_grooming_columns ) . ' widget', $pets_grooming_out );
			} else {
				$pets_grooming_need_columns = false;
			}
		}
		?>
		<div class="footer_widgets_wrap widget_area sc_layouts_row">
			<?php do_action( 'pets_grooming_action_before_sidebar_wrap', 'footer' ); ?>
			<div class="footer_widgets_inner widget_area_inner">
				<div class="content_wrap">
					<?php
					if ( $pets_grooming_need_columns ) {
						?>
						<div class="columns_wrap">
						<?php
					}
					do_action( 'pets_grooming_action_before_sidebar', 'footer' );
					pets_grooming_show_layout( $pets_grooming_out );
					do_action( 'pets_grooming_action_after_sidebar', 'footer' );
					if ( $pets_grooming_need_columns ) {
						?>
						</div>
						<?php
					}
					?>
				</div>
			</div>
			<?php do_action( 'pets_grooming_action_after_sidebar_wrap', 'footer' ); ?>
		</div>
		<?php
	}
}
