<?php
/**
 * The Footer: widgets area, logo, footer menu and socials
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

							do_action( 'pets_grooming_action_page_content_end_text' );
							
							// Widgets area below the content
							pets_grooming_create_widgets_area( 'widgets_below_content' );
						
							do_action( 'pets_grooming_action_page_content_end' );
							?>
						</div>
						<?php
						
						do_action( 'pets_grooming_action_after_page_content' );

						// Show main sidebar
						get_sidebar();

						do_action( 'pets_grooming_action_content_wrap_end' );
						?>
					</div>
					<?php

					do_action( 'pets_grooming_action_after_content_wrap' );

					// Widgets area below the page and related posts below the page
					$pets_grooming_body_style = pets_grooming_get_theme_option( 'body_style' );
					$pets_grooming_widgets_name = pets_grooming_get_theme_option( 'widgets_below_page', 'hide' );
					$pets_grooming_show_widgets = ! pets_grooming_is_off( $pets_grooming_widgets_name ) && is_active_sidebar( $pets_grooming_widgets_name );
					$pets_grooming_show_related = pets_grooming_is_single() && pets_grooming_get_theme_option( 'related_position', 'below_content' ) == 'below_page';
					if ( $pets_grooming_show_widgets || $pets_grooming_show_related ) {
						if ( 'fullscreen' != $pets_grooming_body_style ) {
							?>
							<div class="content_wrap">
							<?php
						}
						// Show related posts before footer
						if ( $pets_grooming_show_related ) {
							do_action( 'pets_grooming_action_related_posts' );
						}

						// Widgets area below page content
						if ( $pets_grooming_show_widgets ) {
							pets_grooming_create_widgets_area( 'widgets_below_page' );
						}
						if ( 'fullscreen' != $pets_grooming_body_style ) {
							?>
							</div>
							<?php
						}
					}
					do_action( 'pets_grooming_action_page_content_wrap_end' );
					?>
			</div>
			<?php
			do_action( 'pets_grooming_action_after_page_content_wrap' );

			// Don't display the footer elements while actions 'full_post_loading' and 'prev_post_loading'
			if ( ( ! pets_grooming_is_singular( 'post' ) && ! pets_grooming_is_singular( 'attachment' ) ) || ! in_array ( pets_grooming_get_value_gp( 'action' ), array( 'full_post_loading', 'prev_post_loading' ) ) ) {
				
				// Skip link anchor to fast access to the footer from keyboard
				?>
				<span id="footer_skip_link_anchor" class="pets_grooming_skip_link_anchor"></span>
				<?php

				do_action( 'pets_grooming_action_before_footer' );

				// Footer
				$pets_grooming_footer_type = pets_grooming_get_theme_option( 'footer_type' );
				if ( 'custom' == $pets_grooming_footer_type && ! pets_grooming_is_layouts_available() ) {
					$pets_grooming_footer_type = 'default';
				}
				get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', "templates/footer-" . sanitize_file_name( $pets_grooming_footer_type ) ) );

				do_action( 'pets_grooming_action_after_footer' );

			}
			?>

			<?php do_action( 'pets_grooming_action_page_wrap_end' ); ?>

		</div>

		<?php do_action( 'pets_grooming_action_after_page_wrap' ); ?>

	</div>

	<?php do_action( 'pets_grooming_action_after_body' ); ?>

	<?php wp_footer(); ?>

</body>
</html>