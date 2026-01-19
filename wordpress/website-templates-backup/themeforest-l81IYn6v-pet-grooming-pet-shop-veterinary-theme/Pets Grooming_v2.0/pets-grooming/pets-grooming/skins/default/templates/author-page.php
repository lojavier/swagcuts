<?php
/**
 * The template to display the user's avatar, bio and socials on the Author page
 *
 * @package PETS GROOMING
 * @since PETS GROOMING 1.71.0
 */
?>

<div class="author_page author vcard"<?php
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

	<h4 class="author_title"<?php
		if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
			?> itemprop="name"<?php
		}
	?>><span class="fn"><?php the_author(); ?></span></h4>

	<?php
	$pets_grooming_author_description = get_the_author_meta( 'description' );
	if ( ! empty( $pets_grooming_author_description ) ) {
		?>
		<div class="author_bio"<?php
			if ( pets_grooming_is_on( pets_grooming_get_theme_option( 'seo_snippets' ) ) ) {
				?> itemprop="description"<?php
			}
		?>><?php echo wp_kses( wpautop( $pets_grooming_author_description ), 'pets_grooming_kses_content' ); ?></div>
		<?php
	}
	?>

	<div class="author_details">
		<span class="author_posts_total">
			<?php
			$pets_grooming_posts_total = count_user_posts( get_the_author_meta('ID'), 'post' );	// get_the_author_posts() return posts number by post_type from first post in the result
			if ( $pets_grooming_posts_total > 0 ) {
				// Translators: Add the author's posts number to the message
				echo wp_kses( sprintf( _n( '%s article published', '%s articles published', $pets_grooming_posts_total, 'pets-grooming' ),
										'<span class="author_posts_total_value">' . number_format_i18n( $pets_grooming_posts_total ) . '</span>'
								 		),
							'pets_grooming_kses_content'
							);
			} else {
				esc_html_e( 'No posts published.', 'pets-grooming' );
			}
			?>
		</span><?php
			ob_start();
			do_action( 'pets_grooming_action_user_meta', 'author-page' );
			$pets_grooming_socials = ob_get_contents();
			ob_end_clean();
			pets_grooming_show_layout( $pets_grooming_socials,
				'<span class="author_socials"><span class="author_socials_caption">' . esc_html__( 'Follow:', 'pets-grooming' ) . '</span>',
				'</span>'
			);
		?>
	</div>

</div>
