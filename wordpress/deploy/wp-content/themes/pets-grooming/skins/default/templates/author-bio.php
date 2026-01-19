<?php
/**
 * The template to display the Author bio
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.0
 */
?>

<div class="author_info author vcard"<?php
	if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
		?> itemprop="author" itemscope="itemscope" itemtype="<?php echo esc_attr( pets_grooming_get_protocol( true ) ); ?>//schema.org/Person"<?php
	}
?>>

	<div class="author_avatar"<?php
		if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
			?> itemprop="image"<?php
	}
	?>>
		<?php
		$pets_grooming_mult = pets_grooming_get_retina_multiplier();
		echo get_avatar( get_the_author_meta( 'user_email' ), 120 * $pets_grooming_mult );
		?>
	</div>

	<div class="author_description">
		<h6 class="author_title"<?php
			if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
				?> itemprop="name"<?php
			}
		?>><a class="author_link fn" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" rel="author"><?php
			the_author();
		?></a></h6>
		<div class="author_label"><?php esc_html_e( 'About Author', 'pets-grooming' ); ?></div>
		<div class="author_bio"<?php
			if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
				?> itemprop="description"<?php
			}
		?>>
			<?php echo wp_kses( wpautop( get_the_author_meta( 'description' ) ), 'pets_grooming_kses_content' ); ?>
			<div class="author_links">
				<?php do_action( 'pets_grooming_action_user_meta', 'author-bio' ); ?>
			</div>
		</div>

	</div>

</div>
