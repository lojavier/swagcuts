<?php
/**
 * The "Style 2" template to display the post header of the single post or attachment:
 * featured image and title placed in the post header
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.75.0
 */

if ( apply_filters( 'pets_grooming_filter_single_post_header', pets_grooming_is_singular( 'post' ) || pets_grooming_is_singular( 'attachment' ) ) ) {
	$pets_grooming_post_format = str_replace( 'post-format-', '', get_post_format() );

	// Featured image
	ob_start();
	pets_grooming_show_post_featured_image( array(
		'thumb_bg'  => true,
	) );
	$pets_grooming_post_header = ob_get_contents();
	ob_end_clean();

	$pets_grooming_with_featured_image = pets_grooming_is_with_featured_image( $pets_grooming_post_header );

	// Post title and meta
	ob_start();
	pets_grooming_show_post_title_and_meta( array(
										'content_wrap'  => true,
										'share_type'    => 'list',
										'show_labels'   => true,
										'author_avatar' => false,
										'add_spaces'    => false,
										'cat_sep' 	    => false,
										)
									);
	$pets_grooming_post_header .= ob_get_contents();
	ob_end_clean();

	if ( strpos( $pets_grooming_post_header, 'post_featured' ) !== false
		|| strpos( $pets_grooming_post_header, 'post_title' ) !== false
		|| strpos( $pets_grooming_post_header, 'post_meta' ) !== false
	) {
		?>
		<div class="post_header_wrap post_header_wrap_in_header post_header_wrap_style_<?php
			echo esc_attr( pets_grooming_get_theme_option( 'single_style' ) );
			if ( $pets_grooming_with_featured_image ) {
				echo ' with_featured_image';
			}
		?>">
			<?php
			do_action( 'pets_grooming_action_before_post_header' );
			pets_grooming_show_layout( $pets_grooming_post_header );
			do_action( 'pets_grooming_action_after_post_header' );
			?>
		</div>
		<?php
	}
}
