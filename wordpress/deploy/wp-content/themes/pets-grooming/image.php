<?php
/**
 * The template to display the attachment
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */


get_header();

while ( have_posts() ) {
	the_post();

	// Display post's content
	get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/content', 'single-' . pets_grooming_get_theme_option( 'single_style' ) ), 'single-' . pets_grooming_get_theme_option( 'single_style' ) );

	// Parent post navigation.
	$pets_grooming_posts_navigation = pets_grooming_get_theme_option( 'posts_navigation' );
	if ( 'links' == $pets_grooming_posts_navigation ) {
		?>
		<div class="nav-links-single<?php
			if ( ! pets_grooming_is_off( pets_grooming_get_theme_option( 'posts_navigation_fixed', 0 ) ) ) {
				echo ' nav-links-fixed fixed';
			}
		?>">
			<?php
			the_post_navigation( apply_filters( 'pets_grooming_filter_post_navigation_args', array(
					'prev_text' => '<span class="nav-arrow"></span>'
						. '<span class="meta-nav" aria-hidden="true">' . esc_html__( 'Published in', 'pets-grooming' ) . '</span> '
						. '<span class="screen-reader-text">' . esc_html__( 'Previous post:', 'pets-grooming' ) . '</span> '
						. '<h5 class="post-title">%title</h5>'
						. '<span class="post_date">%date</span>',
			), 'image' ) );
			?>
		</div>
		<?php
	}

	// Comments
	do_action( 'pets_grooming_action_before_comments' );
	comments_template();
	do_action( 'pets_grooming_action_after_comments' );
}

get_footer();
