<?php
/**
 * The Classic template to display the content
 *
 * Used for index/archive/search.
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

$pets_grooming_template_args = get_query_var( 'pets_grooming_template_args' );

if ( is_array( $pets_grooming_template_args ) ) {
	$pets_grooming_columns       = empty( $pets_grooming_template_args['columns'] ) ? 1 : max( 1, $pets_grooming_template_args['columns'] );
	$pets_grooming_blog_style    = array( $pets_grooming_template_args['type'], $pets_grooming_columns );
	$pets_grooming_columns_class = pets_grooming_get_column_class( 1, $pets_grooming_columns, ! empty( $pets_grooming_template_args['columns_tablet']) ? $pets_grooming_template_args['columns_tablet'] : '', ! empty($pets_grooming_template_args['columns_mobile']) ? $pets_grooming_template_args['columns_mobile'] : '' );
} else {
	$pets_grooming_template_args = array();
	$pets_grooming_blog_style    = explode( '_', pets_grooming_get_theme_option( 'blog_style' ) );
	$pets_grooming_columns       = empty( $pets_grooming_blog_style[1] ) ? 1 : max( 1, $pets_grooming_blog_style[1] );
	$pets_grooming_columns_class = pets_grooming_get_column_class( 1, $pets_grooming_columns );
}
$pets_grooming_expanded   = ! pets_grooming_sidebar_present() && pets_grooming_get_theme_option( 'expand_content' ) == 'expand';

$pets_grooming_post_format = get_post_format();
$pets_grooming_post_format = empty( $pets_grooming_post_format ) ? 'standard' : str_replace( 'post-format-', '', $pets_grooming_post_format );

?><div class="<?php
	if ( ! empty( $pets_grooming_template_args['slider'] ) ) {
		echo ' slider-slide swiper-slide';
	} else {
		echo ( pets_grooming_is_blog_style_use_masonry( $pets_grooming_blog_style[0] )
			? 'masonry_item masonry_item-1_' . esc_attr( $pets_grooming_columns )
			: esc_attr( $pets_grooming_columns_class )
			);
	}
?>"><article id="post-<?php the_ID(); ?>" data-post-id="<?php the_ID(); ?>"
	<?php
	post_class(
		'post_item post_item_container post_format_' . esc_attr( $pets_grooming_post_format )
				. ' post_layout_classic post_layout_classic_' . esc_attr( $pets_grooming_columns )
				. ' post_layout_' . esc_attr( $pets_grooming_blog_style[0] )
				. ' post_layout_' . esc_attr( $pets_grooming_blog_style[0] ) . '_' . esc_attr( $pets_grooming_columns )
	);
	pets_grooming_add_blog_animation( $pets_grooming_template_args );
	?>
>
	<?php

	// Sticky label
	if ( is_sticky() && ! is_paged() ) {
		?><span class="post_label label_sticky"></span><?php
	}

	// Featured image
	$pets_grooming_hover      = ! empty( $pets_grooming_template_args['hover'] ) && ! pets_grooming_is_inherit( $pets_grooming_template_args['hover'] )
							? $pets_grooming_template_args['hover']
							: pets_grooming_get_theme_option( 'image_hover' );

	$pets_grooming_components = ! empty( $pets_grooming_template_args['meta_parts'] )
							? ( is_array( $pets_grooming_template_args['meta_parts'] )
								? $pets_grooming_template_args['meta_parts']
								: array_map( 'trim', explode( ',', $pets_grooming_template_args['meta_parts'] ) )
								)
							: pets_grooming_array_get_keys_by_value( pets_grooming_get_theme_option( 'meta_parts' ) );

	pets_grooming_show_post_featured( apply_filters( 'pets_grooming_filter_args_featured',
		array(
			'thumb_size' => ! empty( $pets_grooming_template_args['thumb_size'] )
								? $pets_grooming_template_args['thumb_size']
								: pets_grooming_get_thumb_size(
									strpos( pets_grooming_get_theme_option( 'body_style' ), 'full' ) !== false
										? ( $pets_grooming_columns > 2 ? 'big' : 'full' )
										: ( $pets_grooming_columns > 2
											? 'med'
											: ( $pets_grooming_expanded || $pets_grooming_columns == 1 ? 
												( $pets_grooming_expanded && $pets_grooming_columns == 1 ? 'huge' : 'big' ) 
												: 'med' 
												)
											)												
								),
			'hover'      => $pets_grooming_hover,
			'meta_parts' => $pets_grooming_components,
			'no_links'   => ! empty( $pets_grooming_template_args['no_links'] ),
		),
		'content-classic',
		$pets_grooming_template_args
	) );

	// Title and post meta
	$pets_grooming_show_title = get_the_title() != '';
	$pets_grooming_show_meta  = count( $pets_grooming_components ) > 0;

	if ( $pets_grooming_show_title ) {
		?><div class="post_header entry-header"><?php
			// Categories
			if ( apply_filters( 'pets_grooming_filter_show_blog_categories', $pets_grooming_show_meta && in_array( 'categories', $pets_grooming_components ), array( 'categories' ), 'classic' ) ) {
				do_action( 'pets_grooming_action_before_post_category' );
				?><div class="post_category"><?php
					pets_grooming_show_post_meta( apply_filters(
														'pets_grooming_filter_post_meta_args',
														array(
															'components' => 'categories',
															'seo'        => false,
															'echo'       => true,
															),
														'hover_' . $pets_grooming_hover, 1
														)
										);
				?></div><?php
				$pets_grooming_components = pets_grooming_array_delete_by_value( $pets_grooming_components, 'categories' );
				do_action( 'pets_grooming_action_after_post_category' );
			}
			// Post title
			if ( apply_filters( 'pets_grooming_filter_show_blog_title', true, 'classic' ) ) {
				do_action( 'pets_grooming_action_before_post_title' );
				if ( empty( $pets_grooming_template_args['no_links'] ) ) {
					the_title( sprintf( '<h3 class="post_title entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h3>' );
				} else {
					the_title( '<h3 class="post_title entry-title">', '</h3>' );
				}
				do_action( 'pets_grooming_action_after_post_title' );
			}
		?></div><?php
	}
	
	// Post meta
	if ( apply_filters( 'pets_grooming_filter_show_blog_meta', $pets_grooming_show_meta, $pets_grooming_components, 'classic' ) ) {
		if ( count( $pets_grooming_components ) > 0 ) {
			do_action( 'pets_grooming_action_before_post_meta' );
			pets_grooming_show_post_meta(
				apply_filters(
					'pets_grooming_filter_post_meta_args', array(
						'components' => join( ',', $pets_grooming_components ),
						'seo'        => false,
						'echo'       => true,
						'author_avatar' => false,
					), $pets_grooming_blog_style[0], $pets_grooming_columns
				)
			);
			do_action( 'pets_grooming_action_after_post_meta' );
		}
	}

	// Post content
	ob_start();
	if ( apply_filters( 'pets_grooming_filter_show_blog_excerpt', ( ! isset( $pets_grooming_template_args['hide_excerpt'] ) || (int)$pets_grooming_template_args['hide_excerpt'] == 0 ) && (int)pets_grooming_get_theme_option( 'excerpt_length' ) > 0, 'classic' ) ) {
		pets_grooming_show_post_content( $pets_grooming_template_args, '<div class="post_content_inner">', '</div>' );
	}
	$pets_grooming_content = ob_get_contents();
	ob_end_clean();

	pets_grooming_show_layout( $pets_grooming_content, '<div class="post_content entry-content">', '</div>' );

		
	// More button
	if ( apply_filters( 'pets_grooming_filter_show_blog_readmore', ! $pets_grooming_show_title || ! empty( $pets_grooming_template_args['more_button'] ), 'classic' ) ) {
		if ( empty( $pets_grooming_template_args['no_links'] ) ) {
			do_action( 'pets_grooming_action_before_post_readmore' );
			pets_grooming_show_post_more_link( $pets_grooming_template_args, '<p>', '</p>' );
			do_action( 'pets_grooming_action_after_post_readmore' );
		}
	}

	?>

</article></div><?php
// Need opening PHP-tag above, because <div> is a inline-block element (used as column)!
