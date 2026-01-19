<?php
/**
 * The "Style 1" template to display the content of the single post or attachment:
 * featured image, title and meta are placed inside the content area
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.75.0
 */
?>
<article id="post-<?php the_ID(); ?>"
	<?php
	post_class( 'post_item_single'
		. ' post_type_' . esc_attr( get_post_type() ) 
		. ' post_format_' . esc_attr( str_replace( 'post-format-', '', get_post_format() ) )
	);
	pets_grooming_add_seo_itemprops();
	?>
>
<?php

	do_action( 'pets_grooming_action_before_post_data' );

	pets_grooming_add_seo_snippets();

	// Single post thumbnail and title
	if ( apply_filters( 'pets_grooming_filter_single_post_header', is_singular( 'post' ) || is_singular( 'attachment' ) ) ) {
		// Post title and meta
		ob_start();
		pets_grooming_show_post_title_and_meta( array( 
			'author_avatar' => false,
			'show_labels'   => true,
			'share_type'    => 'list',
			'add_spaces'    => false,
			'cat_sep' 	    => false,
		) );
		$pets_grooming_post_header = ob_get_contents();
		ob_end_clean();
		// Featured image
		ob_start();
		pets_grooming_show_post_featured_image( array(
			'thumb_bg' => false,
		) );
		$pets_grooming_post_header .= ob_get_contents();
		ob_end_clean();
		$pets_grooming_with_featured_image = pets_grooming_is_with_featured_image( $pets_grooming_post_header );

		if ( strpos( $pets_grooming_post_header, 'post_featured' ) !== false
			|| strpos( $pets_grooming_post_header, 'post_title' ) !== false
			|| strpos( $pets_grooming_post_header, 'post_meta' ) !== false
		) {
			?>
			<div class="post_header_wrap post_header_wrap_in_content post_header_wrap_style_<?php
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

	do_action( 'pets_grooming_action_before_post_content' );

	// Post content
	?>
	<div class="post_content post_content_single entry-content"<?php
		if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
			?> itemprop="mainEntityOfPage"<?php
		}
	?>>
		<?php
		the_content();
		?>
	</div><!-- .entry-content -->
	<?php
	do_action( 'pets_grooming_action_after_post_content' );
	
	// Post footer: Tags, likes, share, author, prev/next links and comments
	do_action( 'pets_grooming_action_before_post_footer' );
	?>
	<div class="post_footer post_footer_single entry-footer">
		<?php
		pets_grooming_show_post_pagination();
		if ( is_single() && ! is_attachment() ) {
			pets_grooming_show_post_footer();
		}
		?>
	</div>
	<?php
	do_action( 'pets_grooming_action_after_post_footer' );
	?>
</article>
