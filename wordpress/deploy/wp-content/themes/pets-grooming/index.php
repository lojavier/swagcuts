<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: //codex.wordpress.org/Template_Hierarchy
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */

$pets_grooming_template = apply_filters( 'pets_grooming_filter_get_template_part', pets_grooming_blog_archive_get_template() );

if ( ! empty( $pets_grooming_template ) && 'index' != $pets_grooming_template ) {

	get_template_part( $pets_grooming_template );

} else {

	pets_grooming_storage_set( 'blog_archive', true );

	get_header();

	if ( have_posts() ) {

		// Query params
		$pets_grooming_stickies   = is_home()
								|| ( in_array( pets_grooming_get_theme_option( 'post_type' ), array( '', 'post' ) )
									&& (int) pets_grooming_get_theme_option( 'parent_cat' ) == 0
									)
										? get_option( 'sticky_posts' )
										: false;
		$pets_grooming_post_type  = pets_grooming_get_theme_option( 'post_type' );
		$pets_grooming_args       = array(
								'blog_style'     => pets_grooming_get_theme_option( 'blog_style' ),
								'post_type'      => $pets_grooming_post_type,
								'taxonomy'       => pets_grooming_get_post_type_taxonomy( $pets_grooming_post_type ),
								'parent_cat'     => pets_grooming_get_theme_option( 'parent_cat' ),
								'posts_per_page' => pets_grooming_get_theme_option( 'posts_per_page' ),
								'sticky'         => pets_grooming_get_theme_option( 'sticky_style', 'inherit' ) == 'columns'
															&& is_array( $pets_grooming_stickies )
															&& count( $pets_grooming_stickies ) > 0
															&& get_query_var( 'paged' ) < 1
								);

		pets_grooming_blog_archive_start();

		do_action( 'pets_grooming_action_blog_archive_start' );

		if ( is_author() ) {
			do_action( 'pets_grooming_action_before_page_author' );
			get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/author-page' ) );
			do_action( 'pets_grooming_action_after_page_author' );
		}

		if ( pets_grooming_get_theme_option( 'show_filters', 0 ) ) {
			do_action( 'pets_grooming_action_before_page_filters' );
			pets_grooming_show_filters( $pets_grooming_args );
			do_action( 'pets_grooming_action_after_page_filters' );
		} else {
			do_action( 'pets_grooming_action_before_page_posts' );
			pets_grooming_show_posts( array_merge( $pets_grooming_args, array( 'cat' => $pets_grooming_args['parent_cat'] ) ) );
			do_action( 'pets_grooming_action_after_page_posts' );
		}

		do_action( 'pets_grooming_action_blog_archive_end' );

		pets_grooming_blog_archive_end();

	} else {

		if ( is_search() ) {
			get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/content', 'none-search' ), 'none-search' );
		} else {
			get_template_part( apply_filters( 'pets_grooming_filter_get_template_part', 'templates/content', 'none-archive' ), 'none-archive' );
		}
	}

	get_footer();
}
