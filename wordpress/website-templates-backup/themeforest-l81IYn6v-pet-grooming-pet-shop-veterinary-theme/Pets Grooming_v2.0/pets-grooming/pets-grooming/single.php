<?php
/**
 * The template to display single post
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

// Full post loading
$full_post_loading          = pets_grooming_get_value_gp( 'action' ) == 'full_post_loading';

// Prev post loading
$prev_post_loading          = pets_grooming_get_value_gp( 'action' ) == 'prev_post_loading';
$prev_post_loading_type     = pets_grooming_get_theme_option( 'posts_navigation_scroll_which_block', 'article' );

// Position of the related posts
$pets_grooming_related_position   = pets_grooming_get_theme_option( 'related_position', 'below_content' );

// Type of the prev/next post navigation
$pets_grooming_posts_navigation   = pets_grooming_get_theme_option( 'posts_navigation' );
$pets_grooming_prev_post          = false;
$pets_grooming_prev_post_same_cat = (int)pets_grooming_get_theme_option( 'posts_navigation_scroll_same_cat', 1 );

// Rewrite style of the single post if current post loading via AJAX and featured image and title is not in the content
if ( ( $full_post_loading 
		|| 
		( $prev_post_loading && 'article' == $prev_post_loading_type )
	) 
	&& 
	! in_array( pets_grooming_get_theme_option( 'single_style' ), array( 'style-6' ) )
) {
	pets_grooming_storage_set_array( 'options_meta', 'single_style', 'style-6' );
}

do_action( 'pets_grooming_action_prev_post_loading', $prev_post_loading, $prev_post_loading_type );

get_header();

while ( have_posts() ) {

	the_post();

	// Type of the prev/next post navigation
	if ( 'scroll' == $pets_grooming_posts_navigation ) {
		$pets_grooming_prev_post = get_previous_post( $pets_grooming_prev_post_same_cat );  // Get post from same category
		if ( ! $pets_grooming_prev_post && $pets_grooming_prev_post_same_cat ) {
			$pets_grooming_prev_post = get_previous_post( false );                    // Get post from any category
		}
		if ( ! $pets_grooming_prev_post ) {
			$pets_grooming_posts_navigation = 'links';
		}
	}

	// Override some theme options to display featured image, title and post meta in the dynamic loaded posts
	if ( $full_post_loading || ( $prev_post_loading && $pets_grooming_prev_post ) ) {
		pets_grooming_sc_layouts_showed( 'featured', false );
		pets_grooming_sc_layouts_showed( 'title', false );
		pets_grooming_sc_layouts_showed( 'postmeta', false );
	}

	// If related posts should be inside the content
	if ( strpos( $pets_grooming_related_position, 'inside' ) === 0 ) {
		ob_start();
	}

	// Display post's content
	get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/content', 'single-' . pets_grooming_get_theme_option( 'single_style' ) ), 'single-' . pets_grooming_get_theme_option( 'single_style' ) );

	// If related posts should be inside the content
	if ( strpos( $pets_grooming_related_position, 'inside' ) === 0 ) {
		$pets_grooming_content = ob_get_contents();
		ob_end_clean();

		ob_start();
		do_action( 'pets_grooming_action_related_posts' );
		$pets_grooming_related_content = ob_get_contents();
		ob_end_clean();

		if ( ! empty( $pets_grooming_related_content ) ) {
			$pets_grooming_related_position_inside = max( 0, min( 9, pets_grooming_get_theme_option( 'related_position_inside' ) ) );
			if ( 0 == $pets_grooming_related_position_inside ) {
				$pets_grooming_related_position_inside = mt_rand( 1, 9 );
			}

			$pets_grooming_p_number         = 0;
			$pets_grooming_related_inserted = false;
			$pets_grooming_in_block         = false;
			$pets_grooming_content_start    = strpos( $pets_grooming_content, '<div class="post_content' );
			$pets_grooming_content_end      = strrpos( $pets_grooming_content, '</div>' );

			for ( $i = max( 0, $pets_grooming_content_start ); $i < min( strlen( $pets_grooming_content ) - 3, $pets_grooming_content_end ); $i++ ) {
				if ( $pets_grooming_content[ $i ] != '<' ) {
					continue;
				}
				if ( $pets_grooming_in_block ) {
					if ( strtolower( substr( $pets_grooming_content, $i + 1, 12 ) ) == '/blockquote>' ) {
						$pets_grooming_in_block = false;
						$i += 12;
					}
					continue;
				} else if ( strtolower( substr( $pets_grooming_content, $i + 1, 10 ) ) == 'blockquote' && in_array( $pets_grooming_content[ $i + 11 ], array( '>', ' ' ) ) ) {
					$pets_grooming_in_block = true;
					$i += 11;
					continue;
				} else if ( 'p' == $pets_grooming_content[ $i + 1 ] && in_array( $pets_grooming_content[ $i + 2 ], array( '>', ' ' ) ) ) {
					$pets_grooming_p_number++;
					if ( $pets_grooming_related_position_inside == $pets_grooming_p_number ) {
						$pets_grooming_related_inserted = true;
						$pets_grooming_content = ( $i > 0 ? substr( $pets_grooming_content, 0, $i ) : '' )
											. $pets_grooming_related_content
											. substr( $pets_grooming_content, $i );
					}
				}
			}
			if ( ! $pets_grooming_related_inserted ) {
				if ( $pets_grooming_content_end > 0 ) {
					$pets_grooming_content = substr( $pets_grooming_content, 0, $pets_grooming_content_end ) . $pets_grooming_related_content . substr( $pets_grooming_content, $pets_grooming_content_end );
				} else {
					$pets_grooming_content .= $pets_grooming_related_content;
				}
			}
		}

		pets_grooming_show_layout( $pets_grooming_content );
	}

	// Comments
	do_action( 'pets_grooming_action_before_comments' );
	comments_template();
	do_action( 'pets_grooming_action_after_comments' );

	// Related posts
	if ( 'below_content' == $pets_grooming_related_position
		&& ( 'scroll' != $pets_grooming_posts_navigation || (int)pets_grooming_get_theme_option( 'posts_navigation_scroll_hide_related', 0 ) == 0 )
		&& ( ! $full_post_loading || (int)pets_grooming_get_theme_option( 'open_full_post_hide_related', 1 ) == 0 )
	) {
		do_action( 'pets_grooming_action_related_posts' );
	}

	// Post navigation: type 'scroll'
	if ( 'scroll' == $pets_grooming_posts_navigation && ! $full_post_loading ) {
		?>
		<div class="nav-links-single-scroll"
			data-post-id="<?php echo esc_attr( get_the_ID( $pets_grooming_prev_post ) ); ?>"
			data-post-link="<?php echo esc_attr( get_permalink( $pets_grooming_prev_post ) ); ?>"
			data-post-title="<?php the_title_attribute( array( 'post' => $pets_grooming_prev_post ) ); ?>"
			data-cur-post-link="<?php echo esc_attr( get_permalink() ); ?>"
			data-cur-post-title="<?php the_title_attribute(); ?>"
			<?php do_action( 'pets_grooming_action_nav_links_single_scroll_data', $pets_grooming_prev_post ); ?>
		></div>
		<?php
	}
}

get_footer();
