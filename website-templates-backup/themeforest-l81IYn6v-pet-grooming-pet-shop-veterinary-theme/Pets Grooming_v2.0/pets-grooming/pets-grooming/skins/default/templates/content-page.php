<?php
/**
 * The default template to display the content of the single page
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */
?>

<article id="post-<?php the_ID(); ?>"
	<?php
	post_class( 'post_item_single post_type_page' );
	pets_grooming_add_seo_itemprops();
	?>
>

	<?php
	do_action( 'pets_grooming_action_before_post_data' );

	pets_grooming_add_seo_snippets();

	do_action( 'pets_grooming_action_before_post_content' );
	?>

	<div class="post_content entry-content">
		<?php
			the_content();

			wp_link_pages(
				array(
					'before'      => '<div class="page_links"><span class="page_links_title">' . esc_html__( 'Pages:', 'pets-grooming' ) . '</span>',
					'after'       => '</div>',
					'link_before' => '<span>',
					'link_after'  => '</span>',
					'pagelink'    => '<span class="screen-reader-text">' . esc_html__( 'Page', 'pets-grooming' ) . ' </span>%',
					'separator'   => '<span class="screen-reader-text">, </span>',
				)
			);
			?>
	</div>

	<?php
	do_action( 'pets_grooming_action_after_post_content' );

	do_action( 'pets_grooming_action_after_post_data' );
	?>

</article>
