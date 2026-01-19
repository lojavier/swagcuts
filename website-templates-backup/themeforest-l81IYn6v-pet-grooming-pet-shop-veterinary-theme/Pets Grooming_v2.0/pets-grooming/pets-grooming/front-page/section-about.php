<div class="front_page_section front_page_section_about<?php
	$pets_grooming_scheme = pets_grooming_get_theme_option( 'front_page_about_scheme' );
	if ( ! empty( $pets_grooming_scheme ) && ! pets_grooming_is_inherit( $pets_grooming_scheme ) ) {
		echo ' scheme_' . esc_attr( $pets_grooming_scheme );
	}
	echo ' front_page_section_paddings_' . esc_attr( pets_grooming_get_theme_option( 'front_page_about_paddings' ) );
	if ( pets_grooming_get_theme_option( 'front_page_about_stack' ) ) {
		echo ' sc_stack_section_on';
	}
?>"
		<?php
		$pets_grooming_css      = '';
		$pets_grooming_bg_image = pets_grooming_get_theme_option( 'front_page_about_bg_image' );
		if ( ! empty( $pets_grooming_bg_image ) ) {
			$pets_grooming_css .= 'background-image: url(' . esc_url( pets_grooming_get_attachment_url( $pets_grooming_bg_image ) ) . ');';
		}
		if ( ! empty( $pets_grooming_css ) ) {
			echo ' style="' . esc_attr( $pets_grooming_css ) . '"';
		}
		?>
>
<?php
	// Add anchor
	$pets_grooming_anchor_icon = pets_grooming_get_theme_option( 'front_page_about_anchor_icon' );
	$pets_grooming_anchor_text = pets_grooming_get_theme_option( 'front_page_about_anchor_text' );
if ( ( ! empty( $pets_grooming_anchor_icon ) || ! empty( $pets_grooming_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
	echo do_shortcode(
		'[trx_sc_anchor id="front_page_section_about"'
									. ( ! empty( $pets_grooming_anchor_icon ) ? ' icon="' . esc_attr( $pets_grooming_anchor_icon ) . '"' : '' )
									. ( ! empty( $pets_grooming_anchor_text ) ? ' title="' . esc_attr( $pets_grooming_anchor_text ) . '"' : '' )
									. ']'
	);
}
?>
	<div class="front_page_section_inner front_page_section_about_inner
	<?php
	if ( pets_grooming_get_theme_option( 'front_page_about_fullheight' ) ) {
		echo ' pets-grooming-full-height sc_layouts_flex sc_layouts_columns_middle';
	}
	?>
			"
			<?php
			$pets_grooming_css           = '';
			$pets_grooming_bg_mask       = pets_grooming_get_theme_option( 'front_page_about_bg_mask' );
			$pets_grooming_bg_color_type = pets_grooming_get_theme_option( 'front_page_about_bg_color_type' );
			if ( 'custom' == $pets_grooming_bg_color_type ) {
				$pets_grooming_bg_color = pets_grooming_get_theme_option( 'front_page_about_bg_color' );
			} elseif ( 'scheme_bg_color' == $pets_grooming_bg_color_type ) {
				$pets_grooming_bg_color = pets_grooming_get_scheme_color( 'bg_color', $pets_grooming_scheme );
			} else {
				$pets_grooming_bg_color = '';
			}
			if ( ! empty( $pets_grooming_bg_color ) && $pets_grooming_bg_mask > 0 ) {
				$pets_grooming_css .= 'background-color: ' . esc_attr(
					1 == $pets_grooming_bg_mask ? $pets_grooming_bg_color : pets_grooming_hex2rgba( $pets_grooming_bg_color, $pets_grooming_bg_mask )
				) . ';';
			}
			if ( ! empty( $pets_grooming_css ) ) {
				echo ' style="' . esc_attr( $pets_grooming_css ) . '"';
			}
			?>
	>
		<div class="front_page_section_content_wrap front_page_section_about_content_wrap content_wrap">
			<?php
			// Caption
			$pets_grooming_caption = pets_grooming_get_theme_option( 'front_page_about_caption' );
			if ( ! empty( $pets_grooming_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<h2 class="front_page_section_caption front_page_section_about_caption front_page_block_<?php echo ! empty( $pets_grooming_caption ) ? 'filled' : 'empty'; ?>"><?php echo wp_kses( $pets_grooming_caption, 'pets_grooming_kses_content' ); ?></h2>
				<?php
			}

			// Description (text)
			$pets_grooming_description = pets_grooming_get_theme_option( 'front_page_about_description' );
			if ( ! empty( $pets_grooming_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<div class="front_page_section_description front_page_section_about_description front_page_block_<?php echo ! empty( $pets_grooming_description ) ? 'filled' : 'empty'; ?>"><?php echo wp_kses( wpautop( $pets_grooming_description ), 'pets_grooming_kses_content' ); ?></div>
				<?php
			}

			// Content
			$pets_grooming_content = pets_grooming_get_theme_option( 'front_page_about_content' );
			if ( ! empty( $pets_grooming_content ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<div class="front_page_section_content front_page_section_about_content front_page_block_<?php echo ! empty( $pets_grooming_content ) ? 'filled' : 'empty'; ?>">
					<?php
					$pets_grooming_page_content_mask = '%%CONTENT%%';
					if ( strpos( $pets_grooming_content, $pets_grooming_page_content_mask ) !== false ) {
						$pets_grooming_content = preg_replace(
							'/(\<p\>\s*)?' . $pets_grooming_page_content_mask . '(\s*\<\/p\>)/i',
							sprintf(
								'<div class="front_page_section_about_source">%s</div>',
								apply_filters( 'the_content', get_the_content() )
							),
							$pets_grooming_content
						);
					}
					pets_grooming_show_layout( $pets_grooming_content );
					?>
				</div>
				<?php
			}
			?>
		</div>
	</div>
</div>
