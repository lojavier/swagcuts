<?php
/**
 * The template to display the page title and breadcrumbs
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

// Page (category, tag, archive, author) title

if ( pets_grooming_need_page_title() ) {
	pets_grooming_sc_layouts_showed( 'title', true );
	?>
	<div class="top_panel_title sc_layouts_row">
		<div class="content_wrap">
			<div class="sc_layouts_column sc_layouts_column_align_center">
				<div class="sc_layouts_item">
					<div class="sc_layouts_title sc_align_center">
						<?php
						// Blog/Page title
						?>
						<div class="sc_layouts_title_title">
							<?php
							$pets_grooming_blog_title           = pets_grooming_get_blog_title();
							$pets_grooming_blog_title_text      = '';
							$pets_grooming_blog_title_class     = '';
							$pets_grooming_blog_title_link      = '';
							$pets_grooming_blog_title_link_text = '';
							if ( is_array( $pets_grooming_blog_title ) ) {
								$pets_grooming_blog_title_text      = $pets_grooming_blog_title['text'];
								$pets_grooming_blog_title_class     = ! empty( $pets_grooming_blog_title['class'] ) ? ' ' . $pets_grooming_blog_title['class'] : '';
								$pets_grooming_blog_title_link      = ! empty( $pets_grooming_blog_title['link'] ) ? $pets_grooming_blog_title['link'] : '';
								$pets_grooming_blog_title_link_text = ! empty( $pets_grooming_blog_title['link_text'] ) ? $pets_grooming_blog_title['link_text'] : '';
							} else {
								$pets_grooming_blog_title_text = $pets_grooming_blog_title;
							}
							?>
							<h1 class="sc_layouts_title_caption<?php echo esc_attr( $pets_grooming_blog_title_class ); ?>"<?php
								if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
									?> itemprop="headline"<?php
								}
							?>>
								<?php
								$pets_grooming_top_icon = pets_grooming_get_term_image_small();
								if ( ! empty( $pets_grooming_top_icon ) ) {
									$pets_grooming_attr = pets_grooming_getimagesize( $pets_grooming_top_icon );
									?>
									<img src="<?php echo esc_url( $pets_grooming_top_icon ); ?>" alt="<?php esc_attr_e( 'Site icon', 'pets-grooming' ); ?>"
										<?php
										if ( ! empty( $pets_grooming_attr[3] ) ) {
											pets_grooming_show_layout( $pets_grooming_attr[3] );
										}
										?>
									>
									<?php
								}
								echo wp_kses_data( $pets_grooming_blog_title_text );
								?>
							</h1>
							<?php
							if ( ! empty( $pets_grooming_blog_title_link ) && ! empty( $pets_grooming_blog_title_link_text ) ) {
								?>
								<a href="<?php echo esc_url( $pets_grooming_blog_title_link ); ?>" class="theme_button sc_layouts_title_link"><?php echo esc_html( $pets_grooming_blog_title_link_text ); ?></a>
								<?php
							}

							// Category/Tag description
							if ( ! is_paged() && ( is_category() || is_tag() || is_tax() ) ) {
								the_archive_description( '<div class="sc_layouts_title_description">', '</div>' );
							}

							?>
						</div>
						<?php

						// Breadcrumbs
						ob_start();
						do_action( 'pets_grooming_action_breadcrumbs' );
						$pets_grooming_breadcrumbs = ob_get_contents();
						ob_end_clean();
						pets_grooming_show_layout( $pets_grooming_breadcrumbs, '<div class="sc_layouts_title_breadcrumbs">', '</div>' );
						?>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php
}
